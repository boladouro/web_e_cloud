import {LoaderFunction, Params} from "react-router-dom";
import {Book} from "./types/types.ts";
import React from "react";

interface loaderParams {
  request: Request,
  params: Params<string> // PARAMS IS NOT THE URL PARAMS, IT'S THE ROUTER PARAMS (so it's not the ?q=, it's the :bookId)

}

export const bookLoader: LoaderFunction<Book> = async ({params}: loaderParams): Promise<Book> => {
  const response = await fetch(`http://localhost:3030/books/${params.bookId}`)
  if (response.ok) {
    return response.json();
  } else if (response.status == 404){
    throw new Response("Book not found", {status: 404})
  } else {
    throw response
  }
}

export const searchLoader: LoaderFunction<Book[]> = async ({request}: loaderParams): Promise<Book[]> => {
  // TODO this
  const urlParams = new URL(request.url).searchParams
  const q = urlParams.get("q")
  if (!q) {
    return []
  }
  const sort = urlParams.get("sort") ?? "score,publishedDate.$date"
  let order = urlParams.get("order") ?? "desc"
  // check if order has the same length as sort, and fill the missing values with desc
  if (order && order.length != sort.split(",").length) {
    order = order.split(",").concat(Array(sort.split(",").length - order.split(",").length).fill("desc")).join(",")
  }
  const page = urlParams.get("page") ?? "1"
  const params = ["title", "isbn", "publishedDate.$date", "shortDescription", "longDescription", "authors", "categories"]
  const response = await fetch(
    `http://localhost:3030/books?` +
    `q=${q}` +
    `&attr=${params.join(",")}` +
    `&_sort=${sort}` +
    `&_order=${order}` +
    `&_page=${page}` +
    `&_limit=10`
  ) // dont care abt sql injection
  return response.json();
}