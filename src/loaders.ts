import {LoaderFunction, Params} from "react-router-dom";
import {Book} from "./types/types.ts";

export const bookLoader: LoaderFunction<Book> = async ({params}: {request: Request, params: Params<string>}): Promise<Book> => {
  const response = await fetch(`http://localhost:3030/books/${params.bookId}`)
  if (response.ok) {
    return response.json();
  } else if (response.status == 404){
    throw new Response("Book not found", {status: 404})
  } else {
    throw response
  }
}