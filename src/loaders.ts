import {LoaderFunction, Params} from "react-router-dom";
import {Book, PaginationLinks} from "./types.ts";
import {qSeparateColon} from "@/lib/utils.ts";

interface loaderParams {
  request: Request,
  params: Params<string> // PARAMS IS NOT THE URL PARAMS, IT'S THE ROUTER PARAMS (so it's not the ?q=, it's the :bookId)

}

export const bookLoader: LoaderFunction<Book> = async ({params}: loaderParams): Promise<Book> => {
  const response = await fetch(`http://127.0.0.1:5000/api/v1/books/${params.bookId}`)
  if (response.ok) {
    const data = await response.json();
    return data.data[0].books 
  } else if (response.status == 404){
    throw new Response("Book not found", {status: 404})
  } else {
    throw response
  }
}

export type paginationHeaderResult = `<${string}>; rel="${string}"`
// If the price is empty then it' doesn't query but that shouldn't happen irl
export const searchLoader: LoaderFunction<Book[]> = async ({request}: loaderParams): Promise<[Book[], PaginationLinks?]> => {
  // headers.link:
  // <http://localhost:3030/books?q=&_page=1&_limit=10>; rel="first", <http://localhost:3030/books?q=&_page=1&_limit=10>; rel="prev", <http://localhost:3030/books?q=&_page=3&_limit=10>; rel="next", <http://localhost:3030/books?q=&_page=4&_limit=10>; rel="last"

  const urlParams = new URL(request.url).searchParams
  const q = urlParams.get("q") ?? ""
  const [qNoFilters, filters] = qSeparateColon(q)
  let order: "asc" | "desc";
  // const sort = urlParams.get("sort") ?? "score,publishedDate.$date" // no score available in api
  if (filters.sort?.startsWith("-")) {
    // @ts-expect-error
    filters.sort = filters.sort.slice(1)
    order = "desc"
  } else {
    order = "asc"
  }
  const page = urlParams.get("page") ?? "1"
  const attrs = ["title", "isbn", "publishedDate.$date", "shortDescription", "longDescription", "authors", "categories"]
  const response = await fetch(
    `http://localhost:3030/books?` +
    `q=${qNoFilters}` +
    `&attr=${attrs.join(",")}` +
    `&_sort=${filters.sort ?? "publishedDate" }` +
    `&_order=${order}` +
    `&title_like=${filters.title?.replace("+", " ") ?? ""}` +
    `&authors_like=${filters.author?.replace("+", " ") ?? ""}` +
    // `&price_gte=${filters.price?.[0] ?? "0"}` +
    // `&price_lte=${filters.price?.[1] ?? "1000000"}` +
    // `&publishedDate.$date_gte=${filters.publishedDate?.[0] ?? "19000101"}` +
    // `&publishedDate.$date_lte=${filters.publishedDate?.[1] ?? "30000101"}` +
    // categories is an OR array
    (filters.category ? `&categories_like=(?:${[...filters.category!].map(val => val.replace("+", " ")).join("|")})`: "") +
    `&_page=${page}` +
    `&_limit=10`
  ) // dont care abt sql injection
  console.log(response)
  if (!response.headers.has("link") || response.headers.get("link")!.trim() === "") {
    return [await response.json(), undefined]
  }
  // @ts-expect-error
  const links: PaginationLinks = {}
  response.headers.get("link")?.split(", ").map((link: string) => {
    let [url, rel] = link.split("; ")
    url = url.slice(1, -1)
    rel = rel.slice(5, -1)
    links[rel as keyof PaginationLinks] = [parseInt(new URL(url).searchParams.get("_page") ?? "1"), url]
  })
  return [await response.json(), links]
}