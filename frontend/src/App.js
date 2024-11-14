// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import Register from './components/Register'; // Register 컴포넌트 임포트

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
                <Route path="/register" element={<Register />} /> {/* 회원가입 페이지 라우트 추가 */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;





