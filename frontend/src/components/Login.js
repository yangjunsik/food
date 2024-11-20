// src/components/Login.js
import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

function Login({ onLogin }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post("/user/login", { id, password });
            if (response.data && response.data.message === "Login successful") {
                alert("Login successful!");
                sessionStorage.setItem("token", response.data.token); // JWT 토큰 저장
                onLogin();
                navigate("/ChooseRestaurant"); // 식당 선택 페이지로 이동
            } else {
                alert(response.data.message || "Invalid credentials, please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <main>
                <form onSubmit={handleSubmit}>
                    <div className="logo-circle"></div>
                    {/* 로고 원 */}
                    <span className="login_span">환영합니다!</span>
                    <p>학교 식당 예약 사이트 입니다</p>
                    <section className="login_section">
                        <label className="id_label">
                            <input
                                type="text"
                                name="id"
                                placeholder="아이디를 입력하세요"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </label>
                        <label className="pw_label">
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button type="submit">
                            로그인
                        </button>
                    </section>
                    <button className="signup-button" onClick={() => navigate("/register")}>
                        회원가입
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Login;








