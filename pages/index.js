import React from 'react';
import Head from '../components/head';
import NeoChart from '../components/NeoChart';
import { ToastContainer } from 'react-toastify';

const Home = () => (
  <div
    style={{
      margin: '0px auto',
      paddingTop: '20px',
      maxWidth: '1000px',
      fontFamily: 'helvetica',
    }}
  >
    <Head title="Home" />
    <h1>NASA Neo - Data Visualization</h1>
    <NeoChart />
    <ToastContainer autoClose={1400} />
  </div>
);

export default Home;
