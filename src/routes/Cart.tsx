import React, { useContext, useEffect } from "react";
import CartContext from "../Components/cartComponet";


const { NBook, Total, Books } = useContext(CartContext);

export default function CartPage() {
    const { NBook, Total, Books } = useContext(CartContext);

    return (
        <>
            <h1>Shopping Cart</h1>
            <p>Total Items: {NBook}</p>
            <p>Total Price: {Total}</p>

            <h2>Items in Cart:</h2>
            {/* <ul>
                {Books.map((book, index) => (
                    <li key={index}>{book}</li>
                ))}
            </ul>  */}
        </>
    );
}
