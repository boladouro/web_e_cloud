import {Button, Navbar} from "react-bulma-components";

function Header() {
  return (
    <Navbar px={2}>
      <Navbar.Brand>
        <Navbar.Item href={"/"}>
          <img src={"/vite.svg"} alt={"logo"}/>
        </Navbar.Item>
      </Navbar.Brand>
      <Navbar.Container align={"left"}>

      </Navbar.Container>
      <Navbar.Container align={"right"}>

      </Navbar.Container>
    </Navbar>
  )
}

export default Header