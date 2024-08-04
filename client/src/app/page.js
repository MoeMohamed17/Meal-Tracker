
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
  const [newUserError, setNewUserError] = useState('');

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
    const validNames = /^[a-zA-Z]+$/.test(newUsername);
    if (!validNames || newUsername === '') {
      setNewUserError('Only letter characters from a-z are accepted.');
      return;
    }

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
      setNewUserError('Username already taken.');
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
      <div className={styles.imageContainer}>
        <img 
          src={"http://localhost:3000/home_splash.png"} 
          alt="Home" 
          className={styles.homeSplash}/>
          <Title className={styles.homeTitle}>Meal Mapper</Title>
      </div>

      <Grid>
        <Grid.Col span={8}>
          <Title className={styles.homeText}>Lorem ipsum dolor sit amet consecteteur</Title>
          <Text className={styles.homeText}>You are in your kitchen, organizing this week's grocery list. As you flip through your recipe book, your long-suffering brain fills your nostrils with tantalizing aromas of dishes yet to be made. “I’ll have what she’s having!” you cry to no one, as the imagined sensation of an impending taste bud assault sends you into an electric frenzy. You wrench the sink taps on and howl in glee as you envision the water circling the drain as full-fat Greek yogurt, cascading like an endless, creamy waterfall of Olympic origin. The fragrance of fresh bread fills the space with a scent so ecstatic that, a hundred miles away, a lone baker inexplicably takes hold of his rolling pin and violently hammers his countertop as if it were a judge's gavel. "Be silent!" he shrieks to the aether, "The court of YEAST is now in session!". You cradle yourself and sob for a half hour before your neighbors knock on your door and ask you to stop.</Text>
        </Grid.Col>

        <Grid.Col span={4}>
          <Group>
            <Select
              label="Login to Existing User"
              placeholder="Pick a user"
              data={users.map((user, index) => `${user.USERID}. ${user.USERNAME}`)}
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
              placeholder="DentistCrentist"
              sx={{ width: '100%', textAlign: 'right' }}
              className={styles.userInput}
              error={newUserError}
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