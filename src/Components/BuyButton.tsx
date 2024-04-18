import React, { useContext } from "react";
import {Book} from "../types.ts";
import styled from 'styled-components';
import { FaCartPlus } from 'react-icons/fa';
import { BulmaSize } from "../types.ts";
import CartContext from "../entry.tsx"; 
import {Link} from "react-router-dom";


export function Buybutton({ size = "medium", book, }: { size: BulmaSize, book:Book, className?: string }) {

  const {addCart , Books,NBook } = useContext(CartContext); 

  const BuyIcon = styled(FaCartPlus)`
    top: 32%;
    right: 0.75em;
    z-index: 4;
    color: var(--bulma-input-placeholder-color);
    font-size: var(--bulma-size-${size});
  `;

  const handleAddToCart = () => {
    console.log("books", book)
    addCart(book);
  };

  console.log(Books,"Books")
  console.log(NBook,"NBooks")
  return (
    <div className="flex-justify-space-evenly">
       <button onClick={handleAddToCart}> {/* Use um botão em vez de um link */}
        <BuyIcon />
      </button>
      <Link to={`/cart`} className={"p-4 w10 h2xl"}>
        <p> clica aquui para acessar a lojinha</p>
      </Link>
    </div>
  );
}
