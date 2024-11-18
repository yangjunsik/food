// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChooseRestaurant from './components/ChooseRestaurant';
import Gongsikdang from './components/Gongsikdang'; // Gongsikdang 컴포넌트 임포트

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />

                {/* 식당 선택 페이지 */}
                <Route
                    path="/ChooseRestaurant"
                    element={isAuthenticated ? <ChooseRestaurant /> : <Navigate to="/login" />}
                />
                <Route
                    path="/gongsikdang"
                    element={isAuthenticated ? <Gongsikdang /> : <Navigate to="/login" />}
                />


                {/* 기본 경로 */}
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? "/choose-restaurant" : "/login"} />}
                />
            </Routes>
        </Router>
    );
}

export default App;









