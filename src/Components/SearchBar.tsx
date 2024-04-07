import {Form} from "react-router-dom";
import React from "react";
import Icon from "./Icon.tsx";
import {FaSearch} from "react-icons/fa";
import {Button} from "react-bulma-components";
import styled from 'styled-components';

const WithSearch = styled.div`
  
  &:after {
    // write the icon here
    content: "🔍"; // TODO replace with icon
    animation: none;
    display: block;
    position: absolute !important;
    z-index: 4;
    top: 0.5em;
    inset-inline-end: 0.75em;
  }
`;

export function SearchBar() {
  return <>
    <Form method={"get"} action={""}>
      <div className="field has-addons">
        <WithSearch className="control">
          <input className="input" type="text" placeholder="Book"/> {/* TODO add placeholder from random from popular */}
        </WithSearch>
      </div>
    </Form>
  </>
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // TODO
}

const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
  // TODO
}