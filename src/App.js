import React from 'react';
import './App.css';
import{BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import NoteState from './context/Notes/NoteState';
import { Alert } from './components/Alert';

function App() {
  return (
    <>
    <NoteState>
    <Router>
    <Navbar/>
    <Alert message="Warnings"/>
    <div className="container">
    <Routes>
    {/* <Route exact path="/" element={<News setProgress={setProgress} apiKey={apiKey} key="general" pageSize={pageSize} country="in" category="general"/>} /> */}
    <Route exact path="/"  element={<Home/>}/>
    <Route exact path="/home"  element={<Home/>}/>
    <Route exact path="/about" element={<About/>}/>
    </Routes>
    </div> 
    </Router>
    </NoteState>
    </>
  );
}

export default App;
