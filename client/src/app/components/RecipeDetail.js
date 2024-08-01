import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import './RecipeDetail.css';

const RecipeDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [recipe, setRecipe] = useState(null);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchRecipeDetails = async () => {
                try {
                    const response = await fetch(`/api/recipe/${id}`);
                    const { data } = await response.json();
                    setRecipe(data[0]); // Assuming data is an array with one element
                } catch (error) {
                    console.error('Error fetching recipe details:', error);
                }
            };

            const fetchRecipeSteps = async () => {
                try {
                    const response = await fetch(`/api/recipe/${id}/steps`);
                    const { data } = await response.json();
                    setSteps(data);
                } catch (error) {
                    console.error('Error fetching recipe steps:', error);
                }
            };

            fetchRecipeDetails();
            fetchRecipeSteps();
        }
    }, [id]);

    if (!recipe) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <NavBar />
            <h1>{recipe[1]}</h1> {/* RecipeName */}
            <p><strong>Cuisine:</strong> {recipe[2]}</p> {/* Cuisine */}
            <p><strong>Cooking Time:</strong> {recipe[3]}</p> {/* CookingTime */}
            <p><strong>Level:</strong> {recipe[4]}</p> {/* RecipeLevel */}
            <p><strong>Created By:</strong> {recipe[5]}</p> {/* UserName */}

            <h2>Steps</h2>
            <ul>
                {steps.map(step => (
                    <li key={step[0]}>{step[1]}</li> // StepNum, InstructionText
                ))}
            </ul>
        </div>
    );
};

export default RecipeDetail;
