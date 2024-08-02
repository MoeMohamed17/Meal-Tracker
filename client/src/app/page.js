
'use client';

import { useState, useEffect } from "react";
import { Button, Select, Title, Divider, Group, Stack, TextInput, Text, Grid } from "@mantine/core";
import NavBar from "./components/NavBar"
import styles from "./page.module.css"
import { useRouter } from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newUsername, setNewUsername] = useState('')

  const router = useRouter();

  const fetchUsers = async() => {
    try {
      const response = await fetch('api/users');
      const data = await response.json();
      setUsers(data.data);
      console.log(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [])



  const submitUser = async () => {
    if (newUsername === "") return;

    try {
      const response = await fetch('api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ UserName: newUsername }),
      });

      const data = await response.json(); 
      handleUserChange(data.response.UserID);
      fetchUsers();
      
    } catch (error) {
      console.error(error);
    }
  };




  // Handle user selection
  const handleUserChange = (userId) => {
    console.log(userId);
    localStorage.setItem('selectedUser', userId); // Store selected user ID in localStorage
    router.push('/recipes');
  };


  return (
    <div> 
      <NavBar />
      <div class={styles.imageContainer}>
        <img 
          src={"http://localhost:3000/home_splash.png"} 
          alt="Home" 
          className={styles.homeSplash}/>
          <Title className={styles.homeTitle}>Meal Mapper</Title>
      </div>

      <Grid>
        <Grid.Col span={8}>
          <Title className={styles.homeText}>Lorem ipsum dolor sit amet consecteteur</Title>
          <Text className={styles.homeText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id efficitur sapien. Vestibulum quis ultricies justo. Duis dui nibh, dapibus sit amet ipsum et, posuere sollicitudin nisi. Cras ultrices erat vitae justo molestie ultricies. Nam porttitor placerat dictum. Duis convallis urna eu ex ullamcorper semper. Vivamus vulputate leo vel enim consequat, condimentum eleifend erat imperdiet. Etiam quis mattis nunc, a placerat augue. Morbi sed turpis eros. Quisque vel odio rhoncus, hendrerit lectus sed, tincidunt ante. Maecenas imperdiet, purus eget hendrerit pellentesque, purus massa tristique dui, lobortis rhoncus tellus lectus at purus.</Text>
        </Grid.Col>

        <Grid.Col span={4}>
          <Group>
            <Select
              label="Login to Existing User"
              placeholder="Pick a user"
              data={users.map((user, index) => `${user[0]}. ${user[1]}`)}
              onChange={(value) => setSelectedUser(value.split('.')[0])}
              className={styles.userSelect}
            />
            <Button 
              color="rgba(101, 85, 143, 1)" 
              onClick={() => handleUserChange(selectedUser)}
              className={styles.userButton}
            >
              Login
            </Button>
          </Group>
          <Divider my="xl" label="Create a New User" labelPosition="left" className={styles.dividerHome}/>

          <Group>
          
            <TextInput 
              withAsterisk
              required
              label='Name'
              placeholder="Dentist Crentist"
              sx={{ width: '100%', textAlign: 'right' }}
              className={styles.userInput}
              onChange={(event) => { setNewUsername(event.currentTarget.value); }}
            />
            <Button 
              color="rgba(101, 85, 143, 1)"
              sx={{ marginTop: '10px', width: '100%', textAlign: 'right' }}
              className={styles.userInputButton}
              onClick={submitUser}
            >
              Create
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
}