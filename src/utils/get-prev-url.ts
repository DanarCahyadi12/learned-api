export function getPrevUrl(page: number, take: number, path: string): string {
  return page > 1
    ? `${process.env.BASE_URL}/${path}?page=${page - 1}&take=${take}`
    : null;
}
