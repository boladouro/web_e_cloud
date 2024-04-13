// https://react-restart.github.io/ui/
import {useState} from "react";
import {SearchBar} from "./SearchBar.tsx";
import styled from "styled-components";

const NoBackgroundItem = styled.a`
  &:hover {
    background-color: transparent !important;
  }
`;




// TODO add burger https://bulma.io/documentation/components/navbar/
function Header() {
  return (
    <nav className={"navbar"} role={"navigation"}>
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
          <NoBackgroundItem className={"navbar-item hover:cursor-default"}><SearchBar className={"w100"} size={"normal"}/></NoBackgroundItem>
        </div>

        <div className={"navbar-end"}>
          {/*TODO shopping cart*/}
        </div>
      </div>
    </nav>
  )
}

export default Header