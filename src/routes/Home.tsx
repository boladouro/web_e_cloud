import {SearchBar} from "../Components/SearchBar.tsx";
import styled from "styled-components";
import Slider, {Settings as SliderSettings} from "react-slick";
import React, {useEffect} from "react";
import {Book} from "../types.ts";
import Waypoint, {Position} from "@restart/ui/Waypoint";
import BookComponent from "../Components/BookComponent.tsx";

const HomeH1 = styled.h1`
  margin-bottom: 1em;
  font-weight: 700;
  font-size: 2em;
  line-height: 1.125em;
`;

function Home() {
  const numberOfBooksForSlider = 8
  const fetchFeaturedBooks: () => Promise<Book[]> = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/books/featured`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching featured books:', error);
      return [];
    }
  };
  const [books, setBooks] = React.useState<Book[]>([])
  useEffect(() => {
    const prom = fetchFeaturedBooks();
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
  return <>
    <div className={"flex flex-items-center flex-justify-center min-h-400px p16px flex-col"}>
      <HomeH1>Livros de Qualidade à tua Disposição</HomeH1>
      <div>
        <SearchBar className={"w-3xl"} size={"medium"} autofocus={true}/>
        <Waypoint rootMargin={{top: -60}} onPositionChange={
          (details, entry) => {
            const headerSearchBar = document.getElementById("header-search-bar")
            if (!headerSearchBar) {
              return
            }
            if (details.position == Position.INSIDE) {
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
      {/* TODO add skeleton https://reactrouter.com/en/main/components/await */}
      <StyledSlider className={"mxxl"} {...sliderSettings}>
        {books.map((book: Book) => <BookComponent book={book} key={book.id} />)}
      </StyledSlider>
    </div>
  </>
}

export default Home