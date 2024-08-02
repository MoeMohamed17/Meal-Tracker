//admin page

// const Admin = () => {

//     return (
//         <h1>Admin Page</h1>
//     )
// }

// export default Admin

'use client'
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import NavBar from '../components/NavBar';

const Admin = () => {
  const [usersData, setUsersData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users data
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users data');
        }
        const usersJson = await usersResponse.json();
        const usersData = usersJson.data.map((user) => 
          Object.fromEntries(Object.entries(user).map(([key, value]) => [key.toLowerCase(), value]))
        ); // Normalize column names
        console.log('Users data:', usersData);
        setUsersData(usersData);

        // Fetch Recipes data
        const recipesResponse = await fetch('/api/recipes');
        if (!recipesResponse.ok) {
          throw new Error('Failed to fetch recipes data');
        }
        const recipesJson = await recipesResponse.json();
        const recipesData = recipesJson.data.map((recipe) => 
          Object.fromEntries(Object.entries(recipe).map(([key, value]) => [key.toLowerCase(), value]))
        ); // Normalize column names
        console.log('Recipes data:', recipesData);
        setRecipesData(recipesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
        <NavBar />
      <Table tableData={usersData} tableName="Users" />
      <Table tableData={recipesData} tableName="Recipes" />
    </div>
  );
};

export default Admin;



