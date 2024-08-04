'use client';

import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import './MyRecipes.css';
import UpdateTable from '../components/UpdateTable';
import GroupRecipes from "../util/GroupRecipes";

const MyRecipes = () => {
  const selectedUser = localStorage.getItem('selectedUser');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const response = await fetch('api/users');
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
        setCuisineOptions(data);
      } catch (error) {
        console.error('Error fetching cuisine options:', error);
      }
    };
    fetchCuisines();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {  
        try {
            const response = await fetch(`/api/recipes?user=${selectedUser}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const { data } = await response.json();
            setRecipes(GroupRecipes(data));
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };
  
    fetchRecipes();
  }, []);

  return (
    <div>
      <NavBar/>
      <UpdateTable recipes={recipes}/>
    </div>
  );
};

export default MyRecipes;
