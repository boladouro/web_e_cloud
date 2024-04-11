import {Outlet} from "react-router-dom";
import Header from "../Components/Header.tsx";

export default function Root() {
  const headerSpacing = "h10vh";

  return <>
    <Header spacing={headerSpacing} />
    <div className={headerSpacing}></div>
    <Outlet />
  </>
}