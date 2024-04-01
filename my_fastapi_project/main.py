from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from typing import Any, Dict

app = FastAPI()

# Replace your MongoDB URI here, and ensure your credentials are secured, especially in production
mongo_conn_str = "mongodb+srv://user:user@cluster0.8wuam9k.mongodb.net/Cluster0?retryWrites=true&w=majority"
client = MongoClient(mongo_conn_str)
db = client.get_default_database()  # Adjust if you have a specific database in mind

class Item(BaseModel):
    data: Dict[str, Any]  # Specify that the data is a dictionary with string keys and values of any type

@app.post("/upload/")
async def upload_to_mongodb(item: Item):
    # Replace 'your_collection' with the actual collection name you want to use
    collection = db.your_collection
    if not item.data:
        raise HTTPException(status_code=400, detail="No data provided to upload")
    result = collection.insert_one(item.data)
    return {"message": "Data uploaded successfully", "id": str(result.inserted_id)}
