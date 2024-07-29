
'use client';
//LIST OF ALL PANTRIES
import { useState, useEffect } from "react";
import './Pantries.css'
import NavBar from "../components/NavBar";
import Pantry from "../components/PantryCard"

const Pantries = () => {

    const [pantries, setPantries] = useState([]);

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
            <NavBar />
            <h1>My Pantries</h1>
            <div className="pantries-grid">
                {pantries.map((pantry, index) => (
                    <Pantry
                        key = {index}
                        category={pantry.category}
                    />
                ))}
            </div>
        </div>

    )


}

export default Pantries
