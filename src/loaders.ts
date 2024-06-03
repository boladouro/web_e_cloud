import {LoaderFunction, Params} from "react-router-dom";
import {Book, PaginationLinks, QueryResults} from "./types.ts";

interface loaderParams {
  request: Request,
  params: Params<string> // PARAMS IS NOT THE URL PARAMS, IT'S THE ROUTER PARAMS (so it's not the ?q=, it's the :bookId)
}

export const bookLoader: LoaderFunction<Book> = async ({params}: loaderParams): Promise<Book> => {
  const response = await fetch(`http://127.0.0.1:5000/api/v1/books/${params.bookId}`)
  if (response.ok) {
    return response.json()
  } else if (response.status == 404){
    throw new Response("Book not found", {status: 404})
  } else {
    throw response
  }
}


export const searchLoader: LoaderFunction<Book[]> = async ({ request }: { request: Request }): Promise<QueryResults> => {
  const urlParams = new URL(request.url).searchParams;
  const q = (urlParams.get("q") ?? "").trim();
  const limit: string | null = urlParams.get("limit");
  const page: string | null = urlParams.get("page");
  let url: string;
  if (q.startsWith("category:")) {
    // q = category:romance[,fantasy]
    url = `http://127.0.0.1:5000/api/v1/books/categorias/${q.slice(9)}`;
  } else if (q.startsWith("price:")) {
    const [min, max, order] = q.slice(6).split(",");
    url = `http://127.0.0.1:5000/api/v1/books/price?minPrice=${min}&maxPrice=${max}&orderBy=${order}`;
  } else if (q.startsWith("ano:")) {
    url = `http://127.0.0.1:5000/api/v1/books/ano/${q.slice(4)}`;
  } else if (q.startsWith("autor:")) {
    url = `http://127.0.0.1:5000/api/v1/books/autor/${q.slice(6)}`;
  } else {
    url = `http://127.0.0.1:5000/api/v1/books?q=${q}`;
  }
  url += `${limit ? `&limit=${limit}` : ""}${page ? `&page=${page}` : ""}`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.json() as Promise<QueryResults>;
  } else {
    throw response;
  }
};

