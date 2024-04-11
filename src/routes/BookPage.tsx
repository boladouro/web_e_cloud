import {Book} from "../types/types.ts";

const myBook: Book = {
  id: "1",
  title: "The Hitchhiker's Guide to the Galaxy",
  isbn: "978-0345391803",
  pageCount: 192,
  publishedDate: { $date: "1979-10-12" },
  thumbnailUrl: "https://...",
  shortDescription: "...",
  longDescription: "What is Ln book. It has survived not only five centuctronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  status: "PUBLISH",
  authors: ["Douglas Adams"],
  categories: ["Science Fiction", "Comedy"],
  score: 4.2,
  price: 12.99,
};

export default function BookPage() {
  return <>
    <div className="component">
				<ul className="align">
					<li>
						<figure className='book'>
							<ul className='hardcover_front'>
								<li>
									<div className="coverDesign blue">
										<h1>{ myBook.title }</h1>
                    <br/>
										<p>€{ myBook.price }</p>
									</div>
								</li>
								<li></li>
							</ul>
							<ul className='page'>
								<li></li>
								<li>
                  <h1>Descrition</h1>
                  <p>{ myBook.longDescription }</p>
                  <h1>Authors</h1>
                  <p>{ myBook.authors }</p>
                  <h1>Categories</h1>
                  <p>{ myBook.categories }</p>
                  <br/>
                  <a className="btn" href="#">Add Car</a></li>
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
	
  </>
}