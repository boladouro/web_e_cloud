import React from "react";
import { Form } from "react-router-dom";
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa'; // Import the Font Awesome icon

const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 0.75em;
  right: 0.75em;
  z-index: 4;
  color: var(--bulma-input-placeholder-color);
  font-size:  var(--bulma-size-medium);
`;

export function SearchBar({className = ""}:{className?: string}) {
  return (
    <div className="field has-addons">
      <div className="control">
        <input className={"input is-medium " + className} type="text" placeholder="Book"/>
        <SearchIcon />
      </div>
    </div>
  );
}