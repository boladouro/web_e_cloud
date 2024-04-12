import React from "react";
import { Form } from "react-router-dom";
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import {BulmaSize} from "../types/types.ts"; // Import the Font Awesome icon



export function SearchBar({size = "medium", className = ""}:{size: BulmaSize, className?: string}) {
  const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 32%;
  right: 0.75em;
  z-index: 4;
  color: var(--bulma-input-placeholder-color);
  font-size: var(--bulma-size-${size});
`;
  return (
    <div className="field has-addons important:mb0">
      <div className="control">
        <input className={`input is-${size} ${className}`} type="text" placeholder="Título, Autor, ou tema"/>
        <SearchIcon />
      </div>
    </div>
  );
}