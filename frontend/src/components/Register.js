// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/register.css';

function Register() {
    const navigate = useNavigate(); // 추가
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);

    // 유효성 검사 메시지 상태 관리
    const [idValid, setIdValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/user/register", {
                id,
                password,
                name,
                phone
            });
            if (response.data.message === "Registration successful") {
                alert("회원가입이 완료되었습니다!");
                navigate("/login");
            } else {
                alert(response.data.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleIdDuplicationCheck = async () => {
        try {
            const response = await axios.post("http://localhost:8080/user/checkDuplicateId", { id });
            if (response.data.isDuplicate) {
                alert("ID가 이미 존재합니다.");
                setIdValid(false);
            } else {
                alert("사용 가능한 ID입니다.");
                setIdValid(true);
            }
        } catch (error) {
            console.error("ID 중복 확인 오류:", error);
            alert("ID 중복 확인 중 오류가 발생했습니다.");
        }
    };

    const handlePasswordValidation = () => {
        // 비밀번호 유효성 검사 로직
        setPasswordValid(password.length >= 6 && password.length <= 12);
    };

    const handleSendVerificationCode = () => {
        // 인증번호 전송 로직 추가 (API 호출)
        setShowVerification(true);
        alert('인증번호가 전송되었습니다.');
    };

    return (
        <main>
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <section className="id-section form-section">
                    <label>
                        <i className="fa-solid fa-lock"></i>
                        <input
                            type="text"
                            id="id"
                            placeholder="아이디 (6-12글자)"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </label>
                    <button type="button" className="id-duplication-btn" onClick={handleIdDuplicationCheck}>
                        중복확인
                    </button>
                </section>
                {idValid && <div className="valid-check-id">아이디는 사용 가능합니다.</div>}

                <section className="pw-section form-section">
                    <label>
                        <i className="fa-solid fa-key"></i>
                        <input
                            type="password"
                            id="pw"
                            placeholder="비밀번호 (6-12글자, 영문자 및 숫자, 특수문자 포함)"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                handlePasswordValidation();
                            }}
                        />
                    </label>
                </section>
                {passwordValid && <div className="valid-check-pw">비밀번호 형식이 유효합니다.</div>}

                <section className="pw-check-section form-section">
                    <label>
                        <i className="fa-solid fa-key"></i>
                        <input
                            type="password"
                            id="pw-ch"
                            placeholder="비밀번호 재입력"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </label>
                </section>

                <section className="name-section form-section">
                    <label>
                        <span>이름</span>
                        <input
                            type="text"
                            name="name"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </section>

                <section className="call-section form-section">
                    <label className="call-send-label">
                        <span>휴대폰번호</span>
                        <input
                            type="text"
                            name="phone"
                            placeholder="전화번호를 입력하세요"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>
                    <button type="button" className="call-button" onClick={handleSendVerificationCode}>
                    인증번호
                    </button>
                    {showVerification && (
                        <label className="call-accept-label">
                            <input
                                type="text"
                                placeholder="인증번호를 입력하세요"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </label>
                    )}
                </section>

                <section className="register-section form-section">
                    <button id="register-btn" type="submit">회원가입</button>
                    <button id="cancel-btn" type="button" onClick={() => navigate("/login")}>취소</button>
                </section>
            </form>
        </main>
    );
}

export default Register;
