from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()


origins = [
    "https://retail-cyber-security.vercel.app",  # your React/Vite frontend (local)
    "https://retailcybersecurity-2.onrender.com",  # your Node.js server
    "*"  # (Optional) allow all origins — use this in dev only
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 👈 use "*" here to allow all (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔹 Request body model
class BiometricRequest(BaseModel):
    originalProfile: list
    attemptProfile: list

# 🔐 Biometric prediction route
@app.post("/predict/biometric")
def predict_biometric(data: BiometricRequest):
    try:
        original = np.array(data.originalProfile).reshape(1, -1)
        attempt = np.array(data.attemptProfile).reshape(1, -1)

        # ✅ Ensure both arrays have the same shape
        if original.shape != attempt.shape:
            raise HTTPException(status_code=400, detail="Profiles must be the same length.")

        # ✅ Cosine similarity calculation
        score = float(cosine_similarity(original, attempt)[0][0])

        # 🔍 Thresholds (adjust as needed)
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