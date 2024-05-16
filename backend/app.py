import pymongo
from flask import Flask, jsonify
from flask.json.provider import JSONProvider
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os
from bson import ObjectId, json_util

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
  return list(db.books.find({}))[0]["books"]


@app.route("/api/v1/books/<int:book_id>", methods=["GET"])
def get_book(book_id: int):
  book_id = str(book_id)
  book = db.books.find_one({"books.id": book_id})
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
      "$unwind": "$books"
    },
    {
      "$sort": {"books.score": pymongo.DESCENDING}
    },
    {
      "$limit": 5
    },
    {
      "$sort": {"books.price": pymongo.ASCENDING}
    },
    {
      "$project":{
        "_id": 0
      }
    }
  ]))
