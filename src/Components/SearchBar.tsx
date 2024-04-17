import React, {useEffect, useState} from "react";
import {Form, useParams, useSearchParams} from "react-router-dom";
import styled from 'styled-components';
import {FaFilter, FaSearch, FaSortDown, FaSortUp} from 'react-icons/fa';
import {Book, BulmaSize} from "../types/types.ts"; // Import the Font Awesome icon

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"
import {Button} from "@/Components/ui/button.tsx";
import {qSeparateColon} from "@/lib/utils.ts";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/Components/ui/command.tsx";
import {FancyMultiSelect} from "@/Components/ui/fancymultiselect.tsx";

export function SearchBar({size = "medium", className = ""}:{size: BulmaSize, className?: string}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [qNoFilters, filters] = qSeparateColon(q);
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    const response = fetch(`http://localhost:3030/books`).then((response) => {
      if (!response.ok) {
        throw response
      }
      return response.json() as Promise<Book[]>
    }).then((books) => {
      books.map(book => book.categories).flat()
      const categories = Array.from(new Set(books.map(book => book.categories).flat()))
      return Array.from(new Set(books.map(book => book.categories).flat())).sort()
    }).then(setCategories)
  }, [])
  const SearchIcon = styled(FaSearch)`
    position: absolute;
    top: 32%;
    right: 0.75em;
    z-index: 4;
    color: var(--bulma-input-placeholder-color);
    font-size: var(--bulma-size-${size});
  `;
  const FilterIcon = styled(FaFilter)`
    position: absolute;
    top: 32%;
    right: 2.5em;
    z-index: 4;
    color: var(--bulma-input-placeholder-color);
    font-size: var(--bulma-size-${size});
  `;
  const FilterPopover = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: start;
    z-index: 5;
    background-color: rgb(37, 68, 86);
    margin: 1em;
    padding: 2em;
  `;
  console.log(categories)

  return (
    <Form method={"get"} action={"/search"} className="field has-addons important:mb0">
      <div className="control">
        <input className={`input is-${size} ${className}`} name={"q"} type="text" placeholder="Título, Autor, ou tema"
               defaultValue={q}/>
        <Popover>
          <PopoverTrigger>
            <Button variant={"outline"} role={"button"}><FilterIcon/></Button>
          </PopoverTrigger>
          <PopoverContent>
            <FilterPopover>
              <FancyMultiSelect width={"10em"} placeholder={"Categorias"} items={categories.map((val) => {return {value: val, label: val}})}/>
            </FilterPopover>
          </PopoverContent>
        </Popover>
        <Button variant={"outline"} role={"button"}><SearchIcon/></Button>
      </div>
    </Form>
  );
}