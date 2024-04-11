import {SearchBar} from "../Components/SearchBar.tsx";
import styled from "styled-components";
import Slider from "react-slick";
import {Settings as SliderSettings} from "react-slick";
import React, {useEffect} from "react";
import {Book} from "../types/types.ts";


const HomeH1 = styled.h1`
  margin-bottom: 1em;
  font-weight: 700;
  font-size: 2em;
  line-height: 1.125em;
`;



function Home() {
  console.log("Home component rendered");
  const numberOfBooksForSlider = 8
  const fetchBooksByPopularity: () => Promise<Book[]> = async () => {
    const response = await fetch(`http://localhost:3030/books?_limit=${numberOfBooksForSlider}&_sort=score,-publishedDate.$date`)
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
    adaptiveHeight: false,
    dots: false
  }

  return <>
    <div className={"flex flex-items-center flex-justify-center min-h-400px p16px flex-col"}>
      <HomeH1>Livros de Qualidade à tua Disposição</HomeH1>
      <SearchBar className={"w-3xl"} size={"medium"}/>
    </div>
    <div className={"p-t10vh p-l4 p-r4"}>
      <h1>Destaques</h1>
      <Slider {...sliderSettings}>
        {books.map((book: Book) => {
          {/* TODO falta precos, rating, link, e default cover */}
          return <div key={book.id} className={"p-4"}>
            <img src={book.thumbnailUrl} alt={book.title} className={"w-64 h-96"}/>
            <h2>{book.title}</h2>
          </div>
        })}
      </Slider>
    </div>
  </>
}

export default Home