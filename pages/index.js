import React from 'react';
import Head from '../components/head';
import NeoChart from '../components/NeoChart';

const Home = () => (
  <div
    style={{
      margin: '0px auto',
      paddingTop: '40px',
      maxWidth: '1000px',
      fontFamily: 'helvetica',
    }}
  >
    <Head title="Home" />
    <h1>NASA Neo - Data Visualization</h1>
    <NeoChart />
  </div>
);

export default Home;
