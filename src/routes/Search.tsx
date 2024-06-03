import { Book, QueryResults } from "../types.ts";
import {useLoaderData, useLocation, useSearchParams} from "react-router-dom";
import BookComponent from "../Components/BookComponent.tsx";
import React, { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/Components/ui/pagination";

function getPageNumberFromUrl(url: string): number | null {
  const urlParams = new URL(url).searchParams;
  const page = urlParams.get("page");
  if (page) {
    return parseInt(page);
  }
  return null;
}

export default function Search() {
  const loaderData = useLoaderData() as QueryResults;
  console.log(loaderData)
  const { data: books, pages } = loaderData;
  const [renderPagination, setRenderPagination] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    if (pages?.docCount > 1) {
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
                <PaginationLink href={pages.first!}>
                  {getPageNumberFromUrl(pages.first!)}
                </PaginationLink>
              </PaginationItem>
            )}
            {currPage > 3 && <PaginationEllipsis />}
            {pages.prev && (
              <PaginationItem>
                <PaginationLink href={pages.prev!}>
                  {getPageNumberFromUrl(pages.prev!)}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => {

                }}
                isActive={true}
              >
                {currPage}
              </PaginationLink>
            </PaginationItem>
            {pages.next && (
              <PaginationItem>
                <PaginationLink href={pages.next!}>
                  {getPageNumberFromUrl(pages.next!)}
                </PaginationLink>
              </PaginationItem>
            )}
            {currPage < (pages.last as unknown as number) - 2 && <PaginationEllipsis />}
            {currPage < (pages.last as unknown as number) - 1 && (
              <PaginationItem>
                <PaginationLink href={pages.last!}>
                  {getPageNumberFromUrl(pages.last!)}
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
