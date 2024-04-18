// https://react-restart.github.io/ui/

import React, {useEffect} from "react";
import {SearchBar} from "./SearchBar.tsx";
import {Link, useLocation} from "react-router-dom";




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
            <a className={"navbar-link"}>Discover</a> {/*TODO add links*/}
            <div className={"navbar-dropdown"}>
              <a className={"navbar-item"}>New</a>
              <a className={"navbar-item"}>Top Rated</a>
            </div>
          </div>
          <a id={"header-search-bar"} className={
            `navbar-item hover:cursor-default important:bg-transparent ${searchBarVisible ? "": "hidden"}`
          }><SearchBar className={"w100"} size={"normal"}/></a>
        </div>
        <div className={"navbar-end"}>
          {/*TODO shopping cart*/}
        </div>
      </div>
    </nav>
  )
}

export default Header