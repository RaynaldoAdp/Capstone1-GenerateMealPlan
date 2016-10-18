var resultsTemplate = '<h2></h2>';

var bmrResult = 0;

var recipeIndex = 1;

function bmrCalculatorForMale(){
  var age = parseInt($('#Age').val());
  var height = parseInt($('#Height').val());
  var weight = parseInt($('#Weight').val());
  bmrResult = 66 + 13.7 * weight + 5 * height - 6.8 * age;
}

function bmrCalculatorForFemale(){
  var age = parseInt($('#Age').val());
  var height = parseInt($('#Height').val());
  var weight = parseInt($('#Weight').val());
  bmrResult = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
}


function renderBmrResult(resultstemplate){
  var renderedBmrResult = $(resultsTemplate).text('Your BMR is ' + bmrResult +'!');
  $('.bmrCalculatorResults').html(renderedBmrResult);
}

function render(){
  if($('.Gender').val() === 'Male') {
    bmrCalculatorForMale();
  }
  else{
    bmrCalculatorForFemale(bmrResult);
  }
  renderBmrResult(resultsTemplate, bmrResult);
}

$(document).ready(function(){
  $('.bmrCalculatorForm').submit(function(){
    event.preventDefault();
    render();
    renderRecipe(bmrResult);
    removeHidden();
    scroll();
  })
})



// Requesting from API

var spoonacularUrl = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate';


function getDataFromApi(caloriesPerDay, callback) {
  var settings = {
    url: spoonacularUrl,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-Mashape-Key', 'k5WAlgf0pnmshreZ5sTP5BMWeU90p1gm2eVjsnUAfcgsE5MzCZ');
    },
    data: {
      targetCalories: caloriesPerDay,
      timeFrame: 'day',
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
  };
  $.ajax(settings);
}



function displayData(data) {
  var resultElement = '<div class ="js-resultInfo resultInfo" id="'+ String(recipeIndex) +'">' +
                        '<div class = "nutritionInfo">' +
                          '<h3>Total amount of calories: '+ data.nutrients.calories +' g</h3>'+
                          '<h3>Total amount of protein: '+ data.nutrients.protein +' g</h3>'+
                          '<h3>Total amount of fat: '+ data.nutrients.fat +' g</h3>'+
                          '<h3>Total amount of carbohydrates: '+ data.nutrients.carbohydrates +' g</h3><br>'+
                          '<h3>These are the meals (click on image to get full information about the meal)</h3><br><br><br>'+
                        '</div>'                    
  if (data.meals) {
    data.meals.forEach(function(item, index) {
      if(index === 0){  
        resultElement += '<div class ="recipes">' +
                           '<h3> Meal for Breakfast </h3>' +
                           '<p>' + item.title + '</p>' + 
                           '<a href=" https://spoonacular.com/recipes/'+ item.title + '-' + item.id + '"><img src="https://webknox.com/recipeImages/'+ item.id +'-556x370.jpg"></a>' +
                          '</div>';             
      }
      else if(index === 1){  
        resultElement += '<div class ="recipes">' +
                           '<h3> Meal for Lunch </h3>' +
                           '<p>' + item.title + '</p>' + 
                           '<a href=" https://spoonacular.com/recipes/'+ item.title + '-' + item.id + '"><img src="https://webknox.com/recipeImages/'+ item.id +'-556x370.jpg"></a>' +
                         '</div>';
      }
      else{  
        resultElement += '<div class ="recipes">' +
                           '<h3> Meal for Dinner </h3>' +
                           '<p>' + item.title + '</p>' + 
                           '<a href=" https://spoonacular.com/recipes/'+ item.title + '-' + item.id + '"><img src="https://webknox.com/recipeImages/'+ item.id +'-556x370.jpg"></a>' +
                         '</div>';

      }
    });
  }
  else {
    resultElement += '<p>No results</p>';
  }
  resultElement +=    '<input type="button" class="js-generateMoreButton generateMoreButton" value="Not Satisfied with these recipes? Fret not. Generate more recipes by clicking me!">' +
                   '</div>' 
  $('.js-recipeContainer').append(resultElement);
  generateMoreRecipe();
  scrollToNewElement();
}


function renderRecipe(bmrResult) {
    getDataFromApi(bmrResult, displayData);
  }


function generateMoreRecipe() {
    $('.js-generateMoreButton').click(function(){
        $(this).addClass('hidden');
        recipeIndex += 1;
        renderRecipe(bmrResult);
        
    })
}


//aesthetics
function scroll(){
    $('html, body').animate({
        scrollTop: $("#recipeContainer").offset().top
    }, 2000);
}

function removeHidden(){
    $('.js-recipeContainer').removeClass('hidden')
}

function scrollToNewElement(){
    var index = "#" + String(recipeIndex);
    $('html, body').animate({
        scrollTop: $(index).offset().top
    }, 2000);
}

