import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChooseRestaurant from './components/ChooseRestaurant';
import Gongsikdang from './components/Gongsikdang'; // Gongsikdang 컴포넌트 임포트
import Cafeteria from "./components/Cafeteria";
import InfoRestaurant from './components/InfoRestaurant'; // 컴포넌트 추가
import MyPage from "./components/MyPage";
import BarcodePage from "./components/BarcodePage"; // BarcodePage 추가
import Payment from "./components/Payment";

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
                <Route
                    path="/infoRestaurant"
                    element={isAuthenticated ? <InfoRestaurant /> : <Navigate to="/login" />}
                />

                <Route
                    path="/Cafeteria"
                    element={isAuthenticated ? <Cafeteria /> : <Navigate to="/login" />}
                />
                {/* 마이페이지 */}
                <Route
                    path="/mypage"
                    element={isAuthenticated ? <MyPage /> : <Navigate to="/login" />}
                />
                {/* 바코드 페이지 */}
                <Route
                    path="/barcode" // 바코드 페이지 경로 추가
                    element={isAuthenticated ? <BarcodePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/payment"
                    element={isAuthenticated ? <Payment /> : <Navigate to="/login" />}
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










