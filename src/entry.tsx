import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from "./Home.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "bulma"
import 'normalize.css';
import ErrorPage from "./routes/ErrorPage.tsx";
import Root from "./routes/Root.tsx";
import BookPage from "./routes/BookPage.tsx";
import 'virtual:uno.css'

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
      }
    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}  />
  </React.StrictMode>,
)
