// // src/app/recipes/[id]/page.js
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import NavBar from '../../components/NavBar';

// const RecipeDetails = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [steps, setSteps] = useState([]);
//   const [recipeName, setRecipeName] = useState('');

//   useEffect(() => {
//     if (!id) return;

//     const fetchRecipeDetails = async () => {
//       try {
//         const recipeResponse = await fetch(`/api/recipe/${id}`);
//         if (!recipeResponse.ok) {
//           throw new Error('Error fetching recipe details');
//         }
//         const recipeData = await recipeResponse.json();
//         setRecipeName(recipeData.data[0][1]); // Assuming name is at index 1

//         const stepsResponse = await fetch(`/api/recipe/${id}/steps`);
//         if (!stepsResponse.ok) {
//           throw new Error('Error fetching recipe steps');
//         }
//         const stepsData = await stepsResponse.json();
//         setSteps(stepsData.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchRecipeDetails();
//   }, [id]);

//   return (
//     <div>
//       <NavBar />
//       <h1>{recipeName}</h1>
//       <div className="recipe-steps">
//         <h2>Steps</h2>
//         <ol>
//           {steps.map((step, index) => (
//             <li key={index}>{step[1]}</li> // Assuming instruction text is at index 1
//           ))}
//         </ol>
//       </div>
//     </div>
//   );
// };

// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import NavBar from '../../components/NavBar';

// const RecipeDetails = () => {
//   const params = useParams();
//   const id = params.id;
//   const [recipe, setRecipe] = useState(null);
//   const [steps, setSteps] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       try {
//         const response = await fetch(`/api/recipe/${id}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch recipe details');
//         }
//         const data = await response.json();
//         setRecipe(data.data[0]); // Assuming the first item contains the recipe details
//       } catch (error) {
//         console.error('Error fetching recipe:', error);
//         setError('Failed to load recipe details.');
//       }
//     };

//     const fetchRecipeSteps = async () => {
//       try {
//         const response = await fetch(`/api/recipe/${id}/steps`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch recipe steps');
//         }
//         const data = await response.json();
//         setSteps(data.data);
//       } catch (error) {
//         console.error('Error fetching recipe steps:', error);
//         setError('Failed to load recipe steps.');
//       }
//     };

//     if (id) {
//       fetchRecipeDetails();
//       fetchRecipeSteps();
//     }
//   }, [id]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!recipe) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <NavBar />
//       <h1>{recipe[1]}</h1> {/* Recipe Name */}
//       <p><strong>Cuisine:</strong> {recipe[2]}</p> {/* Cuisine */}
//       <p><strong>Cooking Time:</strong> {recipe[3]}</p> {/* Cooking Time */}
//       <p><strong>Created By:</strong> {recipe[5]}</p> {/* Creator's Name */}

//       <div className="recipe-steps">
//         <h2>Steps</h2>
//         <ol>
//           {steps.map((step, index) => (
//             <li key={index}>{step[1]}</li> // Instruction Text
//           ))}
//         </ol>
//       </div>
//     </div>
//   );
// };

// export default RecipeDetails;


'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '../../components/NavBar';

const RecipeDetails = () => {
  const params = useParams();
  const id = params.id;
  const [recipe, setRecipe] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`/api/recipe/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }
        const data = await response.json();
        setRecipe(data.data[0]); // Assuming the first item contains the recipe details
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Failed to load recipe details.');
      }
    };

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
        setError('Failed to load recipe steps.');
      }
    };

    if (id) {
      fetchRecipeDetails();
      fetchRecipeSteps();
    }
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <h1>{recipe[1]}</h1> {/* Recipe Name */}
      <p><strong>Cuisine:</strong> {recipe[2]}</p> {/* Cuisine */}
      <p><strong>Cooking Time:</strong> {recipe[3]}</p> {/* Cooking Time */}
      <p><strong>Created By:</strong> {recipe[5]}</p> {/* Creator's Name */}

      <div className="recipe-steps">
        <h2>Steps</h2>
        <ol>
          {steps.map((step, index) => (
            <li key={index}>{step[1]}</li> // Instruction Text
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetails;

