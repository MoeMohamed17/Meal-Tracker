'use client';

import React, { useState, useEffect } from 'react';
import { Button, TextInput, Modal } from '@mantine/core';
import NavBar from '../components/NavBar';
import PantryCard from '../components/PantryCard';
import './Pantries.css';

const Pantries = () => {
  const [pantries, setPantries] = useState([]);
  const [openPantryModal, setOpenPantryModal] = useState(false);
  const [newPantryCategory, setNewPantryCategory] = useState('');
  const [alertModal, setAlertModal] = useState({ open: false, message: '' });
  const [pantryIdToAdd, setPantryIdToAdd] = useState(''); // New state for pantry ID input

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

  useEffect(() => {
    fetchPantries();
  }, []);

  const handleAddPantry = async () => {
    const selectedUser = localStorage.getItem('selectedUser');
    if (!newPantryCategory) {
      setAlertModal({ open: true, message: 'Please enter a pantry category.' });
      return;
    }

    if (selectedUser) {
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
          setAlertModal({ open: true, message: 'Pantry added successfully!' });
        } else {
          setAlertModal({ open: true, message: 'Error adding pantry. Please try again.' });
        }
      } catch (error) {
        console.error('Error adding pantry:', error);
        setAlertModal({ open: true, message: 'Error adding pantry. Please try again.' });
      }
    }
  };

  const handleAddPantryById = async () => {
    const selectedUser = localStorage.getItem('selectedUser');
    if (!pantryIdToAdd) {
      setAlertModal({ open: true, message: 'Please enter a pantry ID.' });
      return;
    }

    try {
      const response = await fetch(`/api/savedpantries/${pantryIdToAdd}`);
      const data = await response.json();

      if (data && data.ownerId !== selectedUser) {
        // Check if pantry is not owned by the current user
        const addResponse = await fetch('/api/userpantries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ UserID: selectedUser, PantryID: pantryIdToAdd }),
        });

        if (addResponse.ok) {
          fetchPantries(); // Refresh the pantry list
          setAlertModal({ open: true, message: 'Pantry added to your collection!' });
        } else {
          setAlertModal({ open: true, message: 'Failed to add pantry. Please try again.' });
        }
      } else {
        setAlertModal({ open: true, message: 'The pantry does not exist or is already yours.' });
      }
    } catch (error) {
      console.error('Error adding pantry by ID:', error);
      setAlertModal({ open: true, message: 'Error adding pantry. Please try again.' });
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

      <TextInput
        label="Add Pantry by ID"
        placeholder="Enter pantry ID"
        value={pantryIdToAdd}
        onChange={(e) => setPantryIdToAdd(e.currentTarget.value)}
      />
      <Button onClick={handleAddPantryById}>Add Pantry by ID</Button>

      <Modal
        opened={alertModal.open}
        onClose={() => setAlertModal({ open: false, message: '' })}
        title="Notification"
      >
        <div>{alertModal.message}</div>
        <Button onClick={() => setAlertModal({ open: false, message: '' })}>Close</Button>
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
