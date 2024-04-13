import {Outlet} from "react-router-dom";
import Header from "../Components/Header.tsx";
import React from "react";

export const ApiContext = React.createContext({});

export default function Root() {
  const headerSpacing = "h10vh";

  return <>
    <Header spacing={headerSpacing} />
    <div className={headerSpacing}></div>
    <Outlet />
  </>
}