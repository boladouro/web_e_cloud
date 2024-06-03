import { Book, QueryResults } from "../types.ts";
import { useLoaderData, useSearchParams } from "react-router-dom";
import BookComponent from "../Components/BookComponent.tsx";
import React, { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/Components/ui/pagination";

export default function Search() {
  const loaderData = useLoaderData() as QueryResults;
  console.log(loaderData)
  const { data: books, pages:pages } = loaderData;
  const [renderPagination, setRenderPagination] = useState<boolean>(false);

  useEffect(() => {
    if (pages) {
      setRenderPagination(true);
    } else {
      setRenderPagination(false);
    }
  }, [pages]);

  let [searchParams, setSearchParams] = useSearchParams();
  const currPage = parseInt(searchParams.get("page") ?? "1");

  if (!Array.isArray(books)) {
    console.error("books is not an array: ", books);
    return <div>Error loading books</div>;
  }

  return (
    <>
      <div className={"grid is-col-min-10 before:content-none after:content-none m3"}>
        {books.length === 0 && <h1 className={"text-2xl"}>No books match your search</h1>}
        {books.map(book => (
          <div className={"cell max-w-20em"} key={book.id}>
            <BookComponent book={book} />
          </div>
        ))}
      </div>
      {renderPagination && pages && (
        <Pagination>
          <PaginationContent>
            {currPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", pages.first!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {pages.first}
                </PaginationLink>
              </PaginationItem>
            )}
            {currPage > 3 && <PaginationEllipsis />}
            {pages.prev && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", pages.prev!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {pages.prev}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  searchParams.set("page", currPage.toString());
                  setSearchParams(searchParams);
                }}
                isActive={true}
              >
                {currPage}
              </PaginationLink>
            </PaginationItem>
            {pages.next && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", pages.next!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {pages.next}
                </PaginationLink>
              </PaginationItem>
            )}
            {currPage < (pages.last as unknown as number) - 2 && <PaginationEllipsis />}
            {currPage < (pages.last as unknown as number) - 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", pages.last!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {pages.last}
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
