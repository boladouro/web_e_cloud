import {Book, PaginationLinks} from "../types/types.ts";
import {useLoaderData, useSearchParams} from "react-router-dom";
import {PrettyBook} from "../Components/PrettyBook.tsx";
import BookComponent from "../Components/BookComponent.tsx";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination"

// TODO add message to when no book match
// search bar is in header
export default function Search() {
  const [books, paginationLinks] = useLoaderData() as [Book[], PaginationLinks?];
  const [renderPagination, setRenderPagination] = React.useState<boolean>(false)
  useEffect(() => {
    if (paginationLinks) {
      setRenderPagination(true)
    } else {
      setRenderPagination(false)
    }
  }, [paginationLinks]);
  // get params
  let [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams)
  console.log(paginationLinks)
  const currPage = parseInt(searchParams.get("page") ?? "1")
  return <>
    <div className={"grid is-col-min-10 before:content-none after:content-none m3"}>
      {books.map(book => <div className={"cell max-w-20em"}><BookComponent book={book}/></div>)}
    </div>
    {paginationLinks && <Pagination>
      <PaginationContent>
        {currPage > 2 && <PaginationItem><PaginationLink onClick={() => {searchParams.set("page", paginationLinks.first[0].toString()); setSearchParams(searchParams)} } >{paginationLinks.first[0]}</PaginationLink></PaginationItem>}
        {currPage > 3 && <PaginationEllipsis/>}
        {paginationLinks.prev && <PaginationItem><PaginationLink onClick={() => {searchParams.set("page", paginationLinks.prev![0].toString()); setSearchParams(searchParams)} } >{paginationLinks.prev[0]}</PaginationLink></PaginationItem>}
        <PaginationItem><PaginationLink onClick={() => {searchParams.set("page", currPage.toString()); setSearchParams(searchParams)} } isActive={true}>{currPage}</PaginationLink></PaginationItem>
        {paginationLinks.next && <PaginationItem><PaginationLink onClick={() => {searchParams.set("page", paginationLinks.next![0].toString()); setSearchParams(searchParams)} }>{paginationLinks.next[0]}</PaginationLink></PaginationItem>}
        {currPage < paginationLinks.last[0] - 2 && <PaginationEllipsis/>}
        {currPage < paginationLinks.last[0] - 1 && <PaginationItem><PaginationLink onClick={() => {searchParams.set("page", paginationLinks.last[0].toString()); setSearchParams(searchParams)} }>{paginationLinks.last[0]}</PaginationLink></PaginationItem>}
      </PaginationContent>
    </Pagination>}
  </>
}