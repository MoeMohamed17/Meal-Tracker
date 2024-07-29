'use client';

import { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import NavBar from "./components/NavBar"
import styles from "./page.css"

export default function Home() {

  /*
  We declare the state variable `test` here which can change and trigger updates in 
  components that use them like tables, buttons, etc.
  `setTest` is a state updater function which we can call to update the value of test
  */
  const [test, setTest] = useState('');

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


  
  /*
  What the page will render
  Should be a button named "Hello world!"
  */

  return (
    <div>
      <NavBar />
      <img src="https://img2.10bestmedia.com/Images/Photos/406808/The-Fresh-Market_55_660x440.jpg" 
        alt="Home" className="home-image" />
      <h1 className="logo">Meal Mapper</h1>
      <Button className="start-button" size='xl' radius='xl' component='a' href='api/test'>{test}</Button>
    </div>
  );
}
