import {Book} from "../types/types.ts";
import {useLoaderData} from "react-router-dom";
import {PrettyBook} from "../Components/PrettyBook.tsx";
import BookComponent from "../Components/BookComponent.tsx";
import {useEffect} from "react";

// TODO filter, sort, pagination
// TODO add message to when no book match
// search bar is in header
export default function Search() {
  const results = useLoaderData() as Book[];
  console.log(results)
  // useEffect(() => {
  //   document.title = "Search results"
  // }, [])

  return <>
    <div className={"grid is-col-min-10 before:content-none after:content-none m3"}>
      {results.map(book => <div className={"cell"}><BookComponent book={book}/></div>)}
    </div>
  </>
}