'use client';

import { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, Title, Group, Select, Text } from '@mantine/core';
import styles from '../newrecipes/newrecipes.css';

const RecipeForm = () => {
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState('');
    const [steps, setSteps] = useState(['']);
    const [userID, setUserID] = useState(null);
    const [newRecipeSuccess, setNewRecipeSuccess] = useState('');

    useEffect(() => {
        // Retrieve the UserID from local storage when the component mounts
        const storedUserID = localStorage.getItem('selectedUser');
        setUserID(storedUserID);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure userID is available
        if (!userID) {
            console.error('No user ID available. Please log in.');
            return;
        }

        // Construct the new recipe data
        const newRecipe = { 
            RecipeName: name, 
            Cuisine: cuisine, 
            CookingTime: time, 
            UserID: userID 
        };

        try {
            // Send the new recipe to the server
            const response = await fetch('/api/recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRecipe)
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Recipe created:', result);

                // Optionally, add steps after creating the recipe
                if (steps.length > 0) {
                    const recipeID = result.response.RecipeID;
                    await addStepsToRecipe(recipeID, steps);
                }

                // Add image with a default caption
                if (image) {
                    const defaultCaption = `Image of ${name}`;
                    await addImageToRecipe(result.response.RecipeID, image, defaultCaption);
                }

                // Reset form fields
                setName('');
                setCuisine('');
                setTime('');
                setImage('');
                setSteps(['']);

                setNewRecipeSuccess('Success!');

            } else {
                console.error('Error creating recipe:', result.error);
            }

        } catch (error) {
            console.error('Error adding recipe:', error);
            setNewRecipeSuccess('');
        }
    };

    // Function to add steps to the created recipe
    const addStepsToRecipe = async (recipeID, steps) => {
        try {
            const response = await fetch(`/api/steps/${recipeID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ steps })
            });

            if (!response.ok) {
                console.error('Failed to add steps:', await response.json());
            }
        } catch (error) {
            console.error('Error adding steps:', error);
        }
    };

    // Function to add image to the recipe
    const addImageToRecipe = async (recipeID, imageURL, caption) => {
        try {
            const response = await fetch('/api/images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ recipeID, imageURL, caption })
            });

            if (!response.ok) {
                console.error('Failed to add image:', await response.json());
            }
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const handleAddStep = () => {
        setSteps([...steps, '']);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="recipe-form">
                <Title order={3}>Add a New Recipe</Title>
                <TextInput
                    label="Recipe Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Select
                    label="Cuisine"
                    value={cuisine}
                    onChange={(value) => setCuisine(value)}
                    data={[
                        'Brazilian',
                        'Chinese',
                        'Ethiopian',
                        'French',
                        'Greek',
                        'Indian',
                        'Italian',
                        'Japanese',
                        'Lebanese',
                        'Mexican',
                        'Thai',
                    ]}
                    required
                />
                <TextInput
                    label="Cooking Time (HH MM:SS)"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
                <TextInput
                    label="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                />
                <h2 className="steps">Steps</h2>
                {steps.map((step, index) => (
                    <Textarea
                        key={index}
                        label={`Step ${index + 1}`}
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        required
                    />
                ))}
                <Button type="button" onClick={handleAddStep} className="add-step-button" size="md">
                    Add Step
                </Button>
                <Button type="submit" size="lg" className="add-recipe-button">
                    Add Recipe
                </Button>
                <Text c="green">{newRecipeSuccess}</Text>
            </form>
        </div>
    );
}

export default RecipeForm;


