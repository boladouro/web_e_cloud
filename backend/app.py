from __future__ import annotations

import flask
import pymongo
from flask import Flask, jsonify, request, after_this_request
from flask.json.provider import JSONProvider
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os
from bson import ObjectId, json_util
import re
from datetime import datetime

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
client = MongoClient(
  connection_string,
  tls=os.getenv("MONGODB_TLS", True) in ("1", "true", "True", "yes", "Yes", "y", "Y"),
  tlsAllowInvalidCertificates=True,
  timeoutMS=5000,
)
db = client["backend"]
if "books" not in db.list_collection_names():
  ValueError("No books collection found, run `pixi run setup-db` or use mongoimport to create it")
"""
def get_pagination_links(request, count):
  page = request.args.get("page", 1)
  countPerPage = request.args.get("limit", 10)
  base_url = request.base_url
  total_pages = count // countPerPage
  if count % countPerPage != 0:
    total_pages += 1
  if page > total_pages:
    page = total_pages
  if page < 1:
    page = 1
  restOfArgs = "&".join([f"{k}={v}" for k, v in request.args.items() if k != "page"])
  return {
    "first":  f"{base_url}?{restOfArgs}&page=1" if page > 2 else None, # if page = 2 then prev will cover
    "prev":   f"{base_url}?{restOfArgs}&page={page - 1}" if page > 1 else None,
    "curr":   f"{base_url}?{restOfArgs}&page={page}",
    "next":   f"{base_url}?{restOfArgs}&page={page + 1}" if page < total_pages else None,
    "last":   f"{base_url}?{restOfArgs}&page={total_pages}" if page < total_pages - 1 else None,
  }
"""


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
            "pageCount": {"$ceil": {"$divide": ["$docCount", limit]}}
          }},
          {"$project": {
            "docCount": 1,
            "pageCount": 1,
            "first": f"{request.base_url}?{restOfArgs}&page=1" if page > 2 else None,
            "prev": f"{request.base_url}?{restOfArgs}&page={page - 1}" if page > 1 else None,
            "curr": f"{request.base_url}?{restOfArgs}&page={page}",
            "next": {
              "$cond": {"if": {"$lt": [page, "$pageCount"]}, "then": f"{request.base_url}?{restOfArgs}&page={page + 1}",
                        "else": None}},
            "last": {"$cond": {"if": {"$lt": [page + 1, "$pageCount"]}, "then": {
              "$concat": [f"{request.base_url}?{restOfArgs}&page=", {"$toString": "$pageCount"}]
            }, "else": None}},
          }}
        ],
        "data": [
          {"$skip": (page - 1) * limit},
          {"$limit": limit}
        ]
      }
    },
  ])
  import json
  print(json.dumps(currentPipeline, indent=2))
  return list(db.aggregate(currentPipeline))[0]  # I don't know why dict fucks it

# 1
@app.route("/api/v1/books", methods=["GET"])
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

# 2
@app.route("/api/v1/books/<int:book_id>", methods=["GET"])
def get_book(book_id: int):
  book_id = str(book_id)
  book = db.books.find_one({"id": book_id})
  if not book:
    return {"error": "Book not found"}, 404
  return book

# 3
@app.route("/api/v1/books", methods=["POST"])
def create_book():
  raise NotImplementedError()  # TODO auth

# 4
@app.route("/api/v1/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
  raise NotImplementedError()  # TODO auth

# 5
@app.route("/api/v1/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
  raise NotImplementedError()  # TODO auth

# 6
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

# 7
@app.route("/api/v1/books/total", methods=["GET"])
def get_total_books():
  return {"count": db.books.count_documents({})}

# 8
@app.route("/api/v1/books/autor/<string:autor>", methods=["GET"])
def get_books_author(autor: str):
  return paginate(db.books, {
    "authors": {"$elemMatch": {"$regex": autor, "$options": "i"}}
  })

# 9
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
# 10
@app.route("/api/v1/books/categories/<string:categorias>")
def get_books_category(categorias: str):
  categorias = categorias.split(",")
  return paginate(db.books, {
    "categories": {"$in": categorias}
  })

# 11
@app.route("/api/v1/books/price/")
def get_books_price():
  try:
    min_price = int(request.args.get("minPrice", 0))
    max_price = int(request.args.get("maxPrice", 1000))
    orderBy =  request.args.get("orderBy", "asc")
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

# 12 (1) # há dois 12s
@app.route("/api/v1/books/cart", methods=["POST"])
def add_to_cart():
  db.cart.insert_one({})  # TODO

# 12 (2)
@app.route("/api/v1/user/signup", methods=["POST"])
def signup():
  db.users.insert_one({})  # TODO
  raise NotImplementedError()

# 13
@app.route("/api/v1/user/login", methods=["POST"])
def login():
  raise NotImplementedError()

# 14
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
