
'use client';

import { useState, useEffect } from "react";
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';
import GroupRecipes from "../util/GroupRecipes";

// Mocked Cuisine Data (This should ideally come from a backend or a utility function)
const cuisineOptions = ['Italian', 'Mexican', 'Chinese', 'Indian', 'American'];

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cuisineFilter, setCuisineFilter] = useState('');
    const [showCaptions, setShowCaptions] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {  
            try {
                // Construct query parameters based on user input
                const params = new URLSearchParams({
                    img: 'true',
                    captionless: showCaptions ? '0' : '1',
                    ...(cuisineFilter && { filter: cuisineFilter }),
                    ...(searchQuery && { id: searchQuery }), // Assuming 'id' is used to filter by name or id
                });

                const response = await fetch(`/api/recipes?${params}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { data } = await response.json();
                setRecipes(GroupRecipes(data));
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [cuisineFilter, searchQuery, showCaptions]); // Dependencies to trigger re-fetch

    return (
        <div>
            <NavBar />
            <div className="container">
                <h1>Recipes</h1>
                <div className="search-filter-bar">
                    <input
                        type="text"
                        placeholder="Search by Recipe Name or ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={cuisineFilter}
                        onChange={(e) => setCuisineFilter(e.target.value)}
                        className="cuisine-select"
                    >
                        <option value="">All Cuisines</option>
                        {cuisineOptions.map((cuisine, index) => (
                            <option key={index} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                    <label className="caption-toggle">
                        <input
                            type="checkbox"
                            checked={showCaptions}
                            onChange={(e) => setShowCaptions(e.target.checked)}
                        />
                        Show Captions
                    </label>
                </div>
                <div className='recipe-grid'>
                    {recipes && recipes.length > 0 ? (
                        recipes.map((recipe, index) => (
                            <RecipeCard
                                key={index}
                                id={recipe.RECIPEID}
                                name={recipe.RECIPENAME}
                                cuisine={recipe.CUISINE}
                                level={recipe.RECIPELEVEL}
                                time={recipe.COOKINGTIME}
                                createdBy={recipe.USERNAME}
                                imageUrl={recipe.IMAGEURL}
                                caption={showCaptions ? recipe.CAPTION : ''}
                            />
                        ))
                    ) : (
                        <p>No recipes found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recipes;


