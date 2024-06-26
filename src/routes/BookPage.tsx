import {Book} from "../types.ts";
import {Navigate, useLoaderData, useParams} from "react-router-dom";
import React, { useContext, useState } from "react";
import {PrettyBook} from "../Components/PrettyBook.tsx";



export default function BookPage() {
  const {bookId, bookTitle} = useParams()
  const book: Book = useLoaderData() as Book;
  if (!bookTitle) {
    return <Navigate to={`/book/${bookId}/${book.title}`} replace/>
  }
  console.log("book", book)
  console.log("booktitle", bookTitle)
  return <PrettyBook props={book}/>
}