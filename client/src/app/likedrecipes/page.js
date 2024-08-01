// 'use client';

// import { useState, useEffect } from "react";
// import NavBar from '../components/NavBar';


// const LikedRecipes = () => {

//     const [LikedRecipes, setLikedRecipes] = useState([]);

//     useEffect(() => {
//         const fetchLikedRecipes = async () => {
//             try {
//                 const response = await fetch('api/likedrecipes');
//                 const data = await response.json(); 
//                 setLikedRecipes(data);
//             } catch (error) {
//                 console.error('Error fetching liked recipes:', error);
//             }
//         }

//         fetchLikedRecipes();
//     }, []);

//     return (
//         <div>
//             <NavBar />
//             <h1>My Liked Recipes</h1>
//         </div>
//     )
// }

// export default LikedRecipes

'use client';

import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';
import './LikedRecipes.css'; // Ensure to link to your CSS file

// Assuming the cuisine options are defined somewhere
const cuisineOptions = ['Italian', 'Mexican', 'Chinese', 'Indian', 'American'];

const LikedRecipes = () => {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [showCaptions, setShowCaptions] = useState(true);

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      const selectedUser = localStorage.getItem('selectedUser');
      if (selectedUser) {
        try {
          const params = new URLSearchParams({
            img: 'true',
            captionless: showCaptions ? '0' : '1',
            ...(cuisineFilter && { filter: cuisineFilter }),
            ...(searchQuery && { id: searchQuery }),
          });

          const response = await fetch(`/api/recipes/liked/${selectedUser}?${params}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const { data } = await response.json();
          setLikedRecipes(data);
        } catch (error) {
          console.error('Error fetching liked recipes:', error);
        }
      }
    };

    fetchLikedRecipes();
  }, [cuisineFilter, searchQuery, showCaptions]);

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1>My Liked Recipes</h1>
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by Recipe Name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="cuisine-select"
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.map((cuisine, index) => (
              <option key={index} value={cuisine}>{cuisine}</option>
            ))}
          </select>
          <label className="caption-toggle">
            <input
              type="checkbox"
              checked={showCaptions}
              onChange={(e) => setShowCaptions(e.target.checked)}
            />
            Show Captions
          </label>
        </div>
        <div className='recipe-grid'>
          {likedRecipes && likedRecipes.length > 0 ? (
            likedRecipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                id={recipe.RECIPEID}
                name={recipe.RECIPENAME}
                cuisine={recipe.CUISINE}
                level={recipe.RECIPELEVEL}
                time={recipe.COOKINGTIME}
                createdBy={recipe.USERNAME}
                imageUrl={recipe.IMAGEURL}
                caption={showCaptions ? recipe.CAPTION : ''}
              />
            ))
          ) : (
            <p>No liked recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedRecipes;
