// https://react-restart.github.io/ui/

import React, {useState} from "react";
import {SearchBar} from "./SearchBar.tsx";
import styled from "styled-components";
import {useLocation} from "react-router-dom";

const NoBackgroundItem = styled.a`
  &:hover {
    background-color: transparent !important;
  }
`;




// TODO add burger https://bulma.io/documentation/components/navbar/
function Header({spacing= "h10vh"}) {
  const location = useLocation();
  React.useEffect(() => {

  }, [location])
  return (
    <nav className={`navbar is-fixed-top ${spacing}`} role={"navigation"}>
      <div className={"navbar-brand"}>
        <NoBackgroundItem className={"navbar-item"}>
          <img src={"/vite.svg"} alt={"logo"}/>
        </NoBackgroundItem>
      </div>
      <div className={"navbar-menu"} id={"header-menu"}>
        <div className={"navbar-start"}>
          <div className={"navbar-item has-dropdown is-hoverable"}>
            <a className={"navbar-link"}>Discover</a>
            <div className={"navbar-dropdown"}>
              <a className={"navbar-item"}>New</a>
              <a className={"navbar-item"}>Top Rated</a>
            </div>
          </div>
          <NoBackgroundItem id={"header-search-bar"} className={
            `navbar-item hover:cursor-default ${location.pathname == "/" ? "hidden": ""}`
          }><SearchBar className={"w100"} size={"normal"}/></NoBackgroundItem>
        </div>

        <div className={"navbar-end"}>
          {/*TODO shopping cart*/}
        </div>
      </div>
    </nav>
  )
}

export default Header