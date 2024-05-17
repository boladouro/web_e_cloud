import pymongo
from flask import Flask, jsonify
from flask.json.provider import JSONProvider
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os
from bson import ObjectId, json_util
import re
from datetime import datetime

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
client = MongoClient(
  connection_string,
  tls=os.getenv("MONGODB_TLS", True) in ("1", "true", "True", "yes", "Yes", "y", "Y"),
  tlsAllowInvalidCertificates=True,
  timeoutMS=5000,
)
db = client["backend"]
if "books" not in db.list_collection_names():
  ValueError("No books collection found, run `pixi run setup-db` or use mongoimport to create it")


@app.route("/api/v1/books", methods=["GET"])
def get_books():
  # TODO falta paginacao
  return list(db.books.find({}))


@app.route("/api/v1/books/<int:book_id>", methods=["GET"])
def get_book(book_id: int):
  book_id = str(book_id)
  book = db.books.find_one({"id": book_id})
  if not book:
    return {"error": "Book not found"}, 404
  return book


@app.route("/api/v1/books", methods=["POST"])
def create_book():
  raise NotImplementedError()  # TODO auth


@app.route("/api/v1/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
  raise NotImplementedError()  # TODO auth


@app.route("/api/v1/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
  raise NotImplementedError()


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

@app.route("/api/v1/books/total", methods=["GET"])
def get_total_books():
  return {"count": db.books.count_documents({})}

@app.route("/api/v1/books/autor/<string:autor>", methods=["GET"])
def get_books_author(autor:str):
  # TODO falta paginacao
  return list(db.books.find({
    "authors": {"$elemMatch": {"$regex": autor, "$options": "i"}}
  }))

@app.route("/api/v1/books/ano/<int:ano>")
def get_book_ano(ano: int):
  # TODO falta paginacao
  start = datetime(ano, 1, 1)
  end = datetime(ano, 12, 31, 23, 59, 59)
  return list(db.books.find({
    "publishedDate": {
      "$gte": start,
      "$lte": end
    }
  }))

@app.route("/api/v1/books/categories/<string:categorias>")
def get_books_category(categorias: str):
  # TODO falta paginacao
  categorias = categorias.split(",")
  return list(db.books.find({})) # TODO

@app.route("/api/v1/books/price/")
def get_books_price():
  # TODO falta paginacao
  return list(db.books.find({})) # TODO

@app.route("/api/v1/books/cart", methods=["POST"])
def add_to_cart():
  db.cart.insert_one({}) # TODO

@app.route("/api/v1/user/signup", methods=["POST"])
def signup():
  db.users.insert_one({}) # TODO
  raise NotImplementedError()

@app.route("/api/v1/user/login", methods=["POST"])
def login():
  raise NotImplementedError()

@app.route("/api/v1/user/confirmation", methods=["POST"])
def logout():
  raise NotImplementedError()

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
