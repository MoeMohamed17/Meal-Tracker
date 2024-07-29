'use client';

//LIST OF ALL RECIPES PAGE
import { useState, useEffect } from "react";
import "./Recipes.css";
import Recipe from '../components/RecipeCard';
import NavBar from '../components/NavBar';


const Recipes = () => {

    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('api/recipes');
                const data = await response.json(); 
                setRecipes(data);
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
                {recipes.map((recipe, index) => (
                    <Recipe
                        key={index}
                        name={recipe.name}
                        cuisine={recipe.cuisine}
                        level={recipe.level}
                        time={recipe.time}
                        image={recipe.image}
                    />
                ))}
            </div>
        </div>
    )
}

export default Recipes