import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { Book } from "../types.ts";
import CartContext from "@/entry.tsx";

export default function CartComponent({ book, count }: { book: Book, count: number }) {
    const { addCart,  remoCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addCart(book);
    };

    const handleRemoToCart = () => {
        remoCart(book.id); 
    };

    return <Link to={`/book/${book.id}`} key={book.id} className={"p-4 w10 h2xl"}>
        <img src={book.thumbnailUrl ?? "/nocover.png"} alt={book.title} className={"w-64 h-96 object-tl"} onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = "/nocover.png" }} />
        <h2 className={"text-xl"}>{book.title}</h2>
        <h3 className={"text-3 text-stone "}>{book.authors.join(", ")}</h3>
        <div className={"flex flex-row flex-justify-between after:content-none before:content-none"}>
            <h2 className={"text-5 text-orange"}>{book.price ? (book.price * count)!.toFixed(2) + "€" : "-"}</h2>
            <p className={"text-4"}>{Array.from({ length: book.score }, (_, ind) => <FaStar key={"star" + ind} />)}</p>
        </div>
        <div>
            <div className={"flex-justify-space-around"}>
                <button onClick={handleAddToCart} style={{ display: "inline-flex", backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '10px 20px 10px 20px', alignItems: "center" }}>
                    <span style={{ fontSize: '18px' }}>+</span>
                </button>
                <button onClick={handleRemoToCart}  style={{ display: "inline-flex", backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '10px 20px 10px 20px', alignItems: "center" }}>
                    <span style={{ fontSize: '18px' }}>-</span>
                </button>

            </div>
        </div>
    </Link>
}