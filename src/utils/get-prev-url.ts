export function getPrevUrl(page: number, take: number): string {
  return page > 1
    ? `${process.env.BASE_URL}/classroom/created?page=${page - 1}&take=${take}`
    : null;
}
