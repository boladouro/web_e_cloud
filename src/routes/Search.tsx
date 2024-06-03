import { Book, PaginationLinks } from "../types.ts";
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
  const loaderData = useLoaderData() as [Book[], PaginationLinks?];
  const [books, paginationLinks] = loaderData;
  const [renderPagination, setRenderPagination] = useState<boolean>(false);

  useEffect(() => {
    if (paginationLinks) {
      setRenderPagination(true);
    } else {
      setRenderPagination(false);
    }
  }, [paginationLinks]);

  let [searchParams, setSearchParams] = useSearchParams();
  const currPage = parseInt(searchParams.get("page") ?? "1");

  if (!Array.isArray(books)) {
    console.error("books is not an array", books);
    return <div>Error loading books.</div>;
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
      {renderPagination && paginationLinks && (
        <Pagination>
          <PaginationContent>
            {currPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", paginationLinks.first!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {paginationLinks.first}
                </PaginationLink>
              </PaginationItem>
            )}
            {currPage > 3 && <PaginationEllipsis />}
            {paginationLinks.prev && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", paginationLinks.prev!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {paginationLinks.prev}
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
            {paginationLinks.next && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", paginationLinks.next!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {paginationLinks.next}
                </PaginationLink>
              </PaginationItem>
            )}
            {currPage < (paginationLinks.last as unknown as number) - 2 && <PaginationEllipsis />}
            {currPage < (paginationLinks.last as unknown as number) - 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    searchParams.set("page", paginationLinks.last!.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {paginationLinks.last}
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
