import {Book} from "../types/types.ts";
import {Link, Navigate, useLocation, useParams} from "react-router-dom";
import React from "react";
import {LoaderFunction, Params, useLoaderData, LoaderFunctionArgs, json} from "react-router-dom";

export const bookLoader: LoaderFunction<Book> = async ({params}: {request: Request, params: Params<string>}): Promise<Book> => {
	const response = await fetch(`http://localhost:3030/books/${params.bookId}`)
  if (response.ok) {
    return response.json();
  } else if (response.status == 404){
    throw new Response("Book not found", {status: 404})
  } else {
    throw response
  }
}

export default function BookPage() {
  const {bookId, bookTitle} = useParams()
  const book: Book = useLoaderData() as Book;
  if (!bookTitle) {
    return <Navigate to={`/books/${bookId}/no-title`} replace/>
  }
  console.log("book", book)
  return <>
    <Link to={"/books/20"}>toBook20</Link>
    <br />
    <Link to={"/books/20/aodfhasohda"}>toBook20Withthing</Link>
    <div className="component">
      <ul className="align">
        <li>
          <figure className='book'>
            <ul className='hardcover_front'>
              <li>
                <div className="coverDesign blue">
                  <h1>{book.title}</h1>
                  <br/>
                  <p>€{book.price}</p>
                </div>
              </li>
              <li></li>
            </ul>
            <ul className='page'>
              <li></li>
              <li>
                <h1>Descrition</h1>
                <p>{book.longDescription}</p>
                <h1>Authors</h1>
                <p>{book.authors}</p>
                <h1>Categories</h1>
                <p>{book.categories}</p>
                <br/>
                <a className="btn" href="#">Add Car</a></li>
              <li></li>
              <li></li>
              <li>
              </li>
            </ul>
            <ul className='hardcover_back'>
              <li></li>
              <li></li>
            </ul>
            <ul className='book_spine'>
              <li></li>
              <li></li>
            </ul>
          </figure>
        </li>
      </ul>
    </div>
  </>
}