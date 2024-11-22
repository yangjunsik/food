import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChooseRestaurant from './components/ChooseRestaurant';
import Gongsikdang from './components/Gongsikdang';
import InfoRestaurant from './components/InfoRestaurant';
import Cafeteria from './components/Cafeteria';
import MyPage from "./components/MyPage";
import BarcodePage from "./components/BarcodePage";
import Payment from "./components/Payment";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // 초기값 null로 설정
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        // sessionStorage에서 토큰 확인하여 로그인 상태 유지
        const token = sessionStorage.getItem("token");
        setIsAuthenticated(!!token); // 토큰 존재 여부에 따라 상태 설정
        setIsLoading(false); // 로딩 완료
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    if (isLoading) {
        // 로딩 중일 때 화면 표시
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />

                {/* 식당 선택 페이지 */}
                <Route
                    path="/chooseRestaurant"
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
                    path="/barcode"
                    element={isAuthenticated ? <BarcodePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/payment"
                    element={isAuthenticated ? <Payment /> : <Navigate to="/login" />}
                />

                {/* 기본 경로 */}
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? "/chooseRestaurant" : "/login"} />}
                />
            </Routes>
        </Router>
    );
}

export default App;










