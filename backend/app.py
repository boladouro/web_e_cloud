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
  return list(db.books.find({}))
