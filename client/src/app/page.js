
'use client';

import { useState, useEffect } from 'react';
import { Select, MantineProvider } from '@mantine/core';
import NavBar from './components/NavBar';
import styles from './page.css';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users'); // Fetch all users
        const data = await response.json();
        setUsers(data.data); // Assuming the API returns users in the `data` array
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection
  const handleUserChange = (userId) => {
    setSelectedUser(userId);
    localStorage.setItem('selectedUser', userId); // Store selected user ID in localStorage
  };

  return (
    <MantineProvider>
      <div>
        <NavBar />
        <img
          src="https://img2.10bestmedia.com/Images/Photos/406808/The-Fresh-Market_55_660x440.jpg"
          alt="Home"
          className="home-image"
        />
        <h1 className="logo">Meal Mapper</h1>
        <div className="user-select-container">
          <Select
            className="user-select"
            placeholder="Select a user"
            data={users.map((user) => ({ value: String(user[0]), label: user[1] }))}
            onChange={handleUserChange}
            value={selectedUser}
          />
        </div>
      </div>
    </MantineProvider>
  );
}
