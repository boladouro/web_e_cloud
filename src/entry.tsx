import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from "./Header.tsx";
import Home from "./Home.tsx";
import {BrowserRouter as Router, Routes, Route, createBrowserRouter} from "react-router-dom";
import "bulma"
import 'normalize.css';
import ErrorPage from "./ErrorPage.tsx";
import Root from "./Root.tsx";
import BookPage from "./BookPage.tsx";


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
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/" element={<Home />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
