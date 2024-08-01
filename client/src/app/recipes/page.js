'use client';

import { useState, useEffect } from "react";
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';
import GroupRecipes from "../util/GroupRecipes";


const Recipes = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {  
            try {
                const response = await fetch('/api/recipes?img=true');
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
    }, []);

    return (
        <div>
            <NavBar />
            <h1>Recipes</h1>
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
                        />
                    ))
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
        </div>
    );
};

export default Recipes;

