import { useEffect, useState } from "react";
import { Book, BookComponent } from "../Components/Book"
import { useParams } from 'react-router-dom';
import dbjson from '../../db.json';

export default function BookPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | undefined>()

  useEffect(() => {
    const bookFound = dbjson.books.find((bookItem) => bookItem.id === params.bookId);
    if (bookFound) {
      setBook({
        id: bookFound.id,
        title: bookFound.title,
        isbn: bookFound.isbn,
        pageCount: bookFound.pageCount,
        publishedDate: new Date(bookFound.publishedDate.$date),
        thumbnailUrl: bookFound.thumbnailUrl,
        shortDescription: bookFound.shortDescription,
        longDescription: bookFound.longDescription,
        status: bookFound.status,
        authors: bookFound.authors,
        categories: bookFound.categories,
        score: bookFound.score,
        price: bookFound.price,
      })
    }
  }, [params.bookId])

  return (
    <>
      {book ? 
        <BookComponent 
          authors={book.authors}
          categories={book.categories}
          id={book.id}
          pageCount={book.pageCount}
          publishedDate={book.publishedDate}
          score={book.score}
          status={book.status}
          title={book.title}
          isbn={book.isbn}
          longDescription={book.longDescription}
          price={book.price}
          shortDescription={book.shortDescription}
          thumbnailUrl={book.thumbnailUrl}
        /> 
      : <h1>Livro não encontrado</h1>}
    </>
  )
}