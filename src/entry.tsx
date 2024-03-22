import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from "./Header.tsx";
import Home from "./Home.tsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "bulma"
import 'normalize.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
