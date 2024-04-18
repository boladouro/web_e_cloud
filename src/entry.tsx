import React, { useContext, useState, createContext, ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Book } from './types.ts';
import ReactDOM from 'react-dom/client';
import "bulma";
import 'normalize.css';
import 'virtual:uno.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./tailwind.css";

import Home from "./routes/Home.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import Root from "./routes/Root.tsx";
import BookPage from "./routes/BookPage.tsx";
import CartPage from './routes/Cart.tsx';
import { ShouldRevalidateFunctionArgs } from "@remix-run/router/utils.ts";
import { bookLoader, searchLoader } from "./loaders.ts";
import Search from "./routes/Search.tsx";

const CartContext = createContext({
  NBook: 0,
  Total: 0,
  Books: [],
  addCart: (book: Book) => {}, 
  remoCart: (bookId: string) => {}, 
  clearCart: () => {},
});

export default CartContext;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [Books, setBooks] = useState<Book[]>([]);
  const [NBook, setNBook] = useState<number>(0);
  const [Total, setTotal] = useState<number>(0);

  const addCart = (book: Book) => {
    setBooks([...Books, book]);
    setNBook(NBook + 1);
  };

  const remoCart = (bookId: string) => {
    const indexToRemove = Books.findIndex((book) => book.id === bookId);
    if (indexToRemove !== -1) {
      const updatedBooks = [...Books.slice(0, indexToRemove), ...Books.slice(indexToRemove + 1)];
      setBooks(updatedBooks);
      setNBook(NBook - 1);
    }
  };

  const clearCart = () => {
    setBooks([]);
    setNBook(0);
    setTotal(0);
  };

  return (
    <CartContext.Provider value={{ Total, NBook, Books, addCart, remoCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to={"/home"} replace />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "book/:bookId/:bookTitle?",
        element: <BookPage />,
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
      },
      {
        path: "cart/",
        element: <CartPage />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);