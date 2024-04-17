import {Buybutton} from "./BuyButton";
import {Book} from "../types/types.ts";


export function PrettyBook({props}: { props: Book }) {
  return (
    <>
    <div className="flex ">
      <div className="component min-w-60%">
        <ul className="align right">
          <li>
            <figure className='book'>
              <ul className='hardcover_front'>
                <li>
                  <div className="coverDesign" style={{ backgroundImage: `url("${props.thumbnailUrl}")`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <p className="yellow">€{props.price}</p>
                  </div>
                </li>
                <li></li>
              </ul>
              <ul className='page'>
                <li></li>
                <li>
                  <h1 className="blue">{props.title}</h1>
                  <h1>Descrition</h1>
                  <p className="text-container">{props.shortDescription}</p>
                  <h1>Authors</h1>
                  <p>{props.authors}</p>
                  <h1>Categories</h1>
                  <p>{props.categories}</p>
                  <br />
                  <Buybutton className={"w-187"} size={"large"} />
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

      <div className="min-w-50%">
                <li></li>
                <li>
                  <h1 className="blue">{props.title}</h1>
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
                  <br />
                  <Buybutton className={"w-187"} size={"large"} />
                <li></li>
        </div>
    </div>
    </>
  )
}