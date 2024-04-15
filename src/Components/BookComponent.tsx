import {FaStar} from "react-icons/fa";
import {Link} from "react-router-dom";
import React from "react";
import {Book} from "../types/types.ts";

export default function BookComponent({book}: {book: Book}) {
    return <Link to={`/book/${book.id}`} key={book.id} className={"p-4 w10 h2xl"}>
        <img src={book.thumbnailUrl ?? "/nocover.png"} alt={book.title} className={"w-64 h-96 object-tl"} onError={({currentTarget}) => {currentTarget.onerror = null; currentTarget.src = "/nocover.png"}}/>
        <h2 className={"text-xl"}>{book.title}</h2>
        <h3 className={"text-4 text-stone"}>{book.authors.join(", ")}</h3>
        <div className={"flex flex-row flex-justify-between after:content-none before:content-none"}>
            <h2 className={"text-5 text-orange"}>{book.price}€</h2>
            <p className={"text-4"}>{Array.from({length: book.score}, (_, ind) => <FaStar key={"star" + ind}/>)}</p>
        </div>
    </Link>
}