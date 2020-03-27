from flask import Blueprint, request, jsonify
import json
import os
import sys
from pymongo import MongoClient
from bson import ObjectId  # Encode the object Id...

# For multiple Object Detection
import cv2
import pandas as pd
import matplotlib.pyplot as plt
import cvlib as cv
from cvlib.object_detection import draw_bbox

# JSONEncoder to manage the MongoDB ObjectId when asking back our data from the Database
# Going to responds if we have an instance of an object Id, with the String version of that...
# Will allow us to encode our Id in order to send that together with our JSON to the front end...


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):  # obj : the Object
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


# MongoDB config
USER_name = "Yassine"
PASSWORD = "mdp1234"

connection = "mongodb+srv://" + USER_name + ":" + PASSWORD + \
    "@cluster0-khgwi.mongodb.net/My_images?retryWrites=true&w=majority"
client = MongoClient(connection)
db = client.My_images
collection = db["items"]

# register the Blueprints
# Get Coordinates of Prediction : YOLO
boundaryBoxCoord = Blueprint("boundary", __name__)
dataRoute = Blueprint("data", __name__)     # Show & Send data of Mongo
saveRoute = Blueprint("save", __name__)   # Receive & Store in Mongo
itemRoute = Blueprint("items", __name__)       # Show only one Image
updateRoute = Blueprint("update", __name__)    # Update BOX coordinates
deleteRoute = Blueprint("delete", __name__)    # Deleting images


# Don't work yet
# To get the coordinates of First Predictions : Multiple Object Detection
@boundaryBoxCoord.route("/api/boundary/<id>")
def boundary(id):
    cursor = collection.find_one({"_id": ObjectId(id)})

    # im = cv2.imread('./dog.jpg')
    bbox, label, conf = cv.detect_common_objects(im)
    # output_image = draw_bbox(im, bbox, label, conf)
    # plt.imshow(output_image)
    # plt.show()

    keys = label
    values = bbox
    dictionary = dict(zip(keys, values))
    # print(dictionary)

    return jsonify(data=dictionary)

# To Return the data that we have in MongoDB
@dataRoute.route("/api/data")
def data():
    items = []
    # Get all the items
    cursor = collection.find({})

    for document in cursor:
        items.append({"_id": JSONEncoder().encode(
            document["_id"]), "predictionName": document["predictionName"], "imageUrl": document["imageUrl"]})

    # To take off the "" at the begining and the end of of each '_id' in our Database
    temp = items
    for i in range(len(items)):
        items[i]["_id"] = items[i]["_id"].strip('"')
        # items[i]["_id"] = items[i]["_id"].replace('"', '')
        print("COUCOU !!!", items[i]["_id"])
    print(items)

    return jsonify(data=items)


# To Receive and store Data into Mongodb
@saveRoute.route("/api/save", methods=["POST"])
def save():
    print(request.json)

    predictionName = request.json.get("predictionName")
    # coordinates = request.json.get("coordinates")
    imageUrl = request.json.get("imageUrl")

    item = {
        "predictionName": predictionName,
        # "coordinates": coordinates,
        "imageUrl": imageUrl,
    }
    collection.insert_one(item)

    return jsonify(data="item created successfully")

# Show only one Image to EDIT it
@itemRoute.route("/api/data/<id>")
def items(id):
    cursor = collection.find_one({"_id": ObjectId(id)})
    print(cursor)

    return jsonify(data=JSONEncoder().encode(cursor))


@updateRoute.route("/api/update/<id>", methods=["PUT"])
def update(id):
    print(request.json)

    itemid = request.json.get("itemid")
    predictionName = request.json.get("predictionName")
    # coordinates = request.json.get("coordinates")
    imageUrl = request.json.get("imageUrl")

    updateItem = {
        "predictionName": predictionName,
        # "coordinates": coordinates,
        "imageUrl": imageUrl
    }

    # Send the values in the instance of the current Object ID inside Mongo
    collection.update_one({"_id": ObjectId(itemid)}, {"$set": updateItem})

    return jsonify(data="update successfull")


@deleteRoute.route("/api/delete/<id>", methods=["DELETE"])
def delete(id):
    itemid = request.json.get("id")

    collection.remove({"_id": ObjectId(itemid)})

    return jsonify(data="item deleted")
