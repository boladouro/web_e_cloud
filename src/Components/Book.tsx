import { Buybutton } from "./BuyButton";



export function BookComponent(props: Book) {
    return (
      <div className="component">
        <ul className="align">
          <li>
            <figure className='book'>
              <ul className='hardcover_front'>
                <li>
                  <div className="coverDesign blue">
                    <h1>{ props.title }</h1>
                    <br/>
                    <p>€{ props.price }</p>
                  </div>
                </li>
                <li></li>
              </ul>
              <ul className='page'>
                <li></li>
                <li>
                  <h1>Descrition</h1>
                  <p>{ props.shortDescription }</p>
                  <h1>Authors</h1>
                  <p>{ props.authors }</p>
                  <h1>Categories</h1>
                  <p>{ props.categories }</p>
                  <br/>
                  <Buybutton className={"w-187"} size={"large"} /></li>
                <li></li>
                <li></li>
                <li>
                </li>
              </ul>
              <ul className='hardcover_back'>
                <li></li>
                <li></li>
              </ul>
              <ul className='book_spine'>
                <li></li>
                <li></li>
              </ul>
            </figure>
          </li>
        </ul>
      </div>
    )
  }
  
  // há 1 livro de teste, TODO dps perguntar ao prof o q fazer com esse
  export interface Book {
    id: string
    title: string
    isbn?: string
    pageCount: number
    publishedDate: Date // YYYY-MM-DD
    thumbnailUrl?: string
    shortDescription?: string
    longDescription?: string
    status: "PUBLISH" | string
    authors: string[]
    categories: string[]
    score: number
    price?: number
  }