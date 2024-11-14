// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("token")); // 초기 상태를 sessionStorage 토큰에 기반

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/menu" element={isAuthenticated ? <Menu /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;





