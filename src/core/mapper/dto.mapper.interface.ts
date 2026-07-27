export interface DtoMapperInterface<T> {
  toDto<TDto extends new (...args: any[]) => {}>(
    data: T,
    convertTo?: TDto,
  ): InstanceType<TDto>;
}
