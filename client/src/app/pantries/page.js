
'use client';
//LIST OF ALL PANTRIES
import { useState, useEffect } from "react";
import './Pantries.css'

const Pantries = () => {

    const [recipes, setPantries] = useState([]);

    useEffect(() => {
        const fetchPantries = async () => {
            try {
                const response = await fetch('api/pantries');
                const data = await response.json(); 
                setPantries(data);
            } catch (error) {
                console.error('Error fetching pantries:', error);
            }
        }

        fetchPantries();
    }, []);

    return (
        <div className="pantries">
            <h1>My Pantries</h1>
        </div>

    )


}

export default Pantries
