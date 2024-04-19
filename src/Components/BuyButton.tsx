import React, { useContext } from "react";
import {Book} from "../types.ts";
import styled from 'styled-components';
import { FaCartPlus,FaShoppingBasket } from 'react-icons/fa';
import { BulmaSize } from "../types.ts";
import CartContext from "../entry.tsx"; 
import {Link} from "react-router-dom";
import {toast} from "sonner"

const BuyButton = styled.button`
  position: relative;
  top: 0;
  left: 0; 
  background-color: #2eb82e; 
  color: #ffffff; 
  border: none; 
  border-radius: 5px; 
  padding: 5px; 
  text-align:center;
`;

export function Buybutton({ size = "medium", book}: { size: BulmaSize, book: Book, className?: string }) {
  const BasketshoIcon = styled(FaShoppingBasket)`
    display: flex;
    top: 32%;
    right: 2.5em;
    z-index: 4;
    color: var(--bulma-input-placeholder-color);
    font-size: var(--bulma-size-${size});
  `;
  const { addCart, Books, NBook} = useContext(CartContext);

  const BuyIcon = styled(FaCartPlus)`
    top: 32%;
    right: 0.75em;
    z-index: 4;
    color: var(--bulma-input-placeholder-color);
    font-size: var(--bulma-size-${size});
  `;

  const handleAddToCart = (e: Event) => {
    addCart(book);
    toast.success("Livro adicionado ao carrinho!");
  };
  console.log(location.pathname,"awdawd")

  if (location.pathname !== "/search" && location.pathname !== "/home") {
    return (
      <div className={"flex-justify-space-evenly" }>
        <button onClick={handleAddToCart} style={{ display: "inline-flex", backgroundColor: '#2eb82e', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '10px', alignItems: "center" }}>
          <BuyIcon />
          <span style={{ marginLeft: '5px' }}>Comprar</span>
        </button>
        <Link to={`/cart`} className={"p-4 w10 h2xl"}>
          <button style={{ display: "inline-flex", backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '10px', alignItems: "center" }}>
            <BasketshoIcon />
            <span style={{ marginLeft: '5px' }}>Carrinho</span>
          </button>
        </Link>
      </div>
    );
  } else {
    return <BuyButton onClick={handleAddToCart}>
      <BuyIcon />
      <span className={"m-r1"}></span>
    </BuyButton>

  
  }
}
