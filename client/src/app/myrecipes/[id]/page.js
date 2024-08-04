'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { useParams } from 'next/navigation';
import '../MyRecipes.css';
import GroupRecipes from '@/app/util/GroupRecipes';
import { TextInput, Textarea, Select, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from "next/navigation";
import Link from 'next/link';


const EditRecipe = () => {
  const params = useParams();
  const id = params.id;
  const selectedUser = localStorage.getItem('selectedUser');
  const [recipe, setRecipe] = useState({});
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [steps, setSteps] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch('/api/cuisines');
        const data = await response.json();
        setCuisineOptions(data.data);
      } catch (error) {
        console.error('Error fetching cuisine options:', error);
      }
    };
    fetchCuisines();
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {  
        try {
            const response = await fetch(`/api/recipes?id=${id}&img=true`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const { data } = await response.json();
            setRecipe(GroupRecipes(data)[0]);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
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
    fetchRecipeSteps();
  }, [id]);

  const form = useForm({
    initialValues: {
      name: '',
      cuisine: '',
      time: '',
      image: '',
      steps: ''
    }
  });

  const handleSubmit = async (values) => {
    const updatedRecipe = {}
    const updatedImages = {}
    const updatedSteps = {}
    if (values.name && values.name !== recipe.RECIPENAME) {
      updatedRecipe.RecipeName = values.name;
    }
    if (values.cuisine && values.cuisine !== recipe.CUISINE) {
      updatedRecipe.Cuisine = values.cuisine;
    }
    if (values.time && values.time !== recipe.COOKINGTIME) {
      updatedRecipe.CookingTime = values.time;
    }
    if (values.user && values.user.split('.')[1].replace(/\s/g, '') !== recipe.USERNAME) {
      updatedRecipe.UserID = values.user.split('.')[0];
    }
    if (values.url && values.url !== recipe.IMAGEURL.join('\n')) {
      updatedImages.ImageURL = values.url.split('\n');
    }
    if (values.caption && values.caption !== recipe.CAPTION.join('\n')) {
      updatedImages.Caption = values.caption. split('\n');
    }
    if (values.steps && values.steps !== steps.map(step => `${step[1]}`).join('\n')) {
      updatedRecipe.InstructionText = values.steps.split('\n');
    }

    console.log(updatedRecipe);
    console.log(updatedImages);
    console.log(updatedSteps);
    
    // try {
    //   const response = await fetch('/api/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({})
    //   })
    // }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/recipe/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  }

  return (
    <div>
      <NavBar/>
      <div style={{paddingLeft:'20px', paddingTop:'20px', width:'50%'}}>
        <div>
          {'RecipeID: ' + recipe.RECIPEID}
        </div>
        <br></br>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Recipe Name"
            placeholder={recipe.RECIPENAME}
            {...form.getInputProps('name')}
          />
          <br></br>

          <Select
            label='Cuisine'
            placeholder={recipe.CUISINE}
            data={cuisineOptions}
            {...form.getInputProps('cuisine')}
          />
          <br></br>

          <TextInput
            label="Time to prepare"
            placeholder={recipe.COOKINGTIME}
            {...form.getInputProps('time')}
          />
          <br></br>

          <Select
            label='Change author'
            data={users.map(user => `${user[0]}. ${user[1]}`)}
            {...form.getInputProps('user')}
          />
          <br></br>

          <Textarea
            label='Image URLs'
            placeholder={recipe.IMAGEURL ? recipe.IMAGEURL.join('\n') : ''}
            {...form.getInputProps('url')}
          />
          <br></br>

          <Textarea
            label='Image captions'
            placeholder={recipe.CAPTION ? recipe.CAPTION.join('\n') : ''}
            {...form.getInputProps('caption')}
          />
          <br></br>

          <Textarea
            label='Steps'
            placeholder={steps.map(step => `${step[1]}`).join('\n')}
            {...form.getInputProps('steps')}
          />
          <br></br>

          <Button type="submit">Submit</Button>
        </form>
        <br></br>
        <Link href='/myrecipes' passHref>
          <Button onClick={handleDelete} color='red'>Delete</Button>
        </Link>
      </div>
    </div>
  );
};

export default EditRecipe;
