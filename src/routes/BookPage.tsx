import {Book} from "../types/types.ts";
import {Navigate, useLoaderData, useParams} from "react-router-dom";
import React from "react";
import {PrettyBook} from "../Components/PrettyBook.tsx";

export default function BookPage() {
  const {bookId, bookTitle} = useParams()
  const book: Book = useLoaderData() as Book;
  if (!bookTitle) {
    return <Navigate to={`/book/${bookId}/${book.title.replaceAll(" ", "-")}`} replace/>
  }
  console.log("book", book)
  return <PrettyBook props={book}/>
}