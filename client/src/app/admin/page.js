'use client'
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import NavBar from '../components/NavBar';

const Admin = () => {
  const [selectedTable, setSelectedTable] = useState('Users'); 
  const [usersData, setUsersData] = useState([]);
  const [userlevelsData, setUserLevelsData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [recipelevelsData, setRecipeLevelData] = useState([]);
  const [recipeslikedData, setRecipesLikedData] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [stepsData, setStepsData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [userlocationsData, setUserLocationsData] = useState([]);
  const [nearbystoresData, setNearbyStoresData] = useState([]);
  const [pantriesData, setPantriesData] = useState([]);
  const [savedPantriesData, setSavedPantriesData] = useState([]);
  const [fooditemsData, setFoodItemsData] = useState([]);
  const [healthyfooditemsData, setHealthyFoodItemsData] = useState([]);
  const [recipefooditemsData, setRecipeFoodItemsData] = useState([]);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [grocerystoresData, setGroceryStoresData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users data
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users data');
        }
        const usersJson = await usersResponse.json();
        const usersData = usersJson.data.map((user) =>
          Object.fromEntries(Object.entries(user).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setUsersData(usersData);

        // Fetch UserLevels data
        const userlevelsResponse = await fetch('/api/userlevels');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch user levels data');
        }
        const userlevelsJson = await userlevelsResponse.json();
        const userlevelsData = userlevelsJson.data.map((userlevels) =>
          Object.fromEntries(Object.entries(userlevels).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setUserLevelsData(userlevelsData);

        // Fetch RecipesCreated data
        const recipesResponse = await fetch('/api/recipes');
        if (!recipesResponse.ok) {
          throw new Error('Failed to fetch recipes data');
        }
        const recipesJson = await recipesResponse.json();
        const recipesData = recipesJson.data.map((recipe) =>
          Object.fromEntries(Object.entries(recipe).map(([key, value]) => [key.toLowerCase(), value]))
        );
        console.log('Recipes data:', recipesData);
        setRecipesData(recipesData);

        // Fetch RecipeLevels
        const recipelevelsResponse = await fetch('/api/recipelevels');
        if (!recipelevelsResponse.ok) {
          throw new Error('Failed to fetch recipes data');
        }
        const recipelevelsJson = await recipelevelsResponse.json();
        const recipelevelsData = recipelevelsJson.data.map((recipelevels) =>
          Object.fromEntries(Object.entries(recipelevels).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setRecipeLevelData(recipelevelsData);        
        
        // Fetch RecipeLiked
        const recipeslikedResponse = await fetch('/api/recipes/liked');
        if (!recipeslikedResponse.ok) {
          throw new Error('Failed to fetch recipes liked data');
        }
        const recipeslikedJson = await recipeslikedResponse.json();
        const recipeslikedData = recipeslikedJson.data.map((recipesliked) =>
          Object.fromEntries(Object.entries(recipesliked).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setRecipesLikedData(recipeslikedData);
        
        // Fetch All images
        const imagesResponse = await fetch('/api/images');
        if (!imagesResponse.ok) {
          throw new Error('Failed to fetch images data');
        }
        const imagesJson = await imagesResponse.json();
        const imagesData = imagesJson.data.map((images) =>
          Object.fromEntries(Object.entries(images).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setImagesData(imagesData);

        // Fetch All steps from all recipes
        const stepsResponse = await fetch('/api/steps');
        if (!stepsResponse.ok) {
          throw new Error('Failed to fetch steps data');
        }
        const stepsJson = await stepsResponse.json();
        const stepsData = stepsJson.data.map((steps) =>
          Object.fromEntries(Object.entries(steps).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setStepsData(stepsData);

        // Fetch All Locations
        const locationsResponse = await fetch('/api/locations');
        if (!locationsResponse.ok) {
          throw new Error('Failed to fetch locations data');
        }
        const locationsJson = await locationsResponse.json();
        const locationsData = locationsJson.data.map((locations) =>
          Object.fromEntries(Object.entries(locations).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setLocationsData(locationsData);

        // Fetch All User Locations
        const userlocationsResponse = await fetch('/api/userlocations');
        if (!userlocationsResponse.ok) {
          throw new Error('Failed to fetch locations data');
        }
        const userlocationsJson = await userlocationsResponse.json();
        const userlocationsData = userlocationsJson.data.map((userlocations) =>
          Object.fromEntries(Object.entries(userlocations).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setUserLocationsData(userlocationsData);
        
        // Fetch All Grocery Stores
        const grocerystoresResponse = await fetch('/api/grocerystores');
        if (!grocerystoresResponse.ok) {
          throw new Error('Failed to fetch grocery stores data');
        }
        const grocerystoresJson = await grocerystoresResponse.json();
        const grocerystoresData = grocerystoresJson.data.map((grocerystores) =>
          Object.fromEntries(Object.entries(grocerystores).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setGroceryStoresData(grocerystoresData);

        // Fetch All Nearby Stores
        const nearbystoresResponse = await fetch('/api/nearbystores');
        if (!nearbystoresResponse.ok) {
          throw new Error('Failed to fetch nearby stores data');
        }
        const nearbystoresJson = await nearbystoresResponse.json();
        const nearbystoresData = nearbystoresJson.data.map((nearbystores) =>
          Object.fromEntries(Object.entries(nearbystores).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setNearbyStoresData(nearbystoresData);
        
        // Fetch All Pantries from All Users data
        const pantriesResponse = await fetch('/api/pantries');
        if (!pantriesResponse.ok) {
          throw new Error('Failed to fetch pantries data');
        }
        const pantriesJson = await pantriesResponse.json();
        const pantriesData = pantriesJson.data.map((pantries) =>
          Object.fromEntries(Object.entries(pantries).map(([key, value]) => [key.toLowerCase(), value]))
        );
        console.log('Pantries data:', pantriesData);
        setPantriesData(pantriesData);

        // Fetch All Saved and Existing Pantries
        const savedPantriesResponse = await fetch('/api/savedpantries');
        if (!savedPantriesResponse.ok) {
          throw new Error('Failed to fetch saved pantries data');
        }
        const savedPantriesJson = await savedPantriesResponse.json();
        const savedPantriesData = savedPantriesJson.data.map((savedPantries) =>
          Object.fromEntries(Object.entries(savedPantries).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setSavedPantriesData(savedPantriesData);

        // Fetch All FoodItems
        const fooditemsResponse = await fetch('/api/fooditems');
        if (!fooditemsResponse.ok) {
          throw new Error('Failed to fetch food items data');
        }
        const fooditemsJson = await fooditemsResponse.json();
        const fooditemsData = fooditemsJson.data.map((fooditems) =>
          Object.fromEntries(Object.entries(fooditems).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setFoodItemsData(fooditemsData);

        // Fetch All Healthy FoodItems
        const healthyfooditemsResponse = await fetch('/api/healthyfooditems');
        if (!healthyfooditemsResponse.ok) {
          throw new Error('Failed to fetch healthy food items data');
        }
        const healthyfooditemsJson = await healthyfooditemsResponse.json();
        const healthyfooditemsData = healthyfooditemsJson.data.map((healthyfooditems) =>
          Object.fromEntries(Object.entries(healthyfooditems).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setHealthyFoodItemsData(healthyfooditemsData);

        // Fetch All Food Items in All recipes
        const recipefooditemsResponse = await fetch('/api/fooditemsinrecipes');
        if (!recipefooditemsResponse.ok) {
          throw new Error('Failed to fetch recipe food items data');
        }
        const recipefooditemsJson = await recipefooditemsResponse.json();
        const recipefooditemsData = recipefooditemsJson.data.map((recipefooditems) =>
          Object.fromEntries(Object.entries(recipefooditems).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setRecipeFoodItemsData(recipefooditemsData);

        // Fetch All Ingredient Instances
        const ingredientsResponse = await fetch('/api/ingredientinstances');
        if (!ingredientsResponse.ok) {
          throw new Error('Failed to fetch ingredient instances data');
        }
        const ingredientsJson = await ingredientsResponse.json();
        const ingredientsData = ingredientsJson.data.map((ingredients) =>
          Object.fromEntries(Object.entries(ingredients).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setIngredientsData(ingredientsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <NavBar />
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="table-select">Select a table: </label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="Users">Users</option>
          <option value="UserLevels">User Levels</option>
          <option value="Recipes Created">Recipes Created</option>
          <option value="RecipesLevels">Recipe Levels</option>
          <option value="RecipesLiked">Recipes Liked</option>
          <option value="Images">Images</option>
          <option value="Steps">Steps</option>
          <option value="Locations">Locations</option>
          <option value="UserLocations">User Locations</option>
          <option value="GroceryStores">Grocery Stores</option>
          <option value="NearbyStores">Nearby Stores</option>
          <option value="UserPantries">User Pantries</option>
          <option value="SavedPantries">Saved Pantries</option>
          <option value="FoodItems">Food Items</option>
          <option value="HealthyFoodItems">Healthy Food Items</option>
          <option value="RecipeFoodItems">Foods In Recipes</option>
          <option value="Ingredients">Ingredients Instances</option>

        </select>
      </div>

      {selectedTable === 'Users' && <Table tableData={usersData} tableName="Users" />}
      {selectedTable === 'UserLevels' && <Table tableData={userlevelsData} tableName="User Levels" />}
      {selectedTable === 'Recipes Created' && <Table tableData={recipesData} tableName="Recipes Created" />}
      {selectedTable === 'RecipesLevels' && <Table tableData={recipelevelsData} tableName="Recipe Levels" />}
      {selectedTable === 'RecipesLiked' && <Table tableData={recipeslikedData} tableName="Recipes Liked" />}
      {selectedTable === 'Images' && <Table tableData={imagesData} tableName="Images" />}
      {selectedTable === 'Steps' && <Table tableData={stepsData} tableName="Steps" />}
      {selectedTable === 'Locations' && <Table tableData={locationsData} tableName="Locations" />}
      {selectedTable === 'UserLocations' && <Table tableData={userlocationsData} tableName="User Locations" />}
      {selectedTable === 'GroceryStores' && <Table tableData={grocerystoresData} tableName="Grocery Stores" />}
      {selectedTable === 'NearbyStores' && <Table tableData={nearbystoresData} tableName="Nearby Stores" />}
      {selectedTable === 'UserPantries' && <Table tableData={pantriesData} tableName="User Pantries" />}
      {selectedTable === 'SavedPantries' && <Table tableData={savedPantriesData} tableName="Saved Pantries" />}
      {selectedTable === 'FoodItems' && <Table tableData={fooditemsData} tableName="Food Items" />}
      {selectedTable === 'HealthyFoodItems' && <Table tableData={healthyfooditemsData} tableName="Healthy Food Items" />}
      {selectedTable === 'RecipeFoodItems' && <Table tableData={recipefooditemsData} tableName="Foods In Recipes" />}
      {selectedTable === 'Ingredients' && <Table tableData={ingredientsData} tableName="Ingredients Instances" />}
    </div>
  );
};

export default Admin;


