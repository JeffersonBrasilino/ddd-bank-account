 
import { MetadataFilter } from "../core/metadata-filter";

class Dummy {}

interface TestCase {
  value: Record<string, any>;
  expected: Record<string, any>;
}

const placeholder = "*sensitive*";
const loggerMetadataFilter = new MetadataFilter(["card", "pass"], ["passportId"]);
const runFilterAndExpectations = ({ value, expected }: TestCase): void => {
  expect(loggerMetadataFilter.filter(value)).toEqual(expected);
};

describe("MetadataFilter", () => {
  describe(".filter", () => {
    it("should replace string values from list with placeholders", () => {
      runFilterAndExpectations({
        value: { cardNumber: "5175033959689000" },
        expected: { cardNumber: `51${placeholder}00` },
      });
    });

    it("should replace non string values from list with placeholders", () => {
      runFilterAndExpectations({
        value: { cardNumber: 1234567890 },
        expected: { cardNumber: placeholder },
      });
    });

    it("should not replace values with placeholder when not listed", () => {
      runFilterAndExpectations({
        value: { name: "John Doe" },
        expected: { name: "John Doe" },
      });
    });

    it("should deeply replace values from list with placeholders", () => {
      runFilterAndExpectations({
        value: { cardInfo: { cardNumber: "0000000000000000" } },
        expected: { cardInfo: { cardNumber: `00${placeholder}00` } },
      });
    });

    it("should remove any object that are not directly constructed from Object class", () => {
      runFilterAndExpectations({
        value: { test: new Dummy() },
        expected: {},
      });
    });

    it("should deeply remove any object that are not directly constructed from Object class", () => {
      runFilterAndExpectations({
        value: { deep: { test: new Dummy() } },
        expected: { deep: {} },
      });
    });

    it("should inspect JSON string for blacklisted keys", () => {
      runFilterAndExpectations({
        value: { card: '{"cardNumber":"000000000000","holder":"FOO BAR"}' },
        expected: { card: `{"cardNumber":"00${placeholder}00","holder":"FOO BAR"}` },
      });
    });

    it("should ignore blacklisting a broken JSON string", () => {
      runFilterAndExpectations({
        value: { list: '[{"cardNumber":"000000000000","holder":"FOO BAR"' },
        expected: { list: '[{"cardNumber":"000000000000","holder":"FOO BAR"' },
      });
    });

    it("should inspect array elements for blacklisted keys", () => {
      runFilterAndExpectations({
        value: { list: [{ cardNumber: "000000000000" }] },
        expected: { list: [{ cardNumber: `00${placeholder}00` }] },
      });
    });

    it("should inspect JSON stringified array elements for blacklisted keys", () => {
      runFilterAndExpectations({
        value: { cards: '[{"cardNumber":"000000000000"}]' },
        expected: { cards: `[{"cardNumber":"00${placeholder}00"}]` },
      });
    });

    it("should replace array with primitive elements of a blacklisted key", () => {
      runFilterAndExpectations({
        value: {
          cards: ["abc", true],
          brand: ["allowed"],
        },
        expected: {
          cards: [placeholder, placeholder],
          brand: ["allowed"],
        },
      });
    });

    it("should inspect JSON stringified array with primitive elements for blacklisted keys", () => {
      runFilterAndExpectations({
        value: { cards: '[{"cardNumbers":["111111111111","999999999999"]}]' },
        expected: { cards: `[{"cardNumbers":["11${placeholder}11","99${placeholder}99"]}]` },
      });
    });

    it("should return a cloned instance of the object", () => {
      const value = {};
      expect(loggerMetadataFilter.filter(value)).not.toBe(value);
    });

    it("should deeply return a cloned instance of the object", () => {
      const value = { deep: {} };
      expect(loggerMetadataFilter.filter(value.deep)).not.toBe(value.deep);
    });

    it("should remove null or undefined values", () => {
      runFilterAndExpectations({
        value: { age: null, job: undefined },
        expected: {},
      });
    });

    it("should deeply remove null or undefined values", () => {
      runFilterAndExpectations({
        value: { person: { age: null, job: undefined } },
        expected: { person: {} },
      });
    });

    it("should allow keywords on whitelist", () => {
      runFilterAndExpectations({
        value: { user: { password: "123456789", passportId: "PASS-0148" } },
        expected: {
          user: {
            password: `12${placeholder}89`,
            passportId: "PASS-0148",
          },
        },
      });
    });

    it("should handle null or undefined input", () => {
      expect(loggerMetadataFilter.filter(null as any)).toEqual({});
      expect(loggerMetadataFilter.filter(undefined as any)).toEqual({});
    });

    it("should handle non-object input", () => {
      expect(loggerMetadataFilter.filter("string" as any)).toEqual({});
      expect(loggerMetadataFilter.filter(123 as any)).toEqual({});
    });

    it("should handle empty arrays", () => {
      runFilterAndExpectations({
        value: { cards: [] },
        expected: { cards: [] },
      });
    });

    it("should handle empty arrays in JSON strings", () => {
      runFilterAndExpectations({
        value: { cards: "[]" },
        expected: { cards: "[]" },
      });
    });

    it("should handle Date objects", () => {
      const date = new Date();
      runFilterAndExpectations({
        value: { createdAt: date },
        expected: { createdAt: date },
      });
    });

    it("should handle short string values on blacklisted keys", () => {
      runFilterAndExpectations({
        value: { cardNumber: "123" },
        expected: { cardNumber: placeholder },
      });
    });

    it("should handle empty JSON strings", () => {
      runFilterAndExpectations({
        value: { data: "" },
        expected: { data: "" },
      });
    });

    it("should handle invalid JSON structure", () => {
      runFilterAndExpectations({
        value: { data: "{not a json}" },
        expected: { data: "{not a json}" },
      });
    });

    it("should handle JSON strings that are not objects or arrays", () => {
      runFilterAndExpectations({
        value: { data: '"just a string"' },
        expected: { data: '"just a string"' },
      });
    });

    it("should preserve primitive values in JSON strings", () => {
      runFilterAndExpectations({
        value: { data: JSON.stringify(123) },
        expected: { data: JSON.stringify(123) },
      });
    });

    it("should preserve primitive values in blacklisted JSON arrays", () => {
      runFilterAndExpectations({
        value: { cards: JSON.stringify([1, 2, 3]) },
        expected: { cards: JSON.stringify([1, 2, 3]) },
      });
    });

    it("should handle multiple blacklisted keys with the same value", () => {
      const filter = new MetadataFilter(["card", "creditCard"], []);
      const value = { card: "1234567890", creditCard: "1234567890" };
      const expected = { card: `12${placeholder}90`, creditCard: `12${placeholder}90` };
      expect(filter.filter(value)).toEqual(expected);
    });

    it("should handle multiple calls to isOnBlacklist with the same key", () => {
      const filter = new MetadataFilter(["card"], []);
      const record = { card: "1234567890" };

      const result1 = filter.filter(record);
      const result2 = filter.filter(record);

      expect(result1).toEqual(result2);
      expect(result1).toEqual({ card: `12${placeholder}90` });
    });

    it("should handle non-string primitive values in JSON arrays with blacklisted keys", () => {
      runFilterAndExpectations({
        value: { cards: "[123, true, null]" },
        expected: { cards: "[123,true,null]" },
      });
    });

    it("should handle empty filter configuration", () => {
      const emptyFilter = new MetadataFilter();
      const value = { cardNumber: "1234567890" };
      expect(emptyFilter.filter(value)).toEqual(value);
    });

    it("should handle custom placeholder", () => {
      const customPlaceholder = "###REDACTED###";
      const customFilter = new MetadataFilter(["card"], [], { placeholder: customPlaceholder });
      const value = { cardNumber: "1234567890" };
      const expected = { cardNumber: `12${customPlaceholder}90` };
      expect(customFilter.filter(value)).toEqual(expected);
    });

    it("should handle special regex characters in blacklisted keys", () => {
      const specialFilter = new MetadataFilter(["card", "pass", "user.info"], []);
      const value = {
        cardStar: "1234567890",
        passPlus: "abcdef",
        "user.info": "sensitive data",
      };
      const expected = {
        cardStar: `12${placeholder}90`,
        passPlus: `${placeholder}`,
        "user.info": `se${placeholder}ta`,
      };
      expect(specialFilter.filter(value)).toEqual(expected);
    });

    it("should handle array with no primitive elements", () => {
      runFilterAndExpectations({
        value: { cards: [{ id: 1 }, { id: 2 }] },
        expected: { cards: [{ id: 1 }, { id: 2 }] },
      });
    });

    it("should handle JSON string with a non-object non-array value", () => {
      runFilterAndExpectations({
        value: { data: '"stringValue"' },
        expected: { data: '"stringValue"' },
      });
    });

    it("should handle edge cases in isArrayWithPrimitives", () => {
      const emptyArray: unknown[] = [];
      const objectArray = [{ a: 1 }, { b: 2 }];

      runFilterAndExpectations({
        value: { emptyArr: emptyArray, objArr: objectArray },
        expected: { emptyArr: emptyArray, objArr: objectArray },
      });
    });

    it("should handle malformed JSON that causes JSON.parse to fail in processJSONString", () => {
      const malformedJson = '{"key": "value", error: true}';
      runFilterAndExpectations({
        value: { badJson: malformedJson },
        expected: { badJson: malformedJson },
      });
    });

    it("should handle undefined values in isJSONType method", () => {
      const obj: { definedProp?: string; undefinedProp?: unknown } = {};
      obj.definedProp = "value";
      obj.undefinedProp = undefined;

      runFilterAndExpectations({
        value: obj,
        expected: { definedProp: "value" },
      });
    });

    describe("isJSONType method coverage", () => {
      const filter = new MetadataFilter();
      const isJSONType = (value: unknown): boolean => (filter as any).isJSONType(value);

      it("should return false for undefined", () => {
        expect(isJSONType(undefined)).toBe(false);
      });

      it("should handle string values", () => {
        expect(isJSONType("string value")).toBe(true);
      });

      it("should handle number values", () => {
        expect(isJSONType(123)).toBe(true);
        expect(isJSONType(0)).toBe(true);
        expect(isJSONType(-1)).toBe(true);
      });

      it("should handle boolean values", () => {
        expect(isJSONType(true)).toBe(true);
        expect(isJSONType(false)).toBe(true);
      });

      it("should handle Array values", () => {
        expect(isJSONType([])).toBe(true);
        expect(isJSONType(["test"])).toBe(true);
      });

      it("should handle plain object values", () => {
        expect(isJSONType({})).toBe(true);
        expect(isJSONType({ key: "value" })).toBe(true);
      });

      it("should handle Date objects", () => {
        expect(isJSONType(new Date())).toBe(true);
      });

      it("should handle null values", () => {
        expect(isJSONType(null)).toBe(true);
      });
    });
  });
});
 
