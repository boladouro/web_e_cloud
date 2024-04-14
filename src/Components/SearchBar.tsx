import React, {useState} from "react";
import {Form, useParams, useSearchParams} from "react-router-dom";
import styled from 'styled-components';
import {FaSearch, FaSortDown, FaSortUp} from 'react-icons/fa';
import {BulmaSize} from "../types/types.ts"; // Import the Font Awesome icon



export function SearchBar({size = "medium", className = ""}:{size: BulmaSize, className?: string}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 32%;
  right: 0.75em;
  z-index: 4;
  color: var(--bulma-input-placeholder-color);
  font-size: var(--bulma-size-${size});
`;

  return (
    <Form method={"get"} action={"/search"} className="field has-addons important:mb0">
      <div className="control">
        <input className={`input is-${size} ${className}`} name={"q"} type="text" placeholder="Título, Autor, ou tema"
               defaultValue={searchParams.get("q") ?? ""}/>
        <button role={"button"}><SearchIcon/></button>
      </div>
    </Form>
  );
}