import {SearchBar} from "../Components/SearchBar.tsx";
import styled from "styled-components";
import Slider, {Settings as SliderSettings} from "react-slick";
import React, {useContext, useEffect} from "react";
import {Book} from "../types/types.ts";
import {FaStar} from "react-icons/fa";
import Waypoint, {Position} from "@restart/ui/Waypoint";
import { Link } from "react-router-dom";

const HomeH1 = styled.h1`
  margin-bottom: 1em;
  font-weight: 700;
  font-size: 2em;
  line-height: 1.125em;
`;


// TODO maybe add skeleton https://reactrouter.com/en/main/components/await
function Home() {
  console.log("Home component rendered");
  const numberOfBooksForSlider = 8
  const fetchBooksByPopularity: () => Promise<Book[]> = async () => {
    const response = await fetch(`http://localhost:3030/books?_limit=${numberOfBooksForSlider}&_sort=-score,-publishedDate.$date`) // if this was long time data a filter could also be applied for only recent
    return response.json()
  }
  const [books, setBooks] = React.useState<Book[]>([])
  useEffect(() => {
    const prom = fetchBooksByPopularity();
    prom.then((books: Book[]) => {
      console.log("books", books)
      setBooks(books)
    })
  }, []);

  const sliderSettings: SliderSettings = {
    centerMode: true,
    infinite: true,
    slidesToShow: 3,
    variableWidth: true,
    speed: 300,
    adaptiveHeight: true,
    dots: false
  }

  const StyledSlider = styled(Slider)`
    .slick-prev::before, .slick-next::before {
      font-size:30px !important;
    }
    .slick-prev, .slick-next {
      z-index: 1;
    }
    
    .slick-slide {
      width: 300px;
    }
  `
  return <>
    <div className={"flex flex-items-center flex-justify-center min-h-400px p16px flex-col"}>
      <HomeH1>Livros de Qualidade à tua Disposição</HomeH1>
      <div>
        <SearchBar className={"w-3xl"} size={"medium"}/>
        <Waypoint rootMargin={{top:-60}} onPositionChange={// I don't understand how top is calculated but it works
          (details, entry) => {
            const headerSearchBar = document.getElementById("header-search-bar")
            if(!headerSearchBar) { return }
            if(details.position == Position.INSIDE) {
                headerSearchBar.classList.add("hidden")
            } else {
                headerSearchBar.classList.remove("hidden")
            }
          }
        }/>
      </div>

    </div>
    <div className={"p-t1vh p-l4 p-r4"}>
      <h1>Destaques</h1>
      <StyledSlider className={"mxxl"} {...sliderSettings}>
        {books.map((book: Book) => {
          return <Link to={`/book/${book.id}`} key={book.id} className={"p-4 w10 h2xl"}>
            <img src={book.thumbnailUrl ?? "/nocover.png"} alt={book.title} className={"w-64 h-96 object-tl"} onError={({currentTarget}) => {currentTarget.onerror = null; currentTarget.src = "/nocover.png"}}/>
            <h2 className={"text-xl"}>{book.title}</h2>
            <h3 className={"text-4 text-stone"}>{book.authors.join(", ")}</h3>
            <div className={"flex flex-row flex-justify-between after:content-none before:content-none"}>
              <h2 className={"text-5 text-orange"}>{book.price}€</h2>
              <p className={"text-4"}>{Array.from({length: book.score}, (_, ind) => <FaStar key={"star" + ind}/>)}</p>
            </div>
          </Link>
        })}
      </StyledSlider>
    </div>
  </>
}

export default Home