import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import {Routes, Route, Link} from 'react-router-dom';
import Main from "../src/pages/main/main.jsx";
import Navbar from "../src/components/layout/navBar";


function App() {
  return (
    <>
        <Navbar />
        <Main />
    </>
  );
}

export default App;
