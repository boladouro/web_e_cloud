function Book() {
  return <>

  </>
}

// há 1 livro de teste, TODO dps perguntar ao prof o q fazer com esse
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