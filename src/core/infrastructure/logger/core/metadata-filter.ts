 
 
 

interface FilterConfig {
  blacklistedKeys: string[];
  whitelistedKeys: string[];
  placeholder?: string;
}

export class MetadataFilter {
  private readonly jsPrimitives = ["string", "number", "boolean", "bigint", "symbol"];

  private readonly placeholder: string;

  private readonly blacklistRegexps: RegExp[];

  private readonly whitelistSet: Set<string>;

  private readonly blacklistCache = new Map<string, boolean>();

  public constructor(
    public readonly blacklistedKeys: string[] = [],
    public readonly whitelistedKeys: string[] = [],
    config: Partial<FilterConfig> = {},
  ) {
    this.placeholder = config.placeholder ?? "*sensitive*";

    if (blacklistedKeys.length > 0) {
      const pattern = blacklistedKeys.map((key) => this.escapeRegExp(key)).join("|");
      this.blacklistRegexps = [new RegExp(pattern, "i")];
    } else {
      this.blacklistRegexps = [];
    }

    this.whitelistSet = new Set(whitelistedKeys.map((key) => key.toLowerCase()));
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  public filter(record: { [key: string]: any }): { [key: string]: unknown } {
    if (!record || typeof record !== "object" || record === null) {
      return {};
    }

    return this.processObject(record);
  }

  private processObject(obj: Record<string, any>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (this.isOnBlacklist(key) && this.isArrayWithPrimitives(value)) {
        result[key] = value.map((item: unknown) => this.setPlaceholder(item));
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          result[key] = [];
          continue;
        }

        result[key] = value.map((item) =>
          typeof item === "object" && item !== null ? this.processObject(item) : item,
        );
      } else if (this.isPlainObject(value)) {
        result[key] = this.processObject(value);
      } else if (this.isJSONString(value)) {
        this.processJSONString(key, value, result);
      } else if (this.isJSONType(value)) {
        if (this.isOnBlacklist(key)) {
          result[key] = this.setPlaceholder(value);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  private processJSONString(key: string, value: string, result: Record<string, unknown>): void {
    try {
      const parsedJson = JSON.parse(value);
      if (Array.isArray(parsedJson)) {
        if (parsedJson.length === 0) {
          result[key] = "[]";
          return;
        }

        const processedArray = parsedJson.map((item) =>
          typeof item === "object" && item !== null ? this.processObject(item) : item,
        );
        result[key] = JSON.stringify(processedArray);
      } else if (typeof parsedJson === "object" && parsedJson !== null) {
        result[key] = JSON.stringify(this.processObject(parsedJson));
      } else {
        result[key] = value;
      }
    } catch {
      result[key] = value;
    }
  }

   
  private setPlaceholder(value: unknown): string {
    if (typeof value !== "string") {
      return this.placeholder;
    }

    if (value.length < 8) {
      return this.placeholder;
    }

    return `${value.slice(0, 2)}${this.placeholder}${value.slice(-2)}`;
  }
   

  private isOnBlacklist(key: string): boolean {
    if (this.blacklistCache.has(key)) {
      return this.blacklistCache.get(key) as boolean;
    }

    const lowerKey = key.toLowerCase();

    if (this.whitelistSet.has(lowerKey)) {
      this.blacklistCache.set(key, false);
      return false;
    }

    if (this.blacklistRegexps.length === 0) {
      this.blacklistCache.set(key, false);
      return false;
    }

    const isBlacklisted = this.blacklistRegexps[0].test(lowerKey);
    this.blacklistCache.set(key, isBlacklisted);
    return isBlacklisted;
  }

  private isPlainObject(value: any): boolean {
    return value?.constructor === Object || Array.isArray(value);
  }

  private isArrayWithPrimitives(value: unknown): value is unknown[] {
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }

    return value.some((element) => this.jsPrimitives.includes(typeof element));
  }

  private isJSONType(value: unknown): boolean {
    if (value === undefined) {
      return false;
    }

    if (value === null) {
      return true;
    }

    return typeof value !== "object" || Array.isArray(value) || this.isPlainObject(value) || value instanceof Date;
  }

  private isJSONString(value: unknown): boolean {
    if (typeof value !== "string") {
      return false;
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return false;
    }

    const firstChar = trimmed.charAt(0);
    const lastChar = trimmed.charAt(trimmed.length - 1);

    if ((firstChar !== "{" || lastChar !== "}") && (firstChar !== "[" || lastChar !== "]")) {
      return false;
    }

    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }
}
 
 
 
