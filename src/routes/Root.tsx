import {Outlet} from "react-router-dom";
import Header from "../Components/Header.tsx";

export default function Root() {
  return <>
    <Header />
    <Outlet />
  </>
}