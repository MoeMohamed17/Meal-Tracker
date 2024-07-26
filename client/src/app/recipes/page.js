'use client';

//LIST OF ALL RECIPES PAGE
import { useState, useEffect } from "react";
import "./Recipes.css";
import Recipe from '../components/Recipe';

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
            <h1>Recipes</h1>
            <Recipe />
        </div>

    )


}

export default Recipes