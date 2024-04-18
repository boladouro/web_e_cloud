import React, { useContext } from "react";
import {Book} from "../types/types.ts";
import styled from 'styled-components';
import { FaCartPlus } from 'react-icons/fa';
import { BulmaSize } from "../types/types.ts";
import CartContext from "../Components/cartComponet"; 


export function Buybutton({ size = "medium", book, }: { size: BulmaSize, book:Book, className?: string }) {


  const BuyIcon = styled(FaCartPlus)`
    top: 32%;
    right: 0.75em;
    z-index: 4;
    color: var(--bulma-input-placeholder-color);
    font-size: var(--bulma-size-${size});
  `;


  return (
    <div className="flex-justify-space-evenly">
      <a href="/cart"><BuyIcon /></a>
    </div>
  );
}
