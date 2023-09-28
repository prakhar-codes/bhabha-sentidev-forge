from flask import Flask, render_template, request, redirect, url_for, jsonify
import psycopg2
from datetime import datetime
from flask_cors import CORS
import pandas as pd
import re
import string
import numpy as np
import torch

app = Flask(__name__)
CORS(app)

from transformers import DistilBertForSequenceClassification, DistilBertTokenizer
import joblib

model_path = 'backend/distilbert_model_new'
model = DistilBertForSequenceClassification.from_pretrained(model_path, from_tf=True)
tokenizer = DistilBertTokenizer.from_pretrained(model_path)
label_encoder = joblib.load('backend/label_encoder.joblib')

max_seq_length = 128
def preprocess_text(text):
   
    text = re.sub(r'http\S+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = text.lower()
    return text

# Define a function to predict sentiment
def predict_sentiment(review):

    inputs = tokenizer(review, padding=True, truncation=True, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    # Determine the predicted sentiment label
    predicted_label = torch.argmax(logits, dim=1).item()
    
    # Map the predicted label to your desired labels (1, 2, 3, 4, 5)
    sentiment_label = predicted_label + 1
    
    return sentiment_label

# Configure the PostgreSQL connection
db_params = {
    "host": "localhost",
    "database": "reviews",
    "user": "postgres",
    "password": "prakhar123",
    "port": "5432",  # Default PostgreSQL port
}

# Predicting rating of reviews in Database

connection = psycopg2.connect(**db_params)
cursor = connection.cursor()

df = pd.read_csv('backend/data-analysis.csv')
places = list(df['Place'])
best_company = list(df['Likely_Partner'])

def update_likely_partner() :
    for place, company in zip(places, best_company):
        sql = "UPDATE places SET best_company = %s WHERE name = %s"
        cursor.execute(sql, (company, place))
        connection.commit()

def update_predictions() :
    for place in places:
        # Use parameterized query to prevent SQL injection
        cursor.execute("SELECT name, review FROM reviews WHERE place = %s;", (place,))
        reviews = cursor.fetchall()

        # Loop through the reviews for each place
        for review in reviews:
            # Call your predict() function to predict the rating
            predicted_rating = predict_sentiment(review[1])

            # Update the database with the predicted_rating
            cursor.execute("UPDATE reviews SET predicted_rating = %s WHERE name = %s;", (predicted_rating, review[0]))
            connection.commit()



# Function to calculate and update the average rating and number of reviews for a place
def update_db(place):
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        # Execute an SQL query to calculate the average rating
        cursor.execute("SELECT AVG(rating) FROM reviews WHERE place = %s;", (place,))
        average_rating = cursor.fetchone()[0]

        # Execute an SQL query to calculate the number of reviews
        cursor.execute("SELECT COUNT(*) FROM reviews WHERE place = %s;", (place,))
        num_reviews = cursor.fetchone()[0]

        # Update the 'rating' column in the 'places' table
        cursor.execute("UPDATE places SET rating = %s WHERE name = %s;", (average_rating, place))
        connection.commit()  # Commit the update

        # Update the 'num_reviews' column in the 'places' table
        cursor.execute("UPDATE places SET num_reviews = %s WHERE name = %s;", (num_reviews, place))
        connection.commit()  # Commit the update

        cursor.close()
        connection.close()

        return average_rating, num_reviews
    except Exception as e:
        print(f"An error occurred while calculating average rating: {str(e)}")
        return None

@app.route('/api/places')
def index():
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM places ORDER BY rating DESC")
        places = cursor.fetchall()

        # Update the average rating and number of reviews for each place in the 'places' list
        for place in places:
            place_name = place[0]
            place_rating, place_num_reviews = update_db(place_name)
            if place_rating is not None and place_num_reviews is not None:
                place = list(place)  # Convert the tuple to a list to update the rating
                place[1] = place_rating
                place[2] = place_num_reviews

        # Close the database connection
        cursor.close()
        connection.close()

        # Convert the database results to a list of dictionaries
        places_data = [{'name': place[0], 'rating': place[1], 'num_reviews': place[2], 'best_company' : place[3]} for place in places]

        return jsonify(places_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/api/placereview/<place>')
def placeReview(place):
    try:
        # Connect to the PostgreSQL database using parameterized query
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        # Use parameterized query to prevent SQL injection
        cursor.execute("SELECT name, date, place, rating, company, review, predicted_rating FROM reviews WHERE place = %s ORDER BY date DESC, name ASC, time DESC;", (place,))
        reviews = cursor.fetchall()

        cursor.execute("SELECT * FROM places WHERE name = %s", (place,))
        current_place = cursor.fetchone()
    
        # Close the database connection
        cursor.close()
        connection.close()
        df_as_dict = df.to_dict(orient='records')
        # Convert the data to a JSON response
        response_data = {
            'place': place,
            'reviews': reviews,
            'current_place': dict(zip([column[0] for column in cursor.description], current_place)),
            'place_analysis': df_as_dict
        }

        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)})

    
@app.route('/api/add_item', methods=['POST'])
def add_item():
    try:
        # Access the data sent from the React frontend
        data = request.json  # Assuming the data is sent in JSON format

        # Access individual fields in the data
        name = data.get('name')
        company = data.get('company')
        rating = data.get('rating')
        review = data.get('review')
        get_predicted_rating = data.get('predicted_rating')
        place = data.get('place')

        # if(rating)
        print("Rating ", rating, get_predicted_rating)
        predicted_rating = predict_sentiment(review)

        # Get the current time in your local timezone (system's default timezone)
        current_time = datetime.now()

        # Format the date as 'YYYY-MM-DD'
        formatted_date = current_time.strftime('%Y-%m-%d')

        # Format the timestamp in PostgreSQL format (YYYY-MM-DD HH:MI:SS)
        formatted_time = current_time.strftime('%Y-%m-%d %H:%M:%S')
        if rating:
            conn = psycopg2.connect(**db_params)
            conn.cursor().execute('INSERT INTO reviews (name, date, place,predicted_rating, rating, company, review, time) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);', (name, formatted_date, place, get_predicted_rating,rating, company, review, formatted_time))
            conn.commit()
            conn.close()
            result = update_db(place)
            response_data = {
                "inserted": "Success"
            }
            return jsonify(response_data), 200


        else:

            # Return a JSON response with the predicted rating
            response_data = {
                "predicted_rating": predicted_rating
            }

            return jsonify(response_data), 200
    except Exception as e:
        print(str(e))
        return f"An error occurred: {str(e)}"



if __name__ == '__main__':
    app.run(debug=True)  # Run on port 5173