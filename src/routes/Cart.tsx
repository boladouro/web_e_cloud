import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import Slider, { Settings as SliderSettings } from "react-slick";
import { FaStar } from "react-icons/fa";
import CartContext from "../entry.tsx";
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
    .slick-prev::before,
    .slick-next::before {
      font-size: 30px !important;
    }

    .slick-prev,
    .slick-next {
      z-index: 1;
    }

    .slick-slide {
      width: 17rem;
      padding: 0 1rem;
    }
  `;

  const { Books } = useContext(CartContext);

  const bookCounts: Record<string, number> = {};
  Books.forEach((book) => {
    bookCounts[book.id] = (bookCounts[book.id] || 0) + 1;
  });

 
  const uniqueBooks = Books.filter((book) => bookCounts[book.id] === 1);

  return (
    <div className={"p-t1vh p-l4 p-r4"}>
      <h1>Cart</h1>
      <StyledSlider className={"mxxl"} {...sliderSettings}>
        {uniqueBooks.map((book: Book) => (
          <CartComponent key={book.id} book={book} count={bookCounts} />
        ))}
      </StyledSlider>
    </div>
  );
}
