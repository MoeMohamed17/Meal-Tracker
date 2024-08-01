
'use client';

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Button, Select, Title } from "@mantine/core";
import NavBar from "./components/NavBar"
import styles from "./page.module.css"
=======
import { useState, useEffect } from 'react';
import { Select, MantineProvider } from '@mantine/core';
import NavBar from './components/NavBar';
import styles from './page.css';
>>>>>>> 006333f87e72792691394cd551379277838b6645

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

<<<<<<< HEAD
  /*
  We declare the state variable `test` here which can change and trigger updates in 
  components that use them like tables, buttons, etc.
  `setTest` is a state updater function which we can call to update the value of test
  */
  const [test, setTest] = useState('');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  /*
  The `useEffect` hook lets us use state variables like `test` in components. 
  You should always wrap your API calls in `useEffect`.
  */
=======
>>>>>>> 006333f87e72792691394cd551379277838b6645
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

<<<<<<< HEAD
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

    // call the `fetchTest` function
    fetchUsers();

  }, [])

  console.log(users);
  
  /*
  What the page will render
  Should be a button named "Hello world!"
  */

  return (
    <div>
      <NavBar />
      <div>
        <img 
          src="https://images.ctfassets.net/lufu0clouua1/1ZWoXhCf0C4MyBU4xfN4q3/540ca2e3e585e3d413bd1c49e0b18a75/produce-dept.png" 
          alt="Home" 
          className={styles.homeSplash}/>
          <Title order={1} className={styles.homeTitle}>Lorem ipsum dolor</Title>
      </div>
      <div>
        <Select
            label="Username"
            placeholder="Pick a user"
            data={users.map((user, index) => user[0] + '. ' + user[1])}
            onChange={(event) => setSelected(event.currentTarget.value)}
            className={styles.userSelect} />
        <Button 
            color="rgba(101, 85, 143, 1)"
            // onChange={}
            className={styles.selectUserButton}
            >Login</Button>
      </div>

    </div>
=======
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
>>>>>>> 006333f87e72792691394cd551379277838b6645
  );
}
