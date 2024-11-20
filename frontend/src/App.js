import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChooseRestaurant from './components/ChooseRestaurant';
import Gongsikdang from './components/Gongsikdang'; // Gongsikdang 컴포넌트 임포트

function App() {
    // isAuthenticated를 sessionStorage를 기반으로 관리
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!sessionStorage.getItem("token") // 새로고침 시 토큰 여부를 확인
    );

    const handleLogin = () => {
        setIsAuthenticated(true); // 로그인 성공 시 상태 업데이트
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token"); // 로그아웃 시 토큰 제거
        setIsAuthenticated(false); // 상태 업데이트
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
                    element={<Navigate to={isAuthenticated ? "/ChooseRestaurant" : "/login"} />}
                />
            </Routes>
        </Router>
    );
}

export default App;










