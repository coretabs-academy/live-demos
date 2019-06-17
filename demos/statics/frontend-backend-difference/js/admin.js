const mealName = document.getElementsByName('name')[0],
    mealDescription = document.getElementsByName('description')[0],
    mealImg = document.getElementsByName('image')[0],
    mealPrice = document.getElementsByName('price')[0];

const setValidationMsg = (el, msg) => {
    el.addEventListener('invalid', function (event) {
        if (el.validity.valueMissing) {
            el.setCustomValidity(msg);
        } else if (el.validity.typeMismatch) {
            el.setCustomValidity(msg);
        } else {
            el.setCustomValidity('');
        }
    });
}
setValidationMsg(mealName, 'الرجاء ادخال اسم الوجبة');
setValidationMsg(mealDescription, 'الرجاء ادخال وصف الوجبة');
setValidationMsg(mealImg, 'قم بإدخال رابط لصورة الوجبة');
setValidationMsg(mealPrice, 'قم بإدخال سعر الوجبة');

const addMeal = mealData => {
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
const submitMeal = event => {
    event.preventDefault();
    let mealData = {
        'name': mealName.value,
        'description': mealDescription.value,
        'image': mealImg.value,
        'price': mealPrice.value,
    };
    addMeal(JSON.stringify(mealData));
    const container = document.getElementById('container');
    const backHomeButton = document.getElementById('back-home');
    container.innerHTML = '<div id="success"><span>&#x2714;</span><div>تم إضافة الوجبة بنجاح <p>جاري تحويلك للرئيسية...</p></div></div>';
    backHomeButton.style.display = 'none';
    window.setTimeout(function () {
        window.location.href = "./index.html";
    }, 2500);
}
const form = document.getElementsByTagName('form')[0];
form.addEventListener('submit', submitMeal);