'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { useParams } from 'next/navigation';
import '../MyRecipes.css';
import GroupRecipes from '@/app/util/GroupRecipes';
import { TextInput, Textarea, Select, Button, Text } from '@mantine/core';
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
  const [editRecipeSuccess, setEditRecipeSuccess] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

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

  const validateTimeFormat = (time) => {
    const regex = /^\d (?:[01]?\d|2[0-3]):[0-5]\d$/;
    return regex.test(time);
  };


  const handleSubmit = async (values) => {
    form.setFieldError('url', '');
    form.setFieldError('caption', '');
    form.setFieldError('time', '')

    const updatedRecipe = {
      RecipeName: values.name || recipe.RECIPENAME,
      Cuisine: values.cuisine || recipe.CUISINE,
      CookingTime: values.time || recipe.COOKINGTIME,
      UserID: (values.user && values.user.split('.')[1].trim() !== recipe.USERNAME) ? values.user.split('.')[0] : recipe.USERID,
      InstructionText: values.steps ? values.steps.split('\n') : steps.map(step => `${step[1]}`)
    };
  
    if (!validateTimeFormat(updatedRecipe.CookingTime)) {
      form.setFieldError('time', 'Must take the format D HH:MM.');
      return;
    }
  
    const updatedImages = {
      ImageURL: values.url ? values.url.split('\n') : recipe.IMAGEURL,
      Caption: values.caption ? values.caption.split('\n') : recipe.CAPTION
    };

    if (updatedImages.ImageURL.length !== updatedImages.Caption.length) {
      form.setFieldError('url', 'Number of image URLs must match number of captions.');
      form.setFieldError('caption', 'Number of image URLs must match number of captions.');
      return;
    }

    const updatedSteps = values.steps && values.steps !== steps.map(step => `${step[1]}`).join('\n') ? { steps: values.steps.split('\n') } : { steps: steps.map((step) => step[1])};
    
    try {
      const response = await fetch(`/api/recipe/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRecipe)
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }
    } catch (error) {
      console.log("Failed to update");
      setError(error);
      return;
    }

    try {
      const response = await fetch(`/api/steps/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }});

      if (!response.ok) {
        throw new Error('Failed to delete steps');
      }
    } catch (error) {
      console.log("Failed to delete steps");
      setError(error);
      return;
    }

    try {
      const response = await fetch(`/api/steps/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSteps)
      });

      if (!response.ok) {
        throw new Error('Failed to add new steps');
      }
    } catch (error) {
      console.log("Failed to add new steps");
      setError(error);
      return;
    }

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }});

      if (!response.ok) {
        throw new Error('Failed to delete images');
      }
    } catch (error) {
      console.log("Failed to delete images");
      setError(error);
      return;
    }

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedImages)
      });

      if (!response.ok) {
        throw new Error('Failed to add new images');
      }
    } catch (error) {
      console.log("Failed to add new images");
      setError(error);
      return;
    }

    setEditRecipeSuccess('Success!');

    setTimeout(() => {
      router.push('/myrecipes');
    }, 1000);
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
      setDeleteSuccess('Success!');
      setTimeout(() => {
        router.push('/myrecipes');
      }, 1000);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setDeleteSuccess('');
    }
  }

  return (
    <div>
      <NavBar/>
      <div style={{paddingLeft:'20px', paddingTop:'20px', width:'50%'}}>
          <div>
            {'RecipeID: ' + recipe.RECIPEID}
            <br/>
            {'Any fields left blank will default to their existing values.'}
          </div>
        <br/>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Recipe Name"
            placeholder={recipe.RECIPENAME}
            {...form.getInputProps('name')}
          />
          <br/>

          <Select
            label='Cuisine'
            placeholder={recipe.CUISINE}
            data={cuisineOptions}
            {...form.getInputProps('cuisine')}
          />
          <br/>

          <TextInput
            label="Time to prepare"
            placeholder={recipe.COOKINGTIME}
            error={form.errors.time}
            {...form.getInputProps('time')}
          />
          <br/>

          <Select
            label='Change author'
            data={users.map(user => `${user.USERID}. ${user.USERNAME}`)}
            {...form.getInputProps('user')}
          />
          <br/>

          <Textarea
            label='Image URLs'
            placeholder={recipe.IMAGEURL ? recipe.IMAGEURL.join('\n') : ''}
            error={form.errors.caption}
            {...form.getInputProps('url')}
          />
          <br/>

          <Textarea
            label='Image captions'
            placeholder={recipe.CAPTION ? recipe.CAPTION.join('\n') : ''}
            error={form.errors.caption}
            {...form.getInputProps('caption')}
          />
          <br/>

          <Textarea
            label='Steps'
            placeholder={steps.map(step => `${step[1]}`).join('\n')}
            {...form.getInputProps('steps')}
          />
          <br/>
          <Text c="green">{editRecipeSuccess}</Text>
          <Button type="submit">Submit</Button>
        </form>

        <br/>
        <Text c="green">{deleteSuccess}</Text>
        <Button onClick={handleDelete} color='red'>Delete</Button>
        
      </div>
    </div>
  );
};

export default EditRecipe;