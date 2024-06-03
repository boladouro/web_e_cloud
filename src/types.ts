export interface Book {
  id: `${number}`
  title: string
  isbn?: string
  pageCount: number
  publishedDate: {$date: `${(number)}-${(number)}-${(number)}`} // YYYY-MM-DD
  thumbnailUrl?: string
  shortDescription?: string
  longDescription?: string
  status: "PUBLISH"
  authors: string[]
  categories: string[]
  score: number
  price?: number
}

export type BulmaSize = "small" | "normal" | "medium" | "large"

export type QueryResults = {
  pages: {
    first?: number;
    prev?: number;
    curr: number;
    next?: number;
    last?: number;
  },
  data: Book[];
}