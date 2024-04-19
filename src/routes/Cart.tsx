import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import CartContext from "../entry.tsx";
import Slider, { Settings as SliderSettings } from "react-slick";
import { styled } from "styled-components";
import { Book } from "../types.ts";
import CartComponent from "../Components/CartComponent.tsx";

export default function Cart() {
  const sliderSettings: SliderSettings = {
    centerMode: true,
    infinite: false,
    slidesToShow: 1,
    variableWidth: true,
    speed: 300,
    adaptiveHeight: false,
    dots: false,
  };

  const StyledSlider = styled(Slider)`
    .slick-prev::before, .slick-next::before {
      font-size: 30px !important;
    }

    .slick-prev, .slick-next {
      z-index: 1;
    }

    .slick-slide {
      width:17rem;
      padding: 0 1rem;
    }
  `;

  const { Total, NBook, Books } = useContext(CartContext);
  console.log(Books, "book")
  const uniqueBookIds = new Set<string>();

  const bookCount: { [id: string]: number } = {};
  let priceTotal: number = 0;

  Books.forEach((book) => {
      if (bookCount[book.id]) {
        bookCount[book.id]++;
      } else {
        bookCount[book.id] = 1;
      }

      priceTotal += book.price ?? 0;
    });

  if (Books.length === 0) {
    return (
      <div className={"content has-text-centered"}>
        <br /><br /><br />
        <h2>O seu carrinho está vazio!</h2>
        <p>Adicione alguns livros incríveis ao seu carrinho.</p>
        <Link to="/home" className="button">Ir para a página principal</Link>
      </div>
    );
  }

  return (
    <>
      <div className={"p-t1vh p-l4 p-r4"}>
        <h1>Carrinho</h1>
        <div className="cart-info">
          <p>Total de livros: {NBook}</p>
          <p>Preço total: €{priceTotal.toFixed(2)}</p>
        </div>
        <StyledSlider className={"mxxl"} {...sliderSettings}>

          {Books.map((book: Book) => {
            if (!uniqueBookIds.has(book.id)) {
              uniqueBookIds.add(book.id);
              return <CartComponent key={book.id} book={book} count={bookCount[book.id]} />;
            } else {
              return null;
            }
          })}
        </StyledSlider>
      </div>
    </>
  );
}
