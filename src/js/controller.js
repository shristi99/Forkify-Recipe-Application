import { func } from 'assert-plus';
import icons from 'url:../img/icons.svg'
import 'core-js/stable';
import 'regenerator-runtime/runtime'

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import { async } from 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const recipeContainer = document.querySelector('.recipe');


const controlRecipes=async function(){
  try{
    //  recipeView.renderSpinner();
    const id=window.location.hash.slice(1);
    
    if(!id) return;

    // recipeView.renderSpinner();
   
    //1) Update results view to mark selected search result
    // resultsView.update(model.getSearchResultsPage());

    //2) Loading Recipe
    await model.loadRecipe(id);
    // const {recipe}=model.state;

//3) Rendering Recipe
recipeView.render(model.state.recipe);


  }catch(err){
  
    recipeView.renderError();
    
  }
};

const controlSearchResults=async function(){

  try{
    // resultsView.renderSpinner();
    //1)got search query
    const query=searchView.getQuery();
    if(!query) return;
    //2)load search results
  await model.loadSearchResults(query);

  //3)render results
  // console.log(model.state.search.results);
  resultsView.render(model.getSearchResultsPage());

  //render the initiaal pagination view
  paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
};

//changing the results
const controlPagination =function(goTo){
  resultsView.render(model.getSearchResultsPage(goTo));
 
  paginationView.render(model.state.search);
};

const controlServings=function(newServings){
   //update the recipe servings (in state)
   model.updateServings(newServings);

   //update the view recipe well
   recipeView.render(model.state.recipe);

};

const controlAddBookmark=function(){
  //1) add or rmove a bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);
  //2)update the recipe view
  recipeView.update(model.state.recipe);
  //3)render bookmarks
  bookmarksView.render(model.state.bookmarks);

};

// window.addEventListener('hashchange',controlRecipes);
// window.addEventListener('load',controlRecipes);
const init=function(){
 recipeView.addHandlerRender(controlRecipes);
 recipeView.addHandlerUpdateServings(controlServings);
 recipeView.addHandlerAddBookmark(controlAddBookmark);
 SearchView.addHandlerSearch(controlSearchResults);
 paginationView.addHandlerClick(controlPagination);

};

init();