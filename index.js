const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");
  
function searchMeal(e) {
  // preventdefault is used to prevent some action
  e.preventDefault();
  single_mealEl.innerHTML = "";
  // 
  const term = search.value;
  console.log(term);
  // remove white space of a string  use trim
  if (term.trim()) {
    // api=>themealdb
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // dishes is found
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
      //  no dishes like our search
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          // pics heading are picked by api inside a class meal
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
              
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}</h3></div>
            </div>`
            )
            .join("");
        }
      });
      // empy our search bar
    search.value = "";
  }
  // if search bar is empty to searach
  else {
    alert("Please enter a search term");
  }
}
// meal id api and details
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
// random dishes fetch
function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
// ingredients
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  // single image name text
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
  
    <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
            ${ingredients.map((i) => `<li>${i}</li>`).join("")}
        </ul>
    </div>
  </div>`;
}
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});