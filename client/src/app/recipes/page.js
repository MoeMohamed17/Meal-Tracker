'use client';

//LIST OF ALL RECIPES PAGE
import { useState, useEffect } from "react";
import "./Recipes.css";
import Recipe from '../components/RecipeCard';
import NavBar from '../components/NavBar';
import GroupRecipes from "../util/GroupRecipes";


const Recipes = () => {

    const [recipes, setRecipes] = useState([]);

    // useEffect(() => {
    //     const fetchRecipes = async () => {
    //         try {
    //             const response = await fetch('api/recipes');
    //             const data = await response.json(); 
    //             setRecipes(data);
    //         } catch (error) {
    //             console.error('Error fetching recipes:', error);
    //         }
    //     }

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
        }


        fetchRecipes();
    }, []);

    return (
        <div>
            <NavBar />
            <h1>Recipes</h1>
            <div className='recipe-grid'>
                {recipes && recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                        <Recipe
                            // key={recipe.RECIPEID}
                            name={recipe.RECIPENAME}
                            cuisine={recipe.CUISINE}
                            time={recipe.COOKINGTIME}
                            level={recipe.RECIPELEVEL}
                            createdBy={recipe.USERNAME}
                            // image={recipe.IMAGEURL} note that image is an array 
                        />
                    ))
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
        </div>
    )
}

export default Recipes;