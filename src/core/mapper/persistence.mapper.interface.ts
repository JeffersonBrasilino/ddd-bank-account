export interface PersistenceMapperInterface<T> {
  toPersistence(domainData: T);
}
