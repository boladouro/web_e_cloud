import {Book} from "../types/types.ts";
import {useLoaderData} from "react-router-dom";

export default function Search() {
  const results = useLoaderData() as Book[];
  return <>
    <h1>Search</h1>
    <ul>
      {results.map(book => <li key={book.id}>{book.title}</li>)}
    </ul>
  </>
}