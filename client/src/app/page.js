
'use client';

import { useState, useEffect } from "react";
import { Button, Select, Title } from "@mantine/core";
import NavBar from "./components/NavBar"
import styles from "./page.module.css"

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const response = await fetch('api/users');
        const data = await response.json();
        setUsers(data.data);
        console.log(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();

  }, [])

  // Handle user selection
  const handleUserChange = (userId) => {
    console.log(userId);
    localStorage.setItem('selectedUser', userId); // Store selected user ID in localStorage
  };

  return (
    <div>
      <NavBar />
      <div class={styles.imageContainer}>
        <img 
          src={"http://localhost:3000/home_splash.png"} 
          alt="Home" 
          className={styles.homeSplash}/>
          <Title className={styles.homeTitle}>Lorem ipsum dolor</Title>
      </div>
      <div class={styles.horizontalColumn}>
        <Select
            label="Username"
            placeholder="Pick a user"
            data={users.map((user, index) => user[0] + '. ' + user[1])}
            onChange={(value) => setSelectedUser(value.split('.')[0])}
            />
        <Button 
            color="rgba(101, 85, 143, 1)" 
            onClick={() => handleUserChange(selectedUser)}
            >Login</Button>
      </div>
    </div>
  );
}
