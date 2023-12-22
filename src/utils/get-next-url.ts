export function getNextUrl(
  totalPage: number,
  take: number,
  page: number,
  path: string,
): string {
  return page >= totalPage || take === 0
    ? null
    : `${process.env.BASE_URL}/${path}?page=${page + 1}&take=${take}`;
}
