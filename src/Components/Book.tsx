function Book() {
  return <>

  </>
}

// há 1 livro de teste, TODO dps perguntar ao prof o q fazer com esse
export interface Book {
  id: `${number}` | string // livro de teste é 120a
  title: string
  isbn?: string
  pageCount?: number // teste n tem tmb
  publishedDate?: {$date: `${(number)}-${(number)}-${(number)}`} // YYYY-MM-DD
  thumbnailUrl?: string
  shortDescription?: string
  longDescription?: string
  status?: "PUBLISH"
  authors?: string[]
  categories?: string[]
  score?: number
}