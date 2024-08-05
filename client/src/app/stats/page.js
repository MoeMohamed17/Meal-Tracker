'use client';

import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import './Stats.css';
import CountTable from '../components/CountTable';
import { Grid, NumberInput } from '@mantine/core';

const Stats = () => {
  const selectedUser = localStorage.getItem('selectedUser');
  const [cuisineCounts, setCuisineCounts] = useState([]);
  const [levelCounts, setLevelCounts] = useState([]);
  const [threshold, setThreshold] = useState(0);


  useEffect(() => {
    const fetchCuisineCounts = async() => {
      try {
        const response = await fetch(`api/cuisine-counts?threshold=${threshold}`);
        const data = await response.json();
        setCuisineCounts(data.data);
      } catch (error) {
        console.error('Error fetching cuisine counts:', error);
      }
    };
    fetchCuisineCounts();
  }, [threshold]);

  useEffect(() => {
    const fetchLevelCounts = async () => {
      try {
        const response = await fetch(`/api/level-counts`);
        const data = await response.json();
        setLevelCounts(data.data);
      } catch (error) {
        console.error('Error fetching level counts:', error);
      }
    };
    fetchLevelCounts();
  }, [threshold]);

  return (
    <div>
      <NavBar/>
      <Grid>
        <Grid.Col span={6}>
          <CountTable countData={cuisineCounts} attr1={'CUISINE'} attr2={'COUNT'} title={'Recipes Counts by Cuisine'}/>
        </Grid.Col>
        <Grid.Col span={6}>
          <CountTable countData={levelCounts} attr1={'USERLEVEL'} attr2={'USERCOUNT'} title={'User Distribution by Level'}/>
        </Grid.Col>
        <Grid.Col span={6}>
          <div style={{paddingLeft:'20px', width:'50%'}}>
            <NumberInput 
              description = 'Threshold count for cuisine' 
              placeholder='0'
              value={threshold}
              onChange={(value) => setThreshold(value)}
              allowNegative={false}
              allowDecimal={false}
            />
          </div>

        </Grid.Col>
      </Grid>
      
    </div>
  );
};

export default Stats;
