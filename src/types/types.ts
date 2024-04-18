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

export interface filters {
  category?: Set<string>
  price?: [number, number]
  publishedDate?: [Date?, Date?]
  author?: string
  title?: string
  sort?: "score" | "publishedDate" | "price" | "-score" | "-publishedDate" | "-price"
}

export type filtersKeys = keyof filters