// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

function Login({ onLogin }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/user/login", // 엔드포인트 수정 확인
                {
                    id, // User ID 필드 (백엔드 요구사항에 맞춤)
                    password, // Password 필드 (백엔드 요구사항에 맞춤)
                },
                {
                    withCredentials: true // 세션 쿠키 포함 설정
                }
            );

            if (response.data && response.data.message === "Login successful") {
                alert("Login successful!");
                sessionStorage.setItem("user_id", id);
                onLogin();
                navigate("/menu");
            } else {
                alert(response.data.message || "Invalid credentials, please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <span className="login_span"><b>학적정보관리</b> 사이트에 오신것을 환영합니다</span>
                <h1>로그인</h1>
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
                    <button type="submit">로그인</button>
                </section>
                <section className="login_search_section">
                    <label>
                        <input type="checkbox" />
                        <span>아이디 저장</span>
                    </label>
                    <div>
                        <a href="#">아이디찾기/</a>
                        <a href="#">비밀번호찾기/</a>
                        <a href="/user/student-number">회원가입</a>
                    </div>
                </section>
                <section className="explanation_section">
                    <h3>신입생 안내</h3>
                    <span>
                        - 개강전 이용 가능: 통합정보시스템(일부 메뉴), IT교육센터, 어학교육원, 생활관<br />
                        - 개강후 이용 가능: 포털, 통합정보시스템(모든 메뉴), 도서관, Wi-FI 등<br />
                        * 수강 신청 시스템은 통합아이디로 이용하실 수 있습니다.<br />
                        * 개인정보 보호를 위해 비밀번호는 주기적으로 변경하시기 바랍니다.
                    </span>
                </section>
            </form>
        </main>
    );
}

export default Login;






