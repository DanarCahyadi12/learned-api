export function getNextUrl(
  totalPage: number,
  take: number,
  page: number,
): string {
  return page >= totalPage
    ? null
    : `${process.env.BASE_URL}/classroom/created?page=${page + 1}&take=${take}`;
}
