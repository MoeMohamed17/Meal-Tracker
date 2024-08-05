'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '../../components/NavBar';

const RecipeDetails = () => {
  const params = useParams();
  const id = params.id;
  const [recipe, setRecipe] = useState(null);
  const [steps, setSteps] = useState([]);
  const [foods, setFoods] = useState([]);


  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`/api/recipe/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }
        const data = await response.json();
        setRecipe(data.data[0]);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    const fetchRecipeSteps = async () => {
      try {
        const response = await fetch(`/api/recipe/${id}/steps`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe steps');
        }
        const data = await response.json();
        setSteps(data.data);
      } catch (error) {
        console.error('Error fetching recipe steps:', error);
      }
    };

    const fetchFoods = async () => {
      try {
        const response = await fetch(`/api/recipe/${id}/fooditems`);
        if (!response.ok) {
          throw new Error('Failed to fetch foods');
        }
        const data = await response.json();
        setFoods(data.data);
        console.log(data.data)
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    if (id) {
      fetchRecipeDetails();
      fetchRecipeSteps();
      fetchFoods();
    }
  }, [id]);


  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <h1>{recipe[1]}</h1> 
      <p><strong>Cuisine:</strong> {recipe[2]}</p> 
      <p><strong>Cooking Time:</strong> {recipe[3]}</p> 
      <p><strong>Created By:</strong> {recipe[5]}</p> 

      <div className="recipe-steps">
        <h2>Steps</h2>
        <ol>
          {steps.map((step, index) => (
            <li key={index}>{step[1]}</li> 
          ))}
        </ol>
      </div>

      <div className="recipe-steps">
        <h2>Ingredients</h2>
        <ol>
          {foods.map((fooditem, index) => (
            <li key={index}>{`${fooditem.QUANTITY}x ${fooditem.FOODNAME}`}</li> 
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetails;

