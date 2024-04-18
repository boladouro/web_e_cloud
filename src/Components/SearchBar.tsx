import React, {useEffect, useState} from "react";
import {Form, useSearchParams} from "react-router-dom";
import styled from 'styled-components';
import {FaFilter, FaSearch} from 'react-icons/fa';
import {Book, BulmaSize} from "../types/types.ts"; // Import the Font Awesome icon
import {toast} from "sonner"
import {addToFilter, qSeparateColon} from "@/lib/utils.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/Components/ui/dialog.tsx";


export function SearchBar({size = "medium", className = "", autofocus}:{size: BulmaSize, className?: string, autofocus?: boolean}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
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
  useEffect(() => {
    setQ(searchParams.get("q") ?? "")
  }, [searchParams]);
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
        <input autoFocus={autofocus ?? false} className={`input is-${size} ${className}`} name={"q"} type="text" placeholder="Título, Autor, ou tema" value={q} onChange={(event) => {
          const val = event.target.value
          setQ(val)

        }}/>
        <Dialog>
          <DialogTrigger><FilterIcon/></DialogTrigger>
          <DialogContent>
            <div className={"control"}>
              <label className={"label"}>Escolha categorias para filtrar sobre:</label>
              <div className={"select w-full"}>
                <select className={"w-full"} name={"categories"} defaultValue={""} onChangeCapture={(event) => {
                  setQ(addToFilter(q, "category", event.target.value.replace(" ", "+")))
                  toast("Category added to search")
                }}>
                  <option value={""} disabled>Categorias</option>
                  {categories.map(category => <option key={category}>{category}</option>)}
                </select>
              </div>
            </div>
            <div className={"control"}>
              <label className={"label"}>Pesquise por um(a) autor(a)</label>
              <input className={"input "} type={"text"} name={"autor"} placeholder={"Autor"} onBlur={(event) => {
                const val = event.target.value
                if (val === "") {
                  return
                }
                setQ(addToFilter(q, "author", event.target.value.replace(" ", "+")))
                toast("Author added to search")
              }}/>
            </div>
            <div className={"control"}>
              <label className={"label"}>Pesquise por um título</label>
              <input className={"input "} type={"text"} name={"title"} placeholder={"Título"} onBlur={(event) => {
                const val = event.target.value
                if (val === "") {
                  return
                }
                setQ(addToFilter(q, "title", event.target.value.replace(" ", "+")))
                toast("Title added to search")
              }}/>
              {/* TODO FALTA PRECOS E DATAS */}
            </div>
          </DialogContent>
        </Dialog>
        <button role={"button"}><SearchIcon/></button>
      </div>
    </Form>
  );
}