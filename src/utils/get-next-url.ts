export function getNextUrl(
  totalData: number,
  take: number,
  page: number,
): string {
  const totalPage: number = Math.ceil(totalData / take);
  return page >= totalPage
    ? null
    : `${process.env.BASE_URL}/classroom/created?page=${page + 1}&take=${take}`;
}
