//initializing all variables
const search = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const result = document.getElementById("result");
const meal = document.getElementById("meals");
const submit = document.getElementById("submit")
const mealInfo = document.getElementById("mealInfo");
const favList = document.getElementById("favList");

// favMeals array to store favourite meals
var favMeals = JSON.parse(localStorage.getItem('favMeals')) || [];

/**********Utility functions*************/

//function to check if the meal is added to FavMealList or not
function isPresent(favMeals, id){
    let res = false;
    for(let i=0; i<favMeals.length; i++){
        if(id == favMeals[i]){
            res=true;
        }
    }
    return res;
}

// function to search meal
function searchMeal(event) {
    event.preventDefault();
    console.log(search)
    if (search.value == "") {
        //search random meal
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
            .then(res => res.json())
            .then(data => {
                const value = data.meals.map(meal=>meal.strMeal);
                showMeals(data, value);
            });
    }
    else {
        //search meal as per usewr entered value
        const value = search.value;
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
            .then(res => res.json())
            .then(data => {
                showMeals(data, value);
            });
    }
}

//show desired meal
function showMeals(data, value){
    mealInfo.innerHTML="";
    result.innerHTML = `<h2 class="color-brown-font-600">Results:</h2>`;
    if (data.meals === null) {
        result.innerHTML = `<h5 class="color-brown-font-600">No meals found for ${value}</h5>
                            <h2 class="color-brown-font-600">Related Items:</h2>`;
    }
    else {
        meal.innerHTML = data.meals.map(
            meal => `<div class="card meal" id="meal">
                <img src=${meal.strMealThumb} class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body meal-body">
                    <a href='javascript:void(0);' onclick="addFavMeals(${meal.idMeal})" scroll="disable" >
                        <i class="fa-regular fa-heart ${isPresent(favMeals, meal.idMeal) ? 'font-wt-600':''}" data-mealId="${meal.idMeal}"></i>
                    </a>
                    <p>${meal.strMeal}</p>
                    <a href="#" id="info-button" onclick="showDetails(${meal.idMeal})">
                        <i class="fa fa-info-circle"></i>
                    </a>
                </div>
            </div>`
        ).join("");
    }
}

//add meals to favourite list
function addFavMeals(id){
    if(id){
        var favMeals = JSON.parse(localStorage.getItem('favMeals')) || [];
        const mealPresent = document.querySelector(`[data-mealId="${id}"]`);
        if (!favMeals.includes(id)) {
            favMeals.push(id);
            mealPresent.classList.add('font-wt-600');
        }
        else{
            mealPresent.classList.remove('font-wt-600');
            let index = favMeals.indexOf(id);
            favMeals.splice(index,1);
        }
        localStorage.setItem('favMeals', JSON.stringify(favMeals));
        showFavList();
    }
}

//show meals present in favourite list
function showFavList(){
    var favMeals = JSON.parse(localStorage.getItem('favMeals')) || [];   
    favList.innerHTML="";
    if(favMeals.length == 0){
        favList.innerHTML = `
            <div>
                <p>No meals in favourites!</p>
                <p>You can click on the favorite icon to add your favourite meals here!</p>
            </div>
        `
    }
    else{
        for(let i=0; i<favMeals.length; i++){
            const mealId = favMeals[i];

            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(res=>res.json())
            .then(data=>{
                const meal = data.meals[0];
                if(meal){
                    favList.innerHTML+=`
                    <div class="card meal" id="meal">
                        <img src=${meal.strMealThumb} class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body meal-body">
                            <a href='javascript:void(0);' onclick="addFavMeals(${meal.idMeal})" scroll="disable" >
                                <i class="fa-regular fa-heart ${isPresent(favMeals, meal.idMeal) ? 'font-wt-600':''}" data-mealId="${meal.idMeal}"></i>
                            </a>
                            <p>${meal.strMeal}</p>
                            <a href="#" id="info-button" onclick="showDetails(${meal.idMeal})">
                                <i class="fa fa-info-circle"></i>
                            </a>
                        </div>
                    </div>
                    `
                }
            });
            localStorage.setItem('favMeals', JSON.stringify(favMeals));
        }
    }
   
}

//show details of the selected meal
function showDetails(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res=>res.json())
    .then(data=>{
        const mealDetails = data.meals[0];
        const ingredients =[];
        for(let i=1;i<=20; i++){
            if(mealDetails[`strIngredient${i}`]){
                ingredients.push(
                    `${mealDetails[`strIngredient${i}`]} - ${mealDetails[`strMeasure${i}`]}`
                );
            }
            else{
                break;
            }
        }
        result.innerHTML="";
        meal.innerHTML="";
        mealInfo.innerHTML = `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${mealDetails.strMealThumb}" class="img-fluid rounded-start" alt="${mealDetails.strMeal}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h3 class="card-title color-brown-font-600">${mealDetails.strMeal}</h3>
                            <a href='javascript:void(0);' onclick="addFavMeals(${mealDetails.idMeal})" scroll="disable" >
                                <i class="fa-regular fa-heart ${isPresent(favMeals, mealDetails.idMeal) ? 'font-wt-600':''}" data-mealId="${mealDetails.idMeal}"></i>
                            </a>
                            <p>
                                <ul>
                                    <li><h5><span class="color-brown-font-600 card-text">Area:</span> ${mealDetails.strArea}</h5></li>
                                    <li><h5><span class="color-brown-font-600 card-text">Category:</span> ${mealDetails.strCategory}</h5></li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row g-0">
                        <div class="">
                            <p>
                                <h5 class="color-brown-font-600">Ingredients:</h5>
                                <p class="card-text"><small class="text-muted">
                                    ${ingredients.map(i=>`${i}`).join(", ")}
                                </small></p>
                            </p>
                            <p>
                                <h5 class="color-brown-font-600">Instructions:</h5>
                                <p class="card-text"><small class="text-muted">
                                    ${mealDetails.strInstructions}
                                </small></p>
                            </p>
                        </div>
                </div>
            </div>
        `
    });
   




}

//adding event listener for submit button
submit.addEventListener("submit", searchMeal) 
