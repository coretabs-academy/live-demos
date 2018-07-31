function addMeal(mealData) {
    const url = 'https://demos.coretabs.net/server/frontend-backend-difference/api/meals';
    fetch(url, { method: 'post', body: mealData, headers: { 'Content-Type': 'application/json' } })
        .then(
            response => response.text()
        ).then(
            response => {
                console.log(response)
            }
        );
}

function submitMeal(event) {
    event.preventDefault();

    var mealData = {
        'name': document.getElementsByName('name')[0].value,
        'description': document.getElementsByName('description')[0].value,
        'image': document.getElementsByName('image')[0].value,
        'price': document.getElementsByName('price')[0].value,
    };
    addMeal(JSON.stringify(mealData));
}

var form = document.getElementsByTagName('form')[0];
form.addEventListener('submit', submitMeal);