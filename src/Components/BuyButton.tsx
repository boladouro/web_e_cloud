import React, { useContext } from "react";
import { Book } from "../types/types.ts";
import styled from 'styled-components';
import { FaCartPlus } from 'react-icons/fa';
import { BulmaSize } from "../types/types.ts";
import CartContext from "../entry.tsx";
import { Link } from "react-router-dom";
import { FaShoppingBasket } from 'react-icons/fa';


export function Buybutton({ size = "medium", book, }: { size: BulmaSize, book: Book, className?: string }) {
  const BasketshoIcon = styled(FaShoppingBasket)`
  position: flex;
  top: 32%;
  right: 2.5em;
  z-index: 4;
  color: var(--bulma-input-placeholder-color);
  font-size: var(--bulma-size-${size});
`;
  const { addCart, Books, NBook, addTotal} = useContext(CartContext);

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

  console.log(Books, "Books")
  console.log(NBook, "NBooks")
  return (
    <div className="flex-justify-space-evenly">
      <button onClick={handleAddToCart} style={{display: "inline-flex", backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '10px', alignItems:"center" }}>
        <BuyIcon />
        <span style={{ marginLeft: '5px' }}>Buy</span>
      </button>
      <Link to={`/cart`} className={"p-4 w10 h2xl"}>
        <button style={{ display: "inline-flex", backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '10px', alignItems:"center" }}>
          <BasketshoIcon />
          <span style={{ marginLeft: '5px' }}>Basket</span>
        </button>
      </Link>
    </div>
  );
}
