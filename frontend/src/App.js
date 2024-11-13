// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Menu from './components/Menu';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <AuthWrapper setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route
                    path="/login"
                    element={<Login onLogin={() => setIsAuthenticated(true)} />}
                />
                <Route
                    path="/menu"
                    element={isAuthenticated ? <Menu /> : <Navigate to="/login" />}
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

// AuthWrapper: 로그인 상태를 확인하고 세션 유효성을 확인하는 컴포넌트
function AuthWrapper({ setIsAuthenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        // 세션 확인 요청을 보냄
        axios.get("http://localhost:8080/user/check-auth", { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    console.log("Session is valid.");  // 세션 유효성 확인
                    setIsAuthenticated(true);          // 세션이 유효하면 로그인 상태 유지
                } else {
                    console.log("Session is invalid.");
                    setIsAuthenticated(false);
                    navigate("/login");
                }
            })
            .catch(error => {
                console.error("Error during session check:", error);
                setIsAuthenticated(false);
                navigate("/login");
            });
    }, [navigate, setIsAuthenticated]);

    return null; // 이 컴포넌트 자체는 UI를 렌더링하지 않음
}

export default App;


