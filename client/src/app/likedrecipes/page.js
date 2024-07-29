'use client';

import { useState, useEffect } from "react";
import NavBar from '../components/NavBar';


const LikedRecipes = () => {

    const [LikedRecipes, setLikedRecipes] = useState([]);

    useEffect(() => {
        const fetchLikedRecipes = async () => {
            try {
                const response = await fetch('api/likedrecipes');
                const data = await response.json(); 
                setLikedRecipes(data);
            } catch (error) {
                console.error('Error fetching liked recipes:', error);
            }
        }

        fetchLikedRecipes();
    }, []);

    return (
        <div>
            <NavBar />
            <h1>My Liked Recipes</h1>
        </div>
    )
}

export default LikedRecipes