import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { useState, createContext, ReactNode } from "react";
import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";

import "bulma"
import 'normalize.css';
import 'virtual:uno.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./tailwind.css";

import Home from "./routes/Home.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import Root from "./routes/Root.tsx";


import BookPage from "./routes/BookPage.tsx";
import CartPage from './routes/Cart.tsx';
import {ShouldRevalidateFunctionArgs} from "@remix-run/router/utils.ts";
import {bookLoader, searchLoader} from "./loaders_contexts.ts";
import Search from "./routes/Search.tsx";

const CartContext = createContext({
    NBook: 0,
    Total: 0,
    Books: [],
  });
  export default CartContext;


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
        path: "book/:bookId/:bookTitle?",
        element: <BookPage/>,
        loader: bookLoader,
        shouldRevalidate: (args: ShouldRevalidateFunctionArgs) => {
          console.log("args", args)
          return !(args.currentParams.bookId == args.nextParams.bookId && !args.currentParams.title);
        }
      },
      {
        path: "search/",
        element: <Search />,
        loader: searchLoader,
      }
      ,
      {
        path: "cart/",
        element: <CartPage />,
        loader: bookLoader,
      }
    ]
  },
]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
     <CartContext.Provider value={{Total:0 ,NBook:0, Books:[]}}>
      <RouterProvider router={router}/>
    </CartContext.Provider>
  </React.StrictMode>,
);
