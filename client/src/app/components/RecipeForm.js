'use client';
import { useState } from 'react'
import { Button, TextInput, Textarea } from '@mantine/core';
import styles from "../newrecipes/newrecipes.css";


//whos going to set the level in this case? the user? or we need
// to come up with a system that assigns a level to all incoming new recipes
// for images are we letting them just one image at first, then they can add more later?
const RecipeForm = () => {
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState('');
    const [steps, setSteps] = useState(['']);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRecipe = { name, cuisine, time, image, steps };

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(newRecipe)
            });

            const result = await response.json();
            console.log(result);

            setName('');
            setCuisine('');
            setTime('');
            setImage('');
            setSteps(['']);

        } catch (error) {
            console.error('error adding recipe:', error)
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
            <TextInput
              label="Recipe Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextInput
              label="Cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              required
            />
            <TextInput
              label="Time"
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
            <h2 className='steps'>Steps</h2>
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
          </form>
        </div>
      );

}

export default RecipeForm;