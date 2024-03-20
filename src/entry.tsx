import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from "./Header.tsx";
import Main from "./Main.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Header />
    <Main />
  </React.StrictMode>,
)
