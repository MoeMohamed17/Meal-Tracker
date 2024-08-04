//admin page

// const Admin = () => {

//     return (
//         <h1>Admin Page</h1>
//     )
// }

// export default Admin

// 'use client'
// import { useState, useEffect } from 'react';
// import Table from '../components/Table';
// import NavBar from '../components/NavBar';

// const Admin = () => {
//   const [usersData, setUsersData] = useState([]);
//   const [recipesData, setRecipesData] = useState([]);
//   const [pantriesData, setPantriesData] = useState([]);
//   const [savedpantriesData, setSavedPantriesData] = useState([]);



//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch Users data
//         const usersResponse = await fetch('/api/users');
//         if (!usersResponse.ok) {
//           throw new Error('Failed to fetch users data');
//         }
//         const usersJson = await usersResponse.json();
//         const usersData = usersJson.data.map((user) => 
//           Object.fromEntries(Object.entries(user).map(([key, value]) => [key.toLowerCase(), value]))
//         ); // Normalize column names
//         console.log('Users data:', usersData);
//         setUsersData(usersData);

//         // Fetch Recipes data
//         const recipesResponse = await fetch('/api/recipes');
//         if (!recipesResponse.ok) {
//           throw new Error('Failed to fetch recipes data');
//         }
//         const recipesJson = await recipesResponse.json();
//         const recipesData = recipesJson.data.map((recipe) => 
//           Object.fromEntries(Object.entries(recipe).map(([key, value]) => [key.toLowerCase(), value]))
//         ); // Normalize column names
//         console.log('Recipes data:', recipesData);
//         setRecipesData(recipesData);

//         // Fetch All Pantries from All Users data
//         const pantriesResponse = await fetch('/api/pantries');
//         if (!pantriesResponse.ok) {
//           throw new Error('Failed to fetch pantries data');
//         }
//         const pantriesJson = await pantriesResponse.json();
//         const pantriesData = pantriesJson.data.map((pantries) => 
//           Object.fromEntries(Object.entries(pantries).map(([key, value]) => [key.toLowerCase(), value]))
//         ); // Normalize column names
//         console.log('Pantries data:', pantriesData);
//         setPantriesData(pantriesData);

//         // Fetch All Saved and Existing Pantries
//         const savedpantriesResponse = await fetch('/api/savedpantries');
//         if (!savedpantriesResponse.ok) {
//           throw new Error('Failed to fetch saved pantries data');
//         }
//         const savedpantriesJson = await savedpantriesResponse.json();
//         const savedpantriesData = savedpantriesJson.data.map((savedpantries) => 
//           Object.fromEntries(Object.entries(savedpantries).map(([key, value]) => [key.toLowerCase(), value]))
//         ); // Normalize column names
//         console.log('Saved Pantries data:', savedpantriesData);
//         setSavedPantriesData(savedpantriesData);



//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div style={{ padding: '20px' }}>
//         <NavBar />
//       <Table tableData={usersData} tableName="Users" />
//       <Table tableData={recipesData} tableName="Recipes" />
//       <Table tableData={pantriesData} tableName="Pantries" />
//       <Table tableData={savedpantriesData} tableName="Saved Pantries" />
//     </div>
//   );
// };

// export default Admin;



'use client'
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import NavBar from '../components/NavBar';

const Admin = () => {
  const [usersData, setUsersData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [pantriesData, setPantriesData] = useState([]);
  const [savedPantriesData, setSavedPantriesData] = useState([]);
  const [selectedTable, setSelectedTable] = useState('Users'); // State for selected table

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
        );
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
        );
        console.log('Recipes data:', recipesData);
        setRecipesData(recipesData);

        // Fetch All Pantries from All Users data
        const pantriesResponse = await fetch('/api/pantries');
        if (!pantriesResponse.ok) {
          throw new Error('Failed to fetch pantries data');
        }
        const pantriesJson = await pantriesResponse.json();
        const pantriesData = pantriesJson.data.map((pantries) =>
          Object.fromEntries(Object.entries(pantries).map(([key, value]) => [key.toLowerCase(), value]))
        );
        console.log('Pantries data:', pantriesData);
        setPantriesData(pantriesData);

        // Fetch All Saved and Existing Pantries
        const savedPantriesResponse = await fetch('/api/savedpantries');
        if (!savedPantriesResponse.ok) {
          throw new Error('Failed to fetch saved pantries data');
        }
        const savedPantriesJson = await savedPantriesResponse.json();
        const savedPantriesData = savedPantriesJson.data.map((savedPantries) =>
          Object.fromEntries(Object.entries(savedPantries).map(([key, value]) => [key.toLowerCase(), value]))
        );
        console.log('Saved Pantries data:', savedPantriesData);
        setSavedPantriesData(savedPantriesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <NavBar />
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="table-select">Select a table: </label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="Users">Users</option>
          <option value="Recipes Created">Recipes Created</option>
          <option value="UserPantries">User Pantries</option>
          <option value="SavedPantries">Saved Pantries</option>
        </select>
      </div>

      {selectedTable === 'Users' && <Table tableData={usersData} tableName="Users" />}
      {selectedTable === 'Recipes Created' && <Table tableData={recipesData} tableName="Recipes Created" />}
      {selectedTable === 'UserPantries' && <Table tableData={pantriesData} tableName="User Pantries" />}
      {selectedTable === 'SavedPantries' && <Table tableData={savedPantriesData} tableName="Saved Pantries" />}
    </div>
  );
};

export default Admin;


