

// // LIST OF ALL RECIPES PAGE
// import { useState, useEffect } from "react";
// import "./Recipes.css";
// import Recipe from '../components/RecipeCard';
// import NavBar from '../components/NavBar';

// const Recipes = () => {
//     const [recipes, setRecipes] = useState([]);

//     useEffect(() => {
//         const fetchRecipes = async () => {
//             try {
//                 const response = await fetch('/api/recipes');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const { data } = await response.json();
//                 setRecipes(Array.isArray(data) ? data : []); // Ensure data is an array
//             } catch (error) {
//                 console.error('Error fetching recipes:', error);
//             }
//         };

//         fetchRecipes();
//     }, []);

//     return (
//         <div>
//             <NavBar />
//             <h1>Recipes</h1>
//             <div className='recipe-grid'>
//                 {recipes && recipes.length > 0 ? (
//                     recipes.map((recipe, index) => (
//                         <Recipe
//                             key={index}
//                             name={recipe[1]}      // RecipeName
//                             cuisine={recipe[2]}   // Cuisine
//                             time={recipe[3]}      // CookingTime
//                             level={recipe[4]}     // RecipeLevel
//                             createdBy={recipe[5]} // CreatedBy
//                         />
//                     ))
//                 ) : (
//                     <p>No recipes found.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Recipes;


'use client';

import { useState, useEffect } from "react";
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';
import './Recipes.css';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/api/recipes');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { data } = await response.json();
                setRecipes(Array.isArray(data) ? data : []); // Ensure data is an array
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
                            id={recipe[0]} // RecipeID
                            name={recipe[1]}      // RecipeName
                            cuisine={recipe[2]}   // Cuisine
                            time={recipe[3]}      // CookingTime
                            level={recipe[4]}     // RecipeLevel
                            createdBy={recipe[5]} // CreatedBy
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

