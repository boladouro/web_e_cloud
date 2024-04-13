import {Book} from "../types/types.ts";
import {useLocation} from "react-router-dom";
import React from "react";
import {LoaderFunction, Params, useLoaderData} from "react-router-dom";

export const bookLoader: LoaderFunction<Book> = ({params}: {request: Request, params: Params<string>}) => {
	return fetch(`https://localhost:3030/books/4`).then(res => res.json())
}

export default function BookPage() {
  const book: Book = useLoaderData() as Book;
  console.log("book", book)
  return <>
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