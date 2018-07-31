var addToBasket = document.getElementsByClassName('buy');

Array.from(addToBasket).forEach(function (el) {

    el.addEventListener('click', function () {
        changeButton(el);
        fadeOut(el);
    });

});

function changeButton(el) {
    el.innerHTML = 'تم الطلب';
    el.style.backgroundColor = '#1dd1a1';
}

function fadeOut(el) {
    var mealCard = el.closest('.meal-card');
    mealCard.style.opacity = '0.5';
}

function create_meal_card(meal) {

    var mealCard = '<div class="meal-card"><div class="meal-image"><img src="' + meal.image + '" alt=""></div><div class="meal-info"><h2>' + meal.name + '</h2><p>' + meal.description + '</p><div class="meal-order"><h3 class="price">' + meal.price + '</h3><a class="buy" href="#"><i><img src="img/shopping-basket.svg" alt=""></i> إطلبها</a></div></div></div>';

    return mealCard
}

function get_all_meals() {

    const url = 'https://demos.coretabs.net/server/frontend-backend-difference/api/meals';
    fetch(url)
        .then(
            response => response.json()
        ).then(
            mealsData => {

                var mealsCards = mealsData.map(meal => {
                    var mealCard = create_meal_card(meal);
                    return mealCard;
                });

                var container = document.getElementById('container');
                container.innerHTML = mealsCards;
            }
        );
}

get_all_meals();