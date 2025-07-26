from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import base64
import cv2
from PIL import Image
from io import BytesIO
from sklearn.metrics.pairwise import cosine_similarity
from insightface.app import FaceAnalysis
from bson import ObjectId

# 🔹 MongoDB collection assumed to be defined in db.py
from db import collection

app = FastAPI()

# 🔹 Initialize InsightFace once
face_app = FaceAnalysis(_id="buffalo_l", providers=["CPUExecutionProvider"])
face_app.prepare(ctx_id=0)


class BiometricRequest(BaseModel):
    originalProfile: List[float]
    attemptProfile: List[float]

class FaceCompareRequest(BaseModel):
    referenceEmbedding: List[float]
    faceImageBase64: str  # Image encoded as base64 string


@app.post("/predict/biometric")
def predict_biometric(data: BiometricRequest):
    try:
        original = np.array(data.originalProfile).reshape(1, -1)
        attempt = np.array(data.attemptProfile).reshape(1, -1)

        if original.shape != attempt.shape:
            raise HTTPException(status_code=400, detail="Profiles must be the same length.")

        score = float(cosine_similarity(original, attempt)[0][0])

        if score > 0.98:
            prediction = "valid"
        elif score > 0.92:
            prediction = "suspicious"
        elif score > 0.90:
            prediction = "rejected"
        else:
            prediction = "threat"

        return {
            "score": round(score, 4),
            "prediction": prediction
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    

def predict_similarity(original: np.ndarray, attempt: np.ndarray) -> dict:
    score = float(cosine_similarity(original, attempt)[0][0])

    if score > 0.98:
        prediction = "valid"
    elif score > 0.92:
        prediction = "suspicious"
    elif score > 0.90:
        prediction = "rejected"
    else:
        prediction = "threat"

    return {
        "score": round(score, 4),
        "prediction": prediction
    }


def extract_embedding_from_file(file: UploadFile) -> np.ndarray:
    try:
        image_data = file.file.read()
        image = Image.open(BytesIO(image_data)).convert("RGB")
        image_np = np.array(image)
        faces = face_app.get(image_np)

        if not faces:
            raise ValueError("No face detected.")

        return faces[0].embedding
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face extraction failed: {str(e)}")

def extract_embedding_from_base64(base64_string: str) -> np.ndarray:
    try:
        img_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(img_data)).convert("RGB")
        image_np = np.array(image)
        faces = face_app.get(image_np)

        if not faces:
            raise ValueError("No face detected in base64 image.")

        return faces[0].embedding
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Base64 face extraction failed: {str(e)}")


@app.post("/register-face")
async def register_face(user_id: Optional[str] = Query(None), image: UploadFile = File(...)):
    try:
        embedding = extract_embedding_from_file(image)
        doc = {"embedding": embedding.tolist()}

        if user_id:
            try:
                object_id = ObjectId(user_id)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")
            collection.update_one({"_id": object_id}, {"$set": {"embedding": doc["embedding"]}})
            return {"message": "Face embedding updated for existing user.", "_id": user_id}
        else:
            inserted = collection.insert_one(doc)
            return {"message": "Face registered with new ID.", "_id": str(inserted.inserted_id)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


# 🔎 Verify uploaded face against registered ones
@app.post("/verify-face")
async def verify_face(image: UploadFile = File(...)):
    try:
        attempt_embedding = extract_embedding_from_file(image).reshape(1, -1)
        users = list(collection.find({"embedding": {"$exists": True}}))

        if not users:
            raise HTTPException(status_code=404, detail="No registered users found.")

        results = []
        for user in users:
            original_embedding = np.array(user['embedding']).reshape(1, -1)
            match = predict_similarity(original_embedding, attempt_embedding)

            results.append({
                "_id": str(user["_id"]),
                "score": match["score"],
                "prediction": match["prediction"]
            })

        best_match = max(results, key=lambda x: x["score"])
        return best_match

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")