from __future__ import annotations

from functools import wraps

import flask
import jwt
import pymongo
from flask import Flask, jsonify, request, after_this_request
from flask.json.provider import JSONProvider
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os
from bson import ObjectId, json_util
import re
from datetime import datetime, timedelta

from pymongo.cursor import Cursor

load_dotenv()
connection_string = os.getenv("MONGODB_CONECTION_STRING")
if not connection_string:
  raise ValueError("No connection string found, create a .env file with the MONGODB_CONECTION_STRING variable.")


class MongoJSONProvider(JSONProvider):
  def __init__(self, *args, **kwargs):
    super(MongoJSONProvider, self).__init__(*args, **kwargs)

  def dumps(self, obj, **kwargs):
    return json_util.dumps(obj, **kwargs)

  def loads(self, s, **kwargs):
    return json_util.loads(s, **kwargs)


app = Flask(__name__)
app.json_provider_class = MongoJSONProvider
app.json = MongoJSONProvider(app)
CORS(app)
app.config["SECRET_KEY"] = "b3baa5d340ecaad79abc375e930c180212b8e184eff44f7d7e36e40422c007a4"
def token_required(func):
  @wraps(func)
  def decorated(*args, **kwargs):
    token = request.args.get('token')
    if not token:
      return jsonify({'error': 'Token is missing!'}), 407
    try:
      data = jwt.decode(token, app.config["SECRET_KEY"],
                        algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
      return jsonify({'error': 'token expired', 'expirado': True}), 401
    return func(*args, **kwargs)
  return decorated


client = MongoClient(
  connection_string,
  tls=os.getenv("MONGODB_TLS", False) in ("1", "true", "True", "yes", "Yes", "y", "Y"), # dfault is False
  tlsAllowInvalidCertificates=True,
  timeoutMS=5000,
)
db = client["backend"]
if "books" not in db.list_collection_names():
  ValueError("No books collection found, run `pixi run setup-db` or use mongoimport to create it")


def paginate(db, currentPipeline: list | dict):
  restOfArgs = "&".join([f"{k}={v}" for k, v in request.args.items() if k != "page"])
  page = request.args.get("page", 1)
  limit = request.args.get("limit", 10)
  if not bool(currentPipeline):  # if it's empty
    currentPipeline = []
  elif isinstance(currentPipeline, dict):
    currentPipeline = [
      {"$match": currentPipeline}
    ]
  currentPipeline.extend([
    {
      "$facet": {
        "pages": [
          {"$count": "docCount"},
          {"$addFields": {
            "totalPageCount": {"$ceil": {"$divide": ["$docCount", limit]}}
          }},
          {"$project": {
            "docCount": 1,
            "totalPageCount": 1,
            "first": f"{request.base_url}?{restOfArgs}&page=1" if page > 2 else None,
            "prev": f"{request.base_url}?{restOfArgs}&page={page - 1}" if page > 1 else None,
            "curr": f"{request.base_url}?{restOfArgs}&page={page}",
            "next": {
              "$cond": {"if": {"$lt": [page, "$totalPageCount"]}, "then": f"{request.base_url}?{restOfArgs}&page={page + 1}",
                        "else": None}},
            "last": {"$cond": {"if": {"$lt": [page + 1, "$totalPageCount"]}, "then": {
              "$concat": [f"{request.base_url}?{restOfArgs}&page=", {"$toString": "$totalPageCount"}]
            }, "else": None}},
          }}
        ],
        "data": [
          {"$skip": (page - 1) * limit},
          {"$limit": limit}
        ]
      }
    },
    {
      "$project": {
        "data": 1,
        "pages": {"$arrayElemAt": ["$pages", 0]},
      }
    }
  ])
  # import json
  # print(json.dumps(currentPipeline, indent=2))
  return list(db.aggregate(currentPipeline))[0]  # I don't know why dict fucks it


"""
@api {get} /api/v1/books Search books, with pagination;
@apiName GetBooks
@apiGroup Book

@apiQuery   {string}       [q]                    The query to search; will search between title, isbn, shortDescription, and longDescription
@apiQuery   {int}          page=1                 The page of the query, which depends on the limit
@apiQuery   {int}          limit=10               The amount of books that each page has               

@apiSuccess {array}        data                   Array of books result of query, limited by the limit param


@apiSuccess {object}        pages                  The object containing the info for constructing the pages having the pages.
@apiSuccess {int}          pages.docCount       Total books of the query
@apiSuccess {int}          pages.totalPageCount Number of pages the query is capable
@apiSuccess {string|null}  pages.first          Link for the first page, if prev isn't it
@apiSuccess {string|null}  pages.prev           Link for the previous page, if current isn't it
@apiSuccess {string}       pages.curr           Link for the current page
@apiSuccess {string|null}  pages.next           Link for the next page, if current isn't last
@apiSuccess {string|null}  pages.last           Link for the last page, if next isn't it

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "data": [{...}, {...}, {...}],
  "pages": {
    "docCount": 100,
    "totalPageCount": 10,
    "first": "/api/v1/books?q=foo&page=1",
    "prev": "/api/v1/books?q=foo&page=2",
    "curr": "/api/v1/books?q=foo&page=3",
    "next": "/api/v1/books?q=foo&page=4",
    "last": "/api/v1/books?q=foo&page=10"
  }
}
"""
@app.route("/api/v1/books", methods=["GET"]) # /books/ leads to 404
def get_books():
  q = request.args.get("q", False)
  if not q:
    return paginate(db.books, {})
  # add pages
  return paginate(db.books, {
    "$text": {  # requires the fields to be indexed
      "$search": q
    }
  })


"""
@api {get} /api/v1/books/:id Get a book by its id
@apiName GetBook
@apiGroup Book

@apiParam {int} id The book id

@apiSuccess {object} $ The book object

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "_id": {
    "$oid": "66493ab03f5176065151d376"
  },
  "id": "1",
  "title": "Unlocking Android",
  "isbn": "1933988673",
  "pageCount": 416,
  "publishedDate": {
    "$date": "2009-04-01T07:00:00Z"
  },
  "thumbnailUrl": "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson.jpg",
  "shortDescription": "A short description",
  "longDescription": "A reaaaally long description",
  "status": "PUBLISH",
  "authors": [
    "W. Frank Ableson",
    "Charlie Collins",
    "Robi Sen"
  ],
  "categories": [
    "Open Source",
    "Mobile"
  ],
  "score": 5,
  "price": 26
}

@apiErrorExample {json} Error-Response:
HTTP/1.1 404 Not Found
{
  "error": "Book not found"
}
"""
@app.route("/api/v1/books/<int:book_id>", methods=["GET"])
def get_book(book_id: int):
    book_id_str = str(book_id)
    
    # Try to find the book using a different approach
    try:
        # Using find to get all books and filtering manually for more control
        books = list(db.books.find())
        book = next((book for book in books if book.get("id") == book_id_str), None)
        if not book:
            return jsonify({"error": "Book not found"}), 404
        return jsonify(book)
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred"}), 500


"""
@api {post} /api/v1/books Create a book
@apiName CreateBook
@apiGroup Book

@apiQuery {json} book The book info
@apiQuery {string} token The token to access the API

@apiSuccessExample {json} 200:
HTTP/1.1 201 Created
{
  "success": true
}
@apiErrorExample {json} 400:
HTTP/1.1 400 Bad Request
{
  "error": "book arg is missing"
}
@apiErrorExample {json} 401:
HTTP/1.1 401 Unauthorized
{
  "error": "token expired",
  "expirado": true
}
@apiErrorExample {json} 407:
HTTP/1.1 407 Proxy Authentication Required
{
  "error": "Token is missing!"
}
"""
@app.route("/api/v1/books", methods=["POST"])
@token_required
def create_book():
  book = request.args.get("book")
  if not book:
    return {"error": "book arg is missing"}, 400
  db.books.insertOne(book)
  return {"success": True}, 201


"""
@api {delete} /api/v1/books/:id Delete a book by its id
@apiName DeleteBook
@apiGroup Book

@apiParam {int} id The book id
@apiQuery {string} token The token to access the API

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "success": true
}
@apiErrorExample {json} 401:
HTTP/1.1 401 Unauthorized
{
  "error": "token expired",
  "expirado": true
}
@apiErrorExample {json} 407:
HTTP/1.1 407 Proxy Authentication Required
{
  "error": "Token is missing!"
}
"""
@app.route("/api/v1/books/<int:book_id>", methods=["DELETE"])
@token_required
def delete_book(book_id):
  db.books.deleteOne({ # TODO throw 404 if not found
    "id": book_id
  })
  return {"success": True}, 200


"""
@api {put} /api/v1/books/:id Update a book by its id
@apiName UpdateBook
@apiGroup Book

@apiParam {int} id The book id
@apiQuery {json} book The book info
@apiQuery {string} token The token to access the API

@apiSuccessExample {json} 201:
HTTP/1.1 201 Created
{
  "success": true
}
@apiErrorExample {json} 400:
HTTP/1.1 400 Bad Request
{
  "error": "book arg is missing"
}
@apiErrorExample {json} 401:
HTTP/1.1 401 Unauthorized
{
  "error": "token expired",
  "expirado": true
}
@apiErrorExample {json} 407:
HTTP/1.1 407 Proxy Authentication Required
{
  "error": "Token is missing!"
}
"""
@app.route("/api/v1/books/<int:book_id>", methods=["PUT"])
@token_required
def update_book(book_id):
  book = request.args.get("book")
  if not book:
    return {"error": "book arg is missing"}, 400
  db.books.updateOne({"id": book_id}, {"$set": book})
  return {"success": True}, 201


"""
@api {get} /api/v1/books/featured Get the featured books
@apiName GetFeaturedBooks
@apiGroup Book

@apiSuccess {array} data Array of 5 books featured

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
[
  {...},
  {...},
  {...}
]
"""
@app.route("/api/v1/books/featured", methods=["GET"])
def get_featured_books():
  return list(db.books.aggregate([
    {
      "$match": {
        "score": {"$exists": True},
        "price": {"$exists": True}
      }
    },
    {
      "$sort": {"score": pymongo.DESCENDING}
    },
    {
      "$limit": 5
    },
    {
      "$sort": {"price": pymongo.ASCENDING}
    },
    # {
    #   "$project": {"score": 1, "price": 1}
    # },
  ]))


"""
@api {get} /api/v1/books/total Get the total amount of books
@apiName GetTotalBooks
@apiGroup Book

@apiSuccess {int} count The total amount of books

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "count": 1000
}
"""
@app.route("/api/v1/books/total", methods=["GET"])
def get_total_books():
  return {"count": db.books.count_documents({})}


"""
@api {get} /api/v1/books/autor/:autor Get books by author, with pagination
@apiName GetBooksByAuthor
@apiGroup Book

@apiParam {string} autor The author name
@apiQuery {int} page=1 The page of the query, which depends on the limit
@apiQuery {int} limit=10 The amount of books that each page has

@apiSuccess {array} data Array of books by the author

@apiSuccess {object}        pages                  The object containing the info for constructing the pages having the pages.
@apiSuccess {int}          pages.docCount       Total books of the query
@apiSuccess {int}          pages.totalPageCount Number of pages the query is capable
@apiSuccess {string|null}  pages.first          Link for the first page, if prev isn't it
@apiSuccess {string|null}  pages.prev           Link for the previous page, if current isn't it
@apiSuccess {string}       pages.curr           Link for the current page
@apiSuccess {string|null}  pages.next           Link for the next page, if current isn't last
@apiSuccess {string|null}  pages.last           Link for the last page, if next isn't it

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "data": [{...}, {...}, {...}],
  "pages": {
    "docCount": 100,
    "totalPageCount": 10,
    "first": "/api/v1/books/autor/foo?page=1",
    "prev": "/api/v1/books/autor/foo?page=2",
    "curr": "/api/v1/books/autor/foo?page=3",
    "next": "/api/v1/books/autor/foo?page=4",
    "last": "/api/v1/books/autor/foo?page=10"
  }
}
"""
@app.route("/api/v1/books/autor/<string:autor>", methods=["GET"])
def get_books_author(autor: str):
  return paginate(db.books, {
    "authors": {"$elemMatch": {"$regex": autor, "$options": "i"}}
  })


"""
@api {get} /api/v1/books/ano/:ano Get books filtered by year, with pagination
@apiName GetBooksByYear
@apiGroup Book

@apiParam {int} ano The year
@apiQuery {int} page=1 The page of the query, which depends on the limit
@apiQuery {int} limit=10 The amount of books that each page has

@apiSuccess {array} data Array of books by the year

@apiSuccess {object}        pages                  The object containing the info for constructing the pages having the pages.
@apiSuccess {int}          pages.docCount       Total books of the query
@apiSuccess {int}          pages.totalPageCount Number of pages the query is capable
@apiSuccess {string|null}  pages.first          Link for the first page, if prev isn't it
@apiSuccess {string|null}  pages.prev           Link for the previous page, if current isn't it
@apiSuccess {string}       pages.curr           Link for the current page
@apiSuccess {string|null}  pages.next           Link for the next page, if current isn't last
@apiSuccess {string|null}  pages.last           Link for the last page, if next isn't it

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "data": [{...}, {...}, {...}],
  "pages": {
    "docCount": 100,
    "totalPageCount": 10,
    "first": "/api/v1/books/ano/2000?page=1",
    "prev": "/api/v1/books/ano/2000?page=2",
    "curr": "/api/v1/books/ano/2000?page=3",
    "next": "/api/v1/books/ano/2000?page=4",
    "last": "/api/v1/books/ano/2000?page=10"
  }
}
"""
@app.route("/api/v1/books/ano/<int:ano>")
def get_book_ano(ano: int):
  start = datetime(ano, 1, 1)
  end = datetime(ano, 12, 31, 23, 59, 59)
  return paginate(db.books, {
    "publishedDate": {
      "$gte": start,
      "$lte": end
    }
  })


"""
@api {get} /api/v1/books/categorias Get all book categories
@apiName GetBooksCategories
@apiGroup Book

@apiSuccess {array} $ Array of all books categories

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
[
  "Client-Server",
  "Computer Graphics",
  "Internet",
  "Java",
  "Microsoft",
  "Microsoft .NET",
  "Miscellaneous",
  "Mobile",
  "Networking",
  "Next Generation Databases",
  "Object-Oriented Programming",
  "Open Source",
  "PowerBuilder",
  "Programming",
  "Python",
  "S",
  "Software Engineering",
  "Theory",
  "Web Development"
]
"""
@app.route("/api/v1/books/categorias/")
def get_books_categories():
  return list(db.books.distinct("categories"))  # not indexed but that's a future problem


"""
@api {get} /api/v1/books/categorias/:categorias Get books by categories, with pagination
@apiName GetBooksByCategories
@apiGroup Book

@apiParam {string} categorias The categories, separated by commas
@apiQuery {int} page=1 The page of the query, which depends on the limit
@apiQuery {int} limit=10 The amount of books that each page has

@apiSuccess {array} data Array of books by the categories

@apiSuccess {object}        pages                  The object containing the info for constructing the pages having the pages.
@apiSuccess {int}          pages.docCount       Total books of the query
@apiSuccess {int}          pages.totalPageCount Number of pages the query is capable
@apiSuccess {string|null}  pages.first          Link for the first page, if prev isn't it
@apiSuccess {string|null}  pages.prev           Link for the previous page, if current isn't it
@apiSuccess {string}       pages.curr           Link for the current page
@apiSuccess {string|null}  pages.next           Link for the next page, if current isn't last
@apiSuccess {string|null}  pages.last           Link for the last page, if next isn't it

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "data": [{...}, {...}, {...}],
  "pages":{
    "docCount": 100,
    "totalPageCount": 10,
    "first": "/api/v1/books/categorias/foo?page=1",
    "prev": "/api/v1/books/categorias/foo?page=2",
    "curr": "/api/v1/books/categorias/foo?page=3",
    "next": "/api/v1/books/categorias/foo?page=4",
    "last": "/api/v1/books/categorias/foo?page=10"
  }
}
"""
@app.route("/api/v1/books/categorias/<string:categorias>")
def get_books_category(categorias: str):
  categorias = categorias.split(",")
  return paginate(db.books, {
    "categories": {"$in": categorias}
  })


"""
@api {get} /api/v1/books/price Get books by price, with pagination
@apiName GetBooksByPrice
@apiGroup Book

@apiQuery {int} minPrice=0 The minimum price
@apiQuery {int} maxPrice=1000 The maximum price
@apiQuery {string} orderBy=asc The order of the books, can be asc or desc
@apiQuery {int} page=1 The page of the query, which depends on the limit
@apiQuery {int} limit=10 The amount of books that each page has

@apiSuccess {array} data Array of books by the price

@apiSuccess {object}        pages                  The object containing the info for constructing the pages having the pages.
@apiSuccess {int}          pages.docCount       Total books of the query
@apiSuccess {int}          pages.totalPageCount Number of pages the query is capable
@apiSuccess {string|null}  pages.first          Link for the first page, if prev isn't it
@apiSuccess {string|null}  pages.prev           Link for the previous page, if current isn't it
@apiSuccess {string}       pages.curr           Link for the current page
@apiSuccess {string|null}  pages.next           Link for the next page, if current isn't last
@apiSuccess {string|null}  pages.last           Link for the last page, if next isn't it

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "data": [{...}, {...}, {...}],
  "pages": {
    "docCount": 100,
    "totalPageCount": 10,
    "first": "/api/v1/books/price?minPrice=0&maxPrice=1000&orderBy=asc&page=1",
    "prev": "/api/v1/books/price?minPrice=0&maxPrice=1000&orderBy=asc&page=2",
    "curr": "/api/v1/books/price?minPrice=0&maxPrice=1000&orderBy=asc&page=3",
    "next": "/api/v1/books/price?minPrice=0&maxPrice=1000&orderBy=asc&page=4",
    "last": "/api/v1/books/price?minPrice=0&maxPrice=1000&orderBy=asc&page=10"
  }
}
"""
@app.route("/api/v1/books/price/")
def get_books_price():
  try:
    min_price = int(request.args.get("minPrice", 0))
    max_price = int(request.args.get("maxPrice", 1000))
    orderBy = request.args.get("orderBy", "asc")
    if orderBy not in ("asc", "desc"):
      raise ValueError("Invalid orderBy value, must be 'asc' or 'desc'")
  except ValueError as e:
    return {"error": str(e)}, 400
  return paginate(db.books, [
    {"$match": {
      "price": {"$gte": min_price, "$lte": max_price}
    }},
    {"$sort": {"price": pymongo.ASCENDING if orderBy == "asc" else pymongo.DESCENDING}}
  ])


"""
@api {post} /api/v1/books/cart Save the user cart
@apiName SaveCart
@apiGroup Cart

@apiQuery {json} cart The cart object, either an array or an object, depending on the implementation

@apiSuccessExample {json} 201:
HTTP/1.1 201 Created
{
  "success": true
}
"""
@app.route("/api/v1/books/cart", methods=["POST"])
def add_to_cart():
  cart = json_util.loads(request.args.get("cart", False)) # I have no idea how cart should be formated but idc
  if not cart:
    return {"error": "Cart is missing"}, 400
  db.cart.insert_one({
    "timestamp": datetime.now(),
    "cart": cart
  })
  return {"success": True}, 201


"""
@api {post} /api/v1/user/signup Create a user without permissions
@apiName Signup
@apiGroup Auth

@apiQuery {string} username The username
@apiQuery {string} password The password
@apiQuery {string} token The token to access the API

@apiSuccessExample {json} 201:
HTTP/1.1 201 Created
{
  "success": true
}
@apiErrorExample {json} 400:
HTTP/1.1 400 Bad Request
{
  "error": "Missing username or password"
}
@apiErrorExample {json} 409:
HTTP/1.1 409 Conflict
{
  "error": "Username already taken"
}
@apiErrorExample {json} 401:
HTTP/1.1 401 Unauthorized
{
  "error": "token expired",
  "expirado": true
}
@apiErrorExample {json} 407:
HTTP/1.1 407 Proxy Authentication Required
{
  "error": "Token is missing!"
}
"""
@app.route("/api/v1/user/signup", methods=["POST"])
def signup():
  username = request.args.get("username", False)
  password = request.args.get("password", False)
  if not username or not password:
    return {"error": "Missing username or password"}, 400
  # check if username is already taken
  if db.users.find_one({"username": username}):
    return {"error": "Username already taken"}, 409
  db.users.insert_one({
    "username": username,
    "password": password,
    "confirmed": False,
    "timestamp": datetime.now()
  })
  return {"success": True}, 201


"""
@api {post} /api/v1/user/login Login a user (if it's confirmed), returning a token
@apiName Login
@apiGroup Auth

@apiQuery {string} username The username
@apiQuery {string} password The password

@apiSuccess {string} token The token to access the API, valid for 30 minutes

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "token": "thetokentheuserwillreceive"
}
@apiErrorExample {json} 400:
HTTP/1.1 400 Bad Request
{
  "error": "Missing username or password"
}
@apiErrorExample {json} 401:
HTTP/1.1 401 Unauthorized
{
  "error": "Invalid username or password"
}
@apiErrorExample {json} 403:
HTTP/1.1 403 Forbidden
{
  "error": "User not confirmed"
}
"""
@app.route("/api/v1/user/login", methods=["POST"])
def login():
  username = request.args.get("username", False)
  password = request.args.get("password", False)
  if not username or not password:
    return {"error": "Missing username or password"}, 400
  user = db.users.find_one({"username": username, "password": password})
  if not user:
    return {"error": "Invalid username or password"}, 401
  if user["confirmed"] is False:
    return {"error": "User not confirmed"}, 403
  token = jwt.encode({
    "username": username,
    "exp": datetime.now() + timedelta(minutes=30)
  }, app.config["SECRET_KEY"])
  return {"token": token}, 200


"""
@api {post} /api/v1/user/confirmation Confirm a user
@apiName Confirmation
@apiGroup Auth

@apiQuery {string} username The username
@apiQuery {string} token The token to access the API

@apiSuccessExample {json} 200:
HTTP/1.1 200 OK
{
  "success": true
}
@apiErrorExample {json} 400:
HTTP/1.1 400 Bad Request
{
  "error": "Missing username"
}
@apiErrorExample {json} 404:
HTTP/1.1 404 Not Found
{
  "error": "User not found"
}
@apiErrorExample {json} 401:
HTTP/1.1 401 Unauthorized
{
  "error": "token expired",
  "expirado": true
}
@apiErrorExample {json} 407:
HTTP/1.1 407 Proxy Authentication Required
{
  "error": "Token is missing!"
}
"""
@app.route("/api/v1/user/confirmation", methods=["POST"])
@token_required
def confirmation():
  # if it has token it already is admin
  target = request.args.get("username", False)
  if not target:
    return {"error": "Missing username"}, 400
  user = db.users.find_one({"username": target})
  if not user:
    return {"error": "User not found"}, 404
  db.users.update_one({"username": target}, {"$set": {"confirmed": True}})
  return {"success": True}, 200


if __name__ == "__main__":
  from pprint import pprint

  t = [{'grades': {'grade': 80, 'mean': 75, 'std': 6, 'test': 1}},
       {'grades': {'grade': 85, 'mean': 90, 'std': 4, 'test': 2}},
       {'grades': {'grade': 95, 'mean': 85, 'std': 6, 'test': 3}},
       {'grades': {'grade': 90, 'mean': 75, 'std': 6, 'test': 1}},
       {'grades': {'grade': 87, 'mean': 90, 'std': 3, 'test': 2}},
       {'grades': {'grade': 91, 'mean': 85, 'std': 4, 'test': 3}}]
  pprint(list(db.aggregate([
    {
      "$documents": t
    }, {
      "$replaceRoot": {"newRoot": "$grades"}
    },
  ])))
