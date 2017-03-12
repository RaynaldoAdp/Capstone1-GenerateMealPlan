//Global variables
var bmrResult = 0;
var recipeIndex = 1;
var newIndicator = false; //indicates whether a new search(with different parameters) are made from the top page.

/*
function to register the input by user and return it to NUM array
*/
function getEnteredFormData() {
  return [parseInt($('#Age').val()), parseInt($('#Height').val()), parseInt($('#Weight').val())];
}

/**
function to calculate the daily caloric need of the user
argument passed in is boolean(male === true/false)
if male use formula for male
if not male(female) use formuia for female
*/
function bmrCalculator(male){
  var formData = getEnteredFormData();
  var age = formData[0];
  var height = formData[1];
  var weight = formData[2];
  if (male) {
    bmrResult = (66 + 13.7 * weight + 5 * height - 6.8 * age) * 1.5;
  } else {
    bmrResult = (655 + 9.6 * weight + 1.8 * height - 4.7 * age) *1.5;
  }
}


//function to register the gender of user and run bmrCalculator accordingly
function getGender(){
  if($('.Gender').val() === 'Male') {
    bmrCalculator(true);
  }
  else{
    bmrCalculator(false);
  }
}

// Requesting from API + Callback
var spoonacularUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate';

function getDataFromApi(callback) {
  var settings = {
    url: spoonacularUrl,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-Mashape-Key', 'k5WAlgf0pnmshreZ5sTP5BMWeU90p1gm2eVjsnUAfcgsE5MzCZ');
    },
    data: {
      targetCalories: bmrResult,
      timeFrame: 'day',
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
  };
  $.ajax(settings);
}

/**
callback function for API request
render the page if the request is a success
*/
function displayData(data) {
  var resultElement = '<div class ="js-resultInfo resultInfo row" id="'+ String(recipeIndex) +'">' +
                        '<div class ="col-12">'+
                          '<div class = "nutritionInfo">' +
                            '<h4>Total amount of calories: '+ data.nutrients.calories +' kcal</h4>'+
                            '<h4>Total amount of protein: '+ data.nutrients.protein +' g</h4>'+
                            '<h4>Total amount of fat: '+ data.nutrients.fat +' g</h4>'+
                            '<h4>Total amount of carbohydrates: '+ data.nutrients.carbohydrates +' g</h4>'+
                            '<h4>These are the meals (click on image to get full information about the meal)</h4><br>'+
                          '</div>'
  if (data.meals) {
    var mealType;
    data.meals.forEach(function(item, index) {
      mealType = index === 0 ? "Breakfast" : (index === 1 ? "Lunch" : "Dinner");
      resultElement += '<div class ="recipes col-4">'
      + '<h3> Meal for ' +  mealType + '</h3>'
      + '<p>' + item.title + '</p>'
      + '<a href=" https://spoonacular.com/recipes/'+ item.title + '-' + item.id + '"><img src="https://webknox.com/recipeImages/'+ item.id +'-556x370.jpg"></a>'
      + '</div>';
    });
  }
  else {
    resultElement += '<p>No results</p>';
  }
  resultElement += '<div class ="generateMore">'+
                      '<p>Not Satisfied with these recipes?Fret not. Generate more recipes by clicking the button below!</p>' +
                      '<input type="button" class="js-generateMoreButton generateMoreButton" value="Give me more!">' +
                      '</div>' +
                   '</div>' +
                  '</div>'+
                  '<footer class="js-footer"> <a href="https://github.com/RaynaldoAdp"><img src="images/github.png"></a> </footer>';
  $('.js-recipeContainer').append(resultElement);
  generateMoreRecipe();
  scrollToNewElement();
}

function renderRecipe() {
    getDataFromApi(displayData);
  }

/**
function to generate more recipe by making a new request when button is clicked
Hides the button and footer afterwards as new button and footer will be rendered in the newest page
*/
function generateMoreRecipe() {
    $('.js-generateMoreButton').click(function(){
        $(this).closest("div").addClass('hidden');
        $(".js-footer").addClass('hidden');
        recipeIndex += 1;
        renderRecipe();
    })
}

//function to scroll to the new page that is rendered
function scrollToNewElement(){
    var index = "#" + String(recipeIndex);
    $('html, body').animate({
        scrollTop: $(index).offset().top
    }, 2000);
}

//function to check whether new results are requested(with new parameters)
function checkNewParametersRequest(){
  if(newIndicator){
    $(".js-recipeContainer").empty();
    newIndicator = false;
  }
}

//Run functions
$(document).ready(function(){
  $(".bmrCalculatorForm").submit(function(event){
    event.preventDefault();
    newIndicator = true;
    checkNewParametersRequest();
    $(".js-footer").addClass('hidden');
    getGender();
    renderRecipe();
  })
})
