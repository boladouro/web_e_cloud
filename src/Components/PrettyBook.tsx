import {Buybutton} from "./BuyButton";
import {Book} from "../types.ts";


export function PrettyBook({props}: { props: Book }) {
  return (
    <>
      <div className="flex ">
        <div className="component min-w-100%">
          <ul className="align right">
            <li>
              <figure className='book'>
                <ul className='hardcover_front'>
                  <li>
                    <div className="coverDesign" style={{
                      backgroundImage: `url("${props.thumbnailUrl}")`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover"
                    }}>
                      <p className="yellow" style={{ position: 'absolute', bottom: 0, 'paddingRight':'40%', 'paddingLeft' : '40%' }}>€{props.price}</p>
                    </div>
                  </li>
                  <li></li>
                </ul>
                <ul className='page'>
                  <li></li>
                  <li>
                    <h1 className="blue" style={{ fontSize: "26px" }}>{props.title}</h1>
                    <h1>Descrição</h1>
                    <p className="text-container" style={{ color: '#33a1a4'}}>{props.shortDescription}</p>
                    <h1>Autores</h1>
                    <p style={{ color: '#33a1a4'}}>{props.authors}</p>
                    <h1>Categorias</h1>
                    <p style={{ color: '#33a1a4'}}>{props.categories}</p>
                    <br/>
                    <Buybutton className={"w-187"} size={"large"} book={props}/>
                  </li>
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

        {/* <div className="min-w-50% " style={{ listStyleType: 'none' }}>
          <li></li>
          <li>
            <h1>{props.title}</h1>
          </li>
          <li>
            <h1>Descrition</h1>
            <p className="text-container">{props.shortDescription}</p>
          </li>
          <li>
            <h1>Authors</h1>
            <p>{props.authors}</p>
          </li>
          <li>
            <h1>Categories</h1>
            <p>{props.categories}</p>
          </li>
          <br/>
          <Buybutton className={"w-187"} size={"large"} book={props}/>
          <li></li>
        </div> */}
        <div>

        </div>
      </div>
    </>
  )
}