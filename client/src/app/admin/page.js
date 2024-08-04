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
  const [selectedTable, setSelectedTable] = useState('Users'); // State for selected table
  const [usersData, setUsersData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [pantriesData, setPantriesData] = useState([]);
  const [savedPantriesData, setSavedPantriesData] = useState([]);
  const [UserLevelsData, setUserLevelsData] = useState([]);
  const [recipeslikedData, setRecipesLikedData] = useState([]);
  const [recipelevelsData, setRecipeLevelsData] = useState([]);


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
        setSavedPantriesData(savedPantriesData);
        
        // Fetch UserLevels
        const UserLevelsResponse = await fetch('/api/userlevels');
        if (!UserLevelsResponse.ok) {
          throw new Error('Failed to fetch user levels data');
        }
        const UserLevelsJson = await UserLevelsResponse.json();
        const UserLevelsData = UserLevelsJson.data.map((UserLevels) =>
          Object.fromEntries(Object.entries(UserLevels).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setUserLevelsData(UserLevelsData);        
        
        // Fetch RecipesLiked
        const RecipesLikedResponse = await fetch('/api/recipes/liked');
        if (!RecipesLikedResponse.ok) {
          throw new Error('Failed to fetch liked recipes data');
        }
        const recipeslikedJson = await RecipesLikedResponse.json();
        const recipeslikedData = recipeslikedJson.data.map((recipesliked) =>
          Object.fromEntries(Object.entries(recipesliked).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setRecipesLikedData(recipeslikedData);

        // Fetch RecipeLevels
        const recipelevelsResponse = await fetch('/api/recipelevels');
        if (!recipelevelsResponse.ok) {
          throw new Error('Failed to fetch recipe levels data');
        }
        const recipelevelsJson = await recipelevelsResponse.json();
        const recipelevelsData = recipelevelsJson.data.map((recipelevels) =>
          Object.fromEntries(Object.entries(recipelevels).map(([key, value]) => [key.toLowerCase(), value]))
        );
        setRecipeLevelsData(recipelevelsData);

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
          <option value="UserLevels">User Levels</option>
          <option value="RecipesLiked">Liked Recipes</option>
          <option value="RecipeLevels">Recipe Levels</option>


        </select>
      </div>

      {selectedTable === 'Users' && <Table tableData={usersData} tableName="Users" />}
      {selectedTable === 'Recipes Created' && <Table tableData={recipesData} tableName="Recipes Created" />}
      {selectedTable === 'UserPantries' && <Table tableData={pantriesData} tableName="User Pantries" />}
      {selectedTable === 'SavedPantries' && <Table tableData={savedPantriesData} tableName="Saved Pantries" />}
      {selectedTable === 'UserLevels' && <Table tableData={UserLevelsData} tableName="User Levels" />}
      {selectedTable === 'RecipesLiked' && <Table tableData={recipeslikedData} tableName="Liked Recipes" />}
      {selectedTable === 'RecipeLevels' && <Table tableData={recipelevelsData} tableName="Recipe Levels" />}

    </div>
  );
};

export default Admin;


