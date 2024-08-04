
'use client';

import React, { useState, useEffect } from 'react';
import { Button, TextInput, Modal } from '@mantine/core';
import NavBar from '../components/NavBar';
import PantryCard from '../components/PantryCard';
import './Pantries.css'; // Make sure your CSS file exists for styling

const Pantries = () => {
  const [pantries, setPantries] = useState([]);
  const [openPantryModal, setOpenPantryModal] = useState(false);
  const [newPantryCategory, setNewPantryCategory] = useState('');

  // Define fetchPantries outside the useEffect hook
  const fetchPantries = async () => {
    const selectedUser = localStorage.getItem('selectedUser');
    if (selectedUser) {
      try {
        const response = await fetch(`/api/pantry/${selectedUser}`);
        const data = await response.json();
        setPantries(data.data || []);
        console.log(data.data);
      } catch (error) {
        console.error('Error fetching pantries:', error);
      }
    }
  };

  // Call fetchPantries once when the component mounts
  useEffect(() => {
    fetchPantries();
  }, []);

  const handleAddPantry = async () => {
    const selectedUser = localStorage.getItem('selectedUser');
    if (newPantryCategory && selectedUser) {
      try {
        const response = await fetch('/api/pantry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ UserID: selectedUser, Category: newPantryCategory }),
        });
        if (response.ok) {
          setNewPantryCategory('');
          setOpenPantryModal(false);
          fetchPantries(); // Refresh the pantry list
        }
      } catch (error) {
        console.error('Error adding pantry:', error);
      }
    }
  };

  return (
    <div className="pantries">
      <NavBar />
      <h1>My Pantries</h1>
      <Button onClick={() => setOpenPantryModal(true)}>Add Pantry</Button>
      <Modal opened={openPantryModal} onClose={() => setOpenPantryModal(false)} title="Add New Pantry">
        <TextInput
          label="Pantry Category"
          placeholder="Enter category"
          value={newPantryCategory}
          onChange={(e) => setNewPantryCategory(e.currentTarget.value)}
        />
        <Button onClick={handleAddPantry}>Submit</Button>
      </Modal>
      <div className="pantries-grid">
        {pantries.map((pantry, index) => (
          <PantryCard key={index} pantryId={pantry.PANTRYID} category={pantry.CATEGORY} />
        ))}
      </div>
    </div>
  );
};

export default Pantries;
