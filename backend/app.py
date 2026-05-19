from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from collections import Counter

nltk.download('stopwords')

stop_words = set(stopwords.words('english'))
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

from products import products_db

class ReviewInput(BaseModel):
    review: str

class CompareRequest(BaseModel):
    product1: str
    product2: str


def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return ' '.join(words)


def predict_sentiment(review):
    cleaned = clean_text(review)
    vector = vectorizer.transform([cleaned])
    prediction = model.predict(vector)[0]
    confidence = max(model.predict_proba(vector)[0])

    return {
        "prediction": prediction,
        "confidence": round(float(confidence), 2)
    }


def generate_sentiment_score(reviews):
    positive = 0

    for review in reviews:
        result = predict_sentiment(review)
        if result["prediction"] == "Positive":
            positive += 1

    score = (positive / len(reviews)) * 100
    return round(score, 2)


def extract_keywords(reviews):
    text = " ".join(reviews)
    words = clean_text(text).split()
    common_words = Counter(words).most_common(5)

    return [word for word, count in common_words]


@app.get("/")
def home():
    return {
        "message": "AI Product Review Chatbot API Running"
    }


@app.post("/predict")
def predict(data: ReviewInput):
    return predict_sentiment(data.review)


@app.get("/products")
def get_products():
    return {
        "products": list(products_db.keys())
    }


@app.get("/detailed-products")
def get_detailed_products():
    # Sort products_db by antutu score in descending order
    sorted_products = sorted(
        products_db.items(), 
        key=lambda item: item[1].get("antutu", 0), 
        reverse=True
    )
    
    return {
        "products": [
            {
                "name": name,
                "price": specs["price"],
                "rating": specs["rating"],
                "battery": specs["battery"],
                "camera": specs["camera"],
                "display": specs["display"],
                "processor": specs.get("processor", "Unknown"),
                "ram": specs.get("ram", "Unknown"),
                
            }
            for name, specs in sorted_products
        ]
    }


@app.post("/compare")
def compare_products(data: CompareRequest):
    product1 = products_db.get(data.product1)
    product2 = products_db.get(data.product2)

    if not product1 or not product2:
        return {"error": "One or both phones not found in database."}

    # 1. Get Sentiment Scores 
    score1 = generate_sentiment_score(product1["reviews"])
    score2 = generate_sentiment_score(product2["reviews"])

    # 2. Get AnTuTu Scores
    antutu1 = product1.get("antutu", 0)
    antutu2 = product2.get("antutu", 0)

    # 3. Head-to-Head Normalization 
    # (Compare them against each other rather than the whole database)
    local_max_antutu = max(antutu1, antutu2)
    
    norm_antutu1 = (antutu1 / local_max_antutu) * 100 if local_max_antutu > 0 else 0
    norm_antutu2 = (antutu2 / local_max_antutu) * 100 if local_max_antutu > 0 else 0

    # 4. Adjusted Weights (80% Performance, 20% User Reviews)
    # This ensures an objectively faster phone doesn't lose just because of 1 bad review prediction
    ANTUTU_WEIGHT = 0.80
    SENTIMENT_WEIGHT = 0.20

    combined1 = (norm_antutu1 * ANTUTU_WEIGHT) + (score1 * SENTIMENT_WEIGHT)
    combined2 = (norm_antutu2 * ANTUTU_WEIGHT) + (score2 * SENTIMENT_WEIGHT)

    recommendation = data.product1 if combined1 >= combined2 else data.product2

    keywords1 = extract_keywords(product1["reviews"])
    keywords2 = extract_keywords(product2["reviews"])

    details1 = {k: v for k, v in product1.items() if k != "antutu"}
    details2 = {k: v for k, v in product2.items() if k != "antutu"}

    return {
        "product1": {
            "name": data.product1,
            "details": details1,
            "sentiment_score": round(score1, 2),
            "performance_score": round(norm_antutu1, 2),
            "final_score": round(combined1, 2),
            "keywords": keywords1
        },
        "product2": {
            "name": data.product2,
            "details": details2,
            "sentiment_score": round(score2, 2),
            "performance_score": round(norm_antutu2, 2),
            "final_score": round(combined2, 2),
            "keywords": keywords2
        },
        "recommended": recommendation
    }

@app.get("/recommendations")
def get_recommendations():
    sorted_products = sorted(
        products_db.items(), 
        key=lambda item: item[1].get("antutu", 0), 
        reverse=True
    )

    return {
        "recommendations": [
            {
                "name": name,
                "antutu": specs.get("antutu", 0),
                "details": specs
            }
            for name, specs in sorted_products
        ]
    }