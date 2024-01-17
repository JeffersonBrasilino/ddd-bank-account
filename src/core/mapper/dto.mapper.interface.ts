export interface DtoMapperInterface<T> {
  toDto(data: T, convertTo?: string | boolean);
}
