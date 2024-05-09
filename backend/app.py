from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

client = MongoClient('MONGODB_CONECTION_STRING',
    tls=True,
    tlsAllowInvalidCertificates=True
)
db = client["DATABASE_NAME"]
@app.route("/books", methods=["GET"])
def get_books():
    return jsonify([]), 200