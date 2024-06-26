import React, {useEffect, useRef, useState} from "react";
import {Form, useSearchParams, useSubmit} from "react-router-dom";
import styled from 'styled-components';
import {FaFilter, FaSearch} from 'react-icons/fa';
import {BulmaSize, filtersKeys} from "../types.ts"; // Import the Font Awesome icon
import {toast} from "sonner"
import {addToFilter, qSeparateColon} from "@/lib/utils.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/Components/ui/dialog.tsx";


export function SearchBar({size = "medium", className = "", autofocus}: {
  size: BulmaSize,
  className?: string,
  autofocus?: boolean
}) {
  const submit = useSubmit();
  let formRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [qNoFilters, filters] = qSeparateColon(q);
  const [categories, setCategories] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false)

  useEffect(() => {
    const response = fetch(`http://127.0.0.1:5000/api/v1/books/categorias`).then(async (response) => {
      if (!response.ok) {
        throw response
      }
      return await response.json() as Promise<string[]>
    }).then((categorias) => {
      setCategories(categorias)
    }).catch((error) => {
      console.error("Failed to fetch categories", error)
    })
  }, [])
  useEffect(() => {
    setQ(searchParams.get("q") ?? "")
  }, [searchParams]);
  // icons overlap with text because of transparent background, but with current method they don't fill enough
  // so an input too high will make them almost invisible
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
  const handleInputBlur = (filterType: filtersKeys, filterValue: string, toastMessage: string) => {
    const val = filterValue;
    if (val === "" || qSeparateColon(q)[1][filterType] === val) {
      return;
    }
    setQ(addToFilter(q, filterType, val.replace(" ", "+")));
    toast(toastMessage);
  };
  return (
    <Form method={"get"} action={"/search"} className="field has-addons important:mb0" ref={formRef}>
      <div className="control">
        <input autoFocus={autofocus ?? false} className={`input is-${size} ${className}`} name={"q"} type="text"
               placeholder="Título, Autor, ou tema" value={q} onChange={(event) => {
          const val = event.target.value
          setQ(val)

        }}/>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger><FilterIcon/></DialogTrigger>
          <DialogContent>
            <div className={"control"}>
              <label className={"label"}>Escolha categorias para filtrar sobre:</label>
              <div className={"select w-full"}>
                <select className={"w-full"} name={"categories"} defaultValue={""} onChangeCapture={(event) => {
                  setQ(addToFilter(q, "category", event.currentTarget.value.replace(" ", "+")))
                  toast("Category added to search")
                }}>
                  <option value={""} disabled>Categorias</option>
                  {categories.map(category => <option key={category}>{category}</option>)}
                </select>
              </div>
            </div>
            <div className={"control"}>
              <label className={"label"}>Pesquise por um(a) autor(a)</label>
              <input className={"input "} type={"text"} name={"autor"} placeholder={"Autor"}
                     onBlur={(event) => handleInputBlur("author", event.target.value, "Author added to search")}
                     onKeyDown={(
                       event) => {
                       if (event.key === "Enter") {
                         handleInputBlur("author", event.currentTarget.value, "Author added to search")
                       }
                     }
                     }/>
            </div>
            <div className={"control"}>
              <label className={"label"}>Pesquise por um título</label>
              <input className={"input "} type={"text"} name={"title"} placeholder={"Título"}
                     onBlur={(event) => handleInputBlur("title", event.target.value, "Title added to search")}
                     onKeyDown={
                       (event) => {
                         if (event.key === "Enter") {
                           handleInputBlur("title", event.currentTarget.value, "Title added to search")
                         }
                       }
                     }/>
            </div>
            <div className={"field is-horizontal flex-justify-between before:content-none after:content-none"}>
              <div className={"control"}>
                {/* Sort */}
                <label className={"label"}>Ordenar por:</label>
                <div className={"select"}>
                  <select className={"w-full"} name={"sort"} defaultValue={""} onChangeCapture={(event) => {
                    setQ(addToFilter(q, "sort", event.currentTarget.value.replace(" ", "+")))
                    toast("Sort added to search")
                  }}>
                    <option value={""} disabled>Ordenar por</option>
                    <option value={"score"}>Melhor pontuação</option>
                    <option value={"-score"}>Pior pontuação</option>
                    <option value={"price"}>Preço mais baixo</option>
                    <option value={"-price"}>Preço mais alto</option>
                    <option value={"publishedDate"}>Mais Recente</option>
                    <option value={"-publishedDate"}>Mais Velho</option>
                  </select>
                </div>
              </div>
              <div className={"control"}>
                <label className={"label"}>&#x200b;</label> {/* To make the same space*/}
                <button className={"button is-primary"} type={"submit"}
                        onClick={() => {submit(formRef.current); setOpenDialog(false)} }>Pesquisar
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <button role={"button"}><SearchIcon/></button>
      </div>
    </Form>
  );
}
