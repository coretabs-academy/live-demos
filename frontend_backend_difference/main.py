from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

meals_list = []


class Meal():
    def __init__(self, name, description, image, price):
        self.name = name
        self.description = description
        self.image = image
        self.price = price


def get_all_meals():
    all_meals = [meal.__dict__ for meal in meals_list]
    return jsonify(all_meals)


def add_new_meal(meal_data):
    new_meal = Meal(
        name=meal_data['name'],
        description=meal_data['description'],
        image=meal_data['image'],
        price=meal_data['price'],
    )
    meals_list.append(new_meal)


@app.route('/frontend-backend-difference/api/meals', methods=['GET', 'POST'])
def meals():

    if request.method == 'GET':
        return get_all_meals()

    elif request.method == 'POST':
        meal_data = request.get_json()
        add_new_meal(meal_data)
        return Response(status=201)
