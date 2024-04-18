import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import CartContext from "../entry.tsx";
import Slider, { Settings as SliderSettings } from "react-slick";
import styled from "styled-components";


export default function BookComponent() {
    const sliderSettings: SliderSettings = {
        centerMode: true,
        infinite: true,
        slidesToShow: 3,
        variableWidth: true,
        speed: 300,
        adaptiveHeight: false,
        dots: false,
    }
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
  `



    const { Total, NBook, Books } = useContext(CartContext);


    return <>
            <div className={"p-t1vh p-l4 p-r4"}>
                <h1>Cart</h1>
                <StyledSlider className={"mxxl"} {...sliderSettings}>
                    {Books.map((Book) => (
                    <Link to={`/book/${Book.id}`} key={Book.id} className={"p-4 w10 h2xl"}>
                        <></>
                    </Link>
                    ))}
                </StyledSlider>
            </div>
    </>}
