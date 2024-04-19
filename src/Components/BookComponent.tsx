import {FaStar} from "react-icons/fa";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import {Book} from "../types.ts";
import {Buybutton} from "./BuyButton";


export default function BookComponent({book}: { book: Book }) {
  return <div>
    <Link to={`/book/${book.id}`} key={book.id} className={"p-l4 p-r0 w10 h2xl"}>
      <img src={book.thumbnailUrl ?? "/nocover.png"} alt={book.title} className={"w-64 h-96 object-tl"}
           onError={({currentTarget}) => {
             currentTarget.onerror = null;
             currentTarget.src = "/nocover.png"
           }}/>
      <h2 className={"text-xl"}>{book.title}</h2>
      <h3 className={"text-3 text-stone"}>{book.authors.join(", ")}</h3>
      <div className={"flex flex-row flex-justify-between after:content-none before:content-none"}>
        <h2 className={"text-5 text-orange"}>{book.price ? book.price!.toFixed(2) + "€" : "-"}</h2>
        <p className={"text-4"}>{Array.from({length: book.score}, (_, ind) => <FaStar key={"star" + ind}/>)}</p>
      </div>
    </Link>
    <div className={"relative"}>
      <Buybutton size={"large"} book={book}/>
    </div>
  </div>
}