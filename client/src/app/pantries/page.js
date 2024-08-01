
// 'use client';
// //LIST OF ALL PANTRIES
// import { useState, useEffect } from "react";
// import './Pantries.css'
// import NavBar from "../components/NavBar";
// import Pantry from "../components/PantryCard"

// const Pantries = () => {

//     const [pantries, setPantries] = useState([]);

//     useEffect(() => {
//         const fetchPantries = async () => {
//             try {
//                 const response = await fetch('api/pantries');
//                 const data = await response.json(); 
//                 setPantries(data);
//             } catch (error) {
//                 console.error('Error fetching pantries:', error);
//             }
//         }

//         fetchPantries();
//     }, []);

//     return (
//         <div className="pantries">
//             <NavBar />
//             <h1>My Pantries</h1>
//             <div className="pantries-grid">
//                 {pantries.map((pantry, index) => (
//                     <Pantry
//                         key = {index}
//                         category={pantry.category}
//                     />
//                 ))}
//             </div>
//         </div>

//     )


// }

// export default Pantries


// 'use client';

// import { useState, useEffect } from 'react';
// import NavBar from '../components/NavBar';
// import PantryCard from '../components/PantryCard';
// import './Pantries.css'; // Add styles for your Pantries component

// const Pantries = () => {
//   const [pantries, setPantries] = useState([]);

//   useEffect(() => {
//     const fetchPantries = async () => {
//       try {
//         const response = await fetch('/api/pantry/:id');
//         if (!response.ok) {
//           throw new Error('Failed to fetch pantries');
//         }
//         const data = await response.json();
//         setPantries(data.data); // Assuming data is under the `data` key
//       } catch (error) {
//         console.error('Error fetching pantries:', error);
//       }
//     };

//     fetchPantries();
//   }, []);

//   return (
//     <div className="pantries">
//       <NavBar />
//       <h1>My Pantries</h1>
//       <div className="pantries-grid">
//         {pantries.map((pantry, index) => (
//           <PantryCard key={index} category={pantry[2]} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Pantries;

'use client';

import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import PantryCard from '../components/PantryCard';
import './Pantries.css'; // Add styles for your Pantries component

const Pantries = () => {
  const [pantries, setPantries] = useState([]);

  useEffect(() => {
    const fetchPantries = async () => {
      const selectedUser = localStorage.getItem('selectedUser');
      if (selectedUser) {
        try {
          const response = await fetch(`/api/pantry/${selectedUser}`);
          const data = await response.json();
          setPantries(data.data || []); // Handle case where data may be undefined
        } catch (error) {
          console.error('Error fetching pantries:', error);
        }
      }
    };

    fetchPantries();
  }, []);

  return (
    <div className="pantries">
      <NavBar />
      <h1>My Pantries</h1>
      <div className="pantries-grid">
        {pantries.map((pantry, index) => (
          <PantryCard key={index} category={pantry[2]} />
        ))}
      </div>
    </div>
  );
};

export default Pantries;


