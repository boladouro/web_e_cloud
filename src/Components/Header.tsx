// https://react-restart.github.io/ui/
import {Nav, NavItem as ReNavItem, Button, NavItemProps, Dropdown} from "@restart/ui";

import {DynamicRefForwardingComponent} from "@restart/ui/types";
import {FC, useState} from "react";
import {UseDropdownToggleProps} from "@restart/ui/DropdownToggle";
import {UserDropdownMenuProps} from "@restart/ui/DropdownMenu";

const NavItem: FC<NavItemProps> = ({children, ...props}) => {
  return <ReNavItem as={"a"} {...props}>{children}</ReNavItem>
}
// TODO add burger https://bulma.io/documentation/components/navbar/
function Header() {

  const [dropdownShow, setDropdownShow] = useState(true)

  return (
    <Nav className={"navbar"} role={"navigation"}>
      <div className={"navbar-brand"}>
        <NavItem className={"navbar-item"}>
          <img src={"/vite.svg"} alt={"logo"}/>
        </NavItem>
      </div>
      <div className={"navbar-menu"} id={"header-menu"}>
        <div className={"navbar-start"}>
          <NavItem className={"navbar-item has-dropdown"}>
            <Dropdown show={false} onToggle={(nextShow) => setDropdownShow(nextShow)} placement={"bottom-end"}>
              <Dropdown.Toggle>
                {(props: UseDropdownToggleProps) => <a className={"navbar-link"}>Discover</a>}
              </Dropdown.Toggle>
              <Dropdown.Menu usePopper={false}>
                {(props: UserDropdownMenuProps) => (<a className={dropdownShow ? "navbar-dropdown is-active" : "navbar-dropdown"}>Dropdown</a>)}
              </Dropdown.Menu>
            </Dropdown>
          </NavItem>
        </div>
        <div className={"navbar-end"}>
          {/*TODO shopping cart*/}
        </div>
      </div>
    </Nav>
  )
}

export default Header