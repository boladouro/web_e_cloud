from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
connection_string = os.getenv("MONGODB_CONECTION_STRING")
if not connection_string:
  raise ValueError("No connection string found, create a .env file with the MONGODB_CONECTION_STRING variable.")

app = Flask(__name__)
CORS(app)
client = MongoClient(
  connection_string,
  tls=True,
  tlsAllowInvalidCertificates=True,
  timeoutMS=5000,
)
db = client["backend"]
if "books" not in db.list_collection_names():
  ValueError("No books collection found, run `pixi run setup-db` or use mongoimport to create it")

@app.route("/books", methods=["GET"])
def get_books():
  return jsonify([]), 200
