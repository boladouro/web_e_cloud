import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { useState, createContext } from "react";

import "bulma"
import 'normalize.css';
import 'virtual:uno.css'

import Home from "./routes/Home.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import Root from "./routes/Root.tsx";
import BookPage from "./routes/BookPage.tsx";
import Cart from "./routes/Cart.tsx";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "book/:bookId",
        element: <BookPage />
      },
      {
        path: "cart/",
        element: <Cart />
      },
    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}  />
  </React.StrictMode>,
)


export type BulmaSize = "small" | "normal" | "medium" | "large"