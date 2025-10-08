const API_URL = "https://dummyjson.com/recipes";
let allRecipes = [];
let displayedCount = 0;
const RECIPES_PER_PAGE = 9;

const recipesGrid = document.getElementById("recipesGrid");
const loadingState = document.getElementById("loadingState");
const errorMessage = document.getElementById("errorMessage");
const noResults = document.getElementById("noResults");
const recipeCount = document.getElementById("recipeCount");
const showMoreContainer = document.getElementById("showMoreContainer");
const showMoreBtn = document.getElementById("showMoreBtn");
const searchInput = document.getElementById("searchInput");
const cuisineFilter = document.getElementById("cuisineFilter");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

async function fetchRecipes() {
  try {
    loadingState.style.display = "flex";
    errorMessage.style.display = "none";
    const response = await fetch(API_URL);
    const data = await response.json();
    allRecipes = data.recipes;
    displayedCount = 0;
    renderRecipes();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    errorMessage.style.display = "block";
  } finally {
    loadingState.style.display = "none";
  }
}

function renderRecipes(filtered = null) {
  const recipes = filtered || allRecipes;
  recipesGrid.innerHTML = "";

  if (recipes.length === 0) {
    noResults.style.display = "block";
    recipeCount.textContent = `Showing 0 of ${allRecipes.length} recipes`;
    showMoreContainer.style.display = "none";
    return;
  } else {
    noResults.style.display = "none";
  }

  const recipesToShow = recipes.slice(0, displayedCount + RECIPES_PER_PAGE);
  displayedCount = recipesToShow.length;

  recipesToShow.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.dataset.id = recipe.id;
    card.style.cursor = "pointer";
    card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.name}</h3>
                <p class="recipe-meta"> ${recipe.prepTimeMinutes} mins • ${recipe.cuisine} • ${recipe.difficulty}</p>
                <p class="recipe-rating">⭐ ${recipe.rating} (${recipe.reviewCount} reviews)</p>
                <p class="recipe-ingredients">
                <strong>Ingredients:</strong> 
                ${recipe.ingredients.slice(0, 3).join(", ")} +${Math.max(recipe.ingredients.length - 3, 0)} more
                </p>
                <button class="btn-view-recipe" data-id="${recipe.id}">View Details</button>
            </div>
        `;
    recipesGrid.appendChild(card);
  });


  recipeCount.textContent = `Showing ${displayedCount} of ${recipes.length} recipes`;
  showMoreContainer.style.display =
    recipes.length > displayedCount ? "block" : "none";
}

function filterRecipes() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCuisine = cuisineFilter.value;

  const filtered = allRecipes.filter((recipe) => {
    const searchableText = `
      ${recipe.name}
      ${recipe.cuisine}
      ${recipe.ingredients.join(" ")}
      ${(recipe.tags || []).join(" ")}
    `.toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesCuisine = selectedCuisine
      ? recipe.cuisine === selectedCuisine
      : true;

    return matchesSearch && matchesCuisine;
  });

  displayedCount = 0;
  renderRecipes(filtered);
}


function openModal(recipeId) {
  const recipe = allRecipes.find((r) => r.id == recipeId);
  if (!recipe) return;

  modalTitle.textContent = recipe.name;
  modalContent.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="modal-image">
        <div class="modal-info-grid">
            <div class="info-item">
                <div class="info-label">Cuisine</div>
                <div class="info-value">${recipe.cuisine}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Difficulty</div>
                <div class="info-value">${recipe.difficulty}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Prep Time</div>
                <div class="info-value">${recipe.prepTimeMinutes} min</div>
            </div>
            <div class="info-item">
                <div class="info-label">Cook Time</div>
                <div class="info-value">${recipe.cookTimeMinutes} min</div>
            </div>
            <div class="info-item">
                <div class="info-label">Servings</div>
                <div class="info-value">${recipe.servings}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Calories</div>
                <div class="info-value">${
                  recipe.caloriesPerServing
                } per serving</div>
            </div>
        </div>
        <div class="modal-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list-full">
                ${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}
            </ul>
        </div>
        <div class="modal-section">
            <h3>Instructions</h3>
            <ol class="instructions-list">
                ${recipe.instructions
                  .map((step) => `<li>${step}</li>`)
                  .join("")}
            </ol>
        </div>
    `;
  modalOverlay.style.display = "flex";
}

showMoreBtn.addEventListener("click", () => {
  renderRecipes();
});

modalClose.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});

recipesGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-view-recipe")) {
    openModal(e.target.dataset.id);
    return;
  }
  const card = e.target.closest(".recipe-card");
  if (card && card.dataset.id) {
    openModal(card.dataset.id);
  }
});

searchInput.addEventListener("input", filterRecipes);
cuisineFilter.addEventListener("change", filterRecipes);

fetchRecipes();
