'use client';

import { useState, useEffect } from "react";
import { Button, Select, Title } from "@mantine/core";
import NavBar from "./components/NavBar"
import styles from "./page.module.css"

export default function Home() {

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
  useEffect(() => {

    // Encapsulate the asynchronous API call in `fetchTest`
    const fetchTest = async() => {
      try {
        const response = await fetch('api/test');
        const data = await response.text();

        // `test` variable is set to whatever's retrieved from the API call
        setTest(data);

      } catch (error) {
        console.error('Error with test endpoint:', error);
      }
    }

    // call the `fetchTest` function
    fetchTest();
  }, [])


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
  );
}
