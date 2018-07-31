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
    all_meals = list(reversed(all_meals))
    return jsonify(all_meals)


def clean_and_seed_meals():
    meals_list.clear()

    meals_list.append(Meal(
        name='ساندويش الفاهيتا',
        description='ساندويش الدجاج مع الطماطم والخضروات',
        image='img/Fajita.png',
        price='$12'))

    meals_list.append(Meal(
        name='فطائر محلاة',
        description='فطائر محلاة بالفراولة والمكسرات',
        image='img/pancake.png',
        price='$8'))

    meals_list.append(Meal(
        name='عصير فراولة',
        description='عصير الفراولة المثلج مع قطع الفرولة الطازجة',
        image='img/juice.png',
        price='$10'))


def add_new_meal(meal_data):
    new_meal = Meal(
        name=meal_data['name'],
        description=meal_data['description'],
        image=meal_data['image'],
        price=meal_data['price'],
    )

    if len(meals_list) >= 15:
        clean_and_seed_meals()

    meals_list.append(new_meal)


@app.route('/frontend-backend-difference/api/meals', methods=['GET', 'POST'])
def meals():

    if request.method == 'GET':
        return get_all_meals()

    elif request.method == 'POST':
        meal_data = request.get_json()
        add_new_meal(meal_data)
        return Response(status=201)
