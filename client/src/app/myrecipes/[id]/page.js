'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { useParams } from 'next/navigation';
import '../MyRecipes.css';
import GroupRecipes from '@/app/util/GroupRecipes';
import { TextInput, Textarea, Select, Button } from '@mantine/core';


const EditRecipe = () => {
  const params = useParams();
  const id = params.id;
  const selectedUser = localStorage.getItem('selectedUser');
  const [recipe, setRecipe] = useState({});
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [steps, setSteps] = useState([]);
  const [foods, setFoods] = useState([]);

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
  }, [])

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
    const fetchRecipes = async () => {  
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
  
    fetchRecipes();
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
  }, []);

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
  }, []);

  useEffect(() => {
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

    fetchFoods();
  }, []);

  




  return (
    <div>
      <NavBar/>

      <div style={{paddingLeft:'20px', paddingTop:'20px', width:'50%'}}>
        <div>
          {'RecipeID: ' + recipe.RECIPEID}
        </div>
        <br></br>

        <TextInput
          description="Name of the recipe"
          placeholder={recipe.RECIPENAME}
        />
        <br></br>

        <Select
          label='Cuisine'
          placeholder={recipe.CUISINE}
          data={cuisineOptions}
        />
        <br></br>

        <TextInput
          label="Time to prepare"
          placeholder={recipe.COOKINGTIME}
        />
        <br></br>

        <div>
          {'Recipe level: ' + recipe.RECIPELEVEL}
        </div>
        <br></br>

        <div>
          {'Author: ' + recipe.USERNAME}
        </div>
        <br></br>

        <Select
          label='Change author'
          data={users.map(user => `${user[0]}. ${user[1]}`)}
        />
        <br></br>

        <Textarea
          label='Image URLs'
          placeholder={recipe.IMAGEURL ? recipe.IMAGEURL.join(',') : ''}
        />
        <br></br>

        <Textarea
          label='Image captions'
          placeholder={recipe.IMAGEURL ? recipe.CAPTION.join(',') : ''}
        />
        <br></br>

        <Textarea
          label='Steps'
          placeholder={steps.map(step => `${step[1]}`)}
        />
        <br></br>

        <Textarea
          label='Ingredients'
          placeholder={foods.map(fooditem => `${fooditem.QUANTITY} ${fooditem.FOODNAME}`)}
        />
        <br></br>
      </div>
      <Button>Submit</Button>
      <Button>Delete</Button>

    </div>
  );
};

export default EditRecipe;
