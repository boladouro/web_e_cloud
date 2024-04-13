import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import { useState, createContext } from "react";
import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";

import "bulma"
import 'normalize.css';
import 'virtual:uno.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Home from "./routes/Home.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import Root from "./routes/Root.tsx";
import BookPage from "./routes/BookPage.tsx";
import Cart from "./routes/Cart.tsx";


import BookPage, {bookLoader} from "./routes/BookPage.tsx";
import {ShouldRevalidateFunctionArgs} from "@remix-run/router/utils.ts";


// TODO add dynamic document title
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Navigate to={"/home"} replace/>
      },
      {
        path: "home",
        element: <Home/>
      },
      {
        path: "books/:bookId/:bookTitle?",
        element: <BookPage/>,
        loader: bookLoader,
        shouldRevalidate: (args: ShouldRevalidateFunctionArgs) => {
          console.log("args", args)
          return !(args.currentParams.bookId == args.nextParams.bookId && !args.currentParams.title);
        }
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)


