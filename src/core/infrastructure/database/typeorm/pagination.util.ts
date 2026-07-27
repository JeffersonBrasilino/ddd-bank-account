export function getPaginationParams(page?: number, perPage?: number) {
  const take = perPage ?? 10;
  const pageNumber = page > 0 ? page - 1 : 0;
  return { take, skip: take * pageNumber };
}
