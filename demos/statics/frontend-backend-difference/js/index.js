
const container = document.getElementById('container');

const createNode = type => {
    return document.createElement(type);
}

const setAttr = (element, attribute, value) => {
    element.setAttribute(attribute, value);
}

const append = (parent, child) => {
    parent.appendChild(child);
}

const createCard = meal => {

    const mealCard = createNode('div'),
        mealImage = createNode('div'),
        mealImg = createNode('img'),
        mealInfo = createNode('div'),
        mealName = createNode('h2'),
        mealDesc = createNode('p'),
        mealOrder = createNode('div'),
        mealPrice = createNode('span'),
        orderButton = createNode('a');
        orderButtonIcon = createNode('img');

    setAttr(mealCard, 'class', 'meal-card');
    setAttr(mealImage, 'class', 'meal-image');
    setAttr(mealInfo, 'class', 'meal-info');
    setAttr(mealOrder, 'class', 'meal-order');
    setAttr(mealPrice, 'class', 'price');
    setAttr(orderButton, 'class', 'order-button');

    orderButton.addEventListener('click', orderButtonClicked);

    append(container, mealCard);
    append(mealCard, mealImage);
    append(mealImage, mealImg);
    append(mealCard, mealInfo);
    append(mealInfo, mealName);
    append(mealInfo, mealDesc);
    append(mealInfo, mealOrder);
    append(mealOrder, mealPrice);
    append(mealOrder, orderButton);
    append(orderButton, orderButtonIcon);

    mealImg.src = meal.image;
    mealName.textContent = meal.name;
    mealDesc.textContent = meal.description;
    mealPrice.textContent = '$' + meal.price;
    orderButtonIcon.src = './img/shopping-basket.svg';    
    orderButton.innerHTML += ' إطلبها';

}

const getAllMeals = () => {
    const url = 'https://demos.coretabs.net/server/frontend-backend-difference/api/meals';
    fetch(url)
        .then(
            response => response.json()
        ).then(
            mealsData => {
                var mealsCards = mealsData.map(meal => {
                    createCard(meal);
                });
            }
        ).catch(
            error  => {
                console.error(error);
            }
        );
}

getAllMeals();

const orderButtonClicked = e => {
    changeButton(e.target);
    changeOpacity(e.target);
}

const changeButton = el => {
    el.textContent = 'تم الطلب';
    el.style.backgroundColor = '#1dd1a1';
}

const changeOpacity = el => {
    const mealCard = el.closest('.meal-card');
    mealCard.style.opacity = '0.5';
}
