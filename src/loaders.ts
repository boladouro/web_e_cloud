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
    return response.json()
  } else if (response.status == 404){
    throw new Response("Book not found", {status: 404})
  } else {
    throw response
  }
}

export type paginationHeaderResult = `<${string}>; rel="${string}"`
//If the price is empty then it' doesn't query but that shouldn't happen irl
type OrderType = "asc" | "desc";
type SortableFields = "score" | "publishedDate" | "price" | "-score" | "-publishedDate" | "-price";

type Filters = {
  sort?: string;
  author?: string;
  publishedDate?: string[];
  category?: Set<string>;
  price?: string[];
};

export const searchLoader: LoaderFunction<Book[]> = async ({ request }: { request: Request }): Promise<[Book[], PaginationLinks?]> => {
  const urlParams = new URL(request.url).searchParams;
  const q = urlParams.get("q") ?? "";
  const [qNoFilters, filters]: [string, Filters] = qSeparateColon(q);
  
  let order: OrderType = "asc";
  
  // Processar a ordenação
  if (filters.sort?.startsWith("-")) {
    filters.sort = filters.sort.slice(1) as SortableFields;
    order = "desc";
  } else {
    order = "asc";
  }
  
  // Parâmetros comuns
  const page = urlParams.get("page") ?? "1";
  const attrs = ["title", "publishedDate.$date", "authors", "categories"];
  const baseUrl = "http://127.0.0.1:5000/api/v1/books";
  

  let apiUrl = baseUrl;
  

  if (filters.author) {
    apiUrl += `/autor/${filters.author.replace("+", " ")}`;
  } else if (filters.publishedDate) {

    if (filters.publishedDate[0]) {
      const ano = (filters.publishedDate[0] as unknown as string).slice(0, 4); 
      apiUrl += `/ano/${ano}`;
    }
  } else if (filters.category) {

    const categorias = Array.from(filters.category).map((val: string) => val.replace("+", " ")).join(",");
    apiUrl += `/categorias/${categorias}`;
  } else if (filters.price) {

    const minPrice = filters.price[0] ?? "0";
    const maxPrice = filters.price[1] ?? "1000000";
    apiUrl += `/price/?minPrice=${minPrice}&maxPrice=${maxPrice}&orderBy=${order}`;
  } else {
    apiUrl += `/featured`;
  }
  

  apiUrl += `?q=${qNoFilters}&attr=${attrs.join(",")}&_page=${page}&_limit=10`;
  
  console.log(`Fetching URL: ${apiUrl}`);
  
  const response = await fetch(apiUrl);
  const books: Book[] = await response.json();

  const linkHeader = response.headers.get('link');
  let paginationLinks: PaginationLinks | undefined = undefined;

  if (linkHeader) {
    paginationLinks = parseLinkHeader(linkHeader);
  }
  
  return [books, paginationLinks];
};


type PaginationLinks = {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
};


function parseLinkHeader(header: string): PaginationLinks {
  const links: PaginationLinks = {};
  const parts = header.split(',');

  parts.forEach(part => {
    const section = part.split(';');
    if (section.length !== 2) return;

    const url = section[0].replace(/<(.*)>/, '$1').trim();
    const name = section[1].replace(/rel="(.*)"/, '$1').trim() as keyof PaginationLinks;

    links[name] = url;
  });

  return links;
}
