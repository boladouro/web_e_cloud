// https://react-restart.github.io/ui/

import React, {useContext, useEffect} from "react";
import {SearchBar} from "./SearchBar.tsx";
import {Link, useLocation} from "react-router-dom";
import CartContext from "../entry.tsx";
import { FaShoppingBasket } from 'react-icons/fa';
import { styled } from "styled-components";
import { BulmaSize } from "@/types/types.ts";




// TODO add Links of dropdown
// TODO add burger https://bulma.io/documentation/components/navbar/
function Header({spacing= "h10vh"}) {
  const location = useLocation()
  const [searchBarVisible, setSearchBarVisible] = React.useState(false)
  useEffect(() => {
    if (location.pathname == "/home") {
      setSearchBarVisible(false)
    } else {
      setSearchBarVisible(true)
    }
  }, [location.pathname])


  const BasketshoIcon = styled(FaShoppingBasket)`
    position: flex;
    top: 32%;
    right: 2.5em;
    z-index: 4;
    color: var(--bulma-input-placeholder-color);
    font-size: large;
  `;


  const { Total, NBook, Books } = useContext(CartContext);



  return (
    <nav className={`navbar is-fixed-top ${spacing} max-h-60px`} role={"navigation"}>
      <div className={"navbar-brand"}>
        <Link to={"/"} className={"navbar-item important:hover:bg-transparent"}>
          <img src={"/vite.svg"} alt={"logo"}/>
        </Link>
      </div>
      <div className={"navbar-menu"} id={"header-menu"}>
        <div className={"navbar-start"}>
          <div className={"navbar-item has-dropdown is-hoverable"}>
            <Link to={"/search?q="} className={"navbar-link"}>Discover</Link> {/*TODO add links*/}
            <div className={"navbar-dropdown"}>
              <Link to={"/search?q=sort:publishedDate"} className={"navbar-item"}>New</Link>
              <Link to={"/search?q=sort:score"} className={"navbar-item"}>Top Rated</Link>
            </div>
          </div>
          <a id={"header-search-bar"} className={
            `navbar-item hover:cursor-default important:bg-transparent ${searchBarVisible ? "": "hidden"}`
          }><SearchBar className={"w100"} size={"normal"}/></a>
        </div>
        <div className={"navbar-end"}>
          <span className="navbar-item">{NBook}</span>
          <Link to={"/cart"} className={"navbar-item important:hover:bg-transparent"}>
            <BasketshoIcon />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header