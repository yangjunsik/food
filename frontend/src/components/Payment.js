import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/payment.css"; // CSS 파일 연결
import axios from "axios"; // axios로 백엔드 연동

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = location.state || { cart: [] };

    const [selectedPayment, setSelectedPayment] = useState("credit-card"); // 기본 결제 수단: 신용카드
    const [pgProvider, setPgProvider] = useState("html5_inicis"); // 기본 PG사: 이니시스 (신용카드)

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const pointBalance = 0; // 예시 포인트 잔액
    const pointUsage = pointBalance >= totalAmount ? totalAmount : pointBalance;
    const finalAmount = totalAmount - pointUsage;

    const handlePayment = () => {
        const IMP = window.IMP; // 아임포트 초기화
        IMP.init("imp17808248"); // 아임포트 "가맹점 식별코드"

        const merchantUid = `mid_${new Date().getTime()}`; // 주문번호 생성
        const paymentData = {
            pg: pgProvider, // PG사 설정
            pay_method: selectedPayment, // 결제 수단
            merchant_uid: merchantUid,
            name: "주문 상품",
            amount: finalAmount,
            buyer_email: "test@example.com",
            buyer_name: "테스터",
            buyer_tel: "010-1234-5678",
            buyer_addr: "서울특별시 강남구",
            buyer_postcode: "123-456",
        };

        // 결제 요청
        IMP.request_pay(paymentData, async (response) => {
            if (response.success) {
                try {
                    const token = sessionStorage.getItem("token");

                    if (!token) {
                        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
                        navigate("/login");
                        return;
                    }

                    // 백엔드로 결제 데이터 전송
                    await axios.post(
                        "http://localhost:8080/api/purchases", // 백엔드 API 주소
                        {
                            merchantUid,
                            date: new Date().toISOString(),
                            totalAmount,
                            paymentMethod: selectedPayment,
                            pgProvider,
                            items: cart.map((item) => ({
                                name: item.name,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                            status: "SUCCESS",
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // JWT 토큰 전달
                            },
                        }
                    );

                    // **재고 감소 요청 추가**
                    await axios.post(
                        "http://localhost:8080/menu/reduce", // 백엔드 재고 감소 API 주소
                        cart.map((item) => ({
                            name: item.name,
                            quantity: item.quantity,
                        })),
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // JWT 토큰 전달
                            },
                        }
                    );

                    alert("결제 성공 및 재고 감소 완료!");
                    navigate("/barcode", {
                        state: {
                            merchantUid,
                            cart,
                        },
                    });
                } catch (error) {
                    console.error("재고 감소 요청 실패:", error.response ? error.response.data : error.message);
                    alert("결제 성공했지만 재고 감소 중 문제가 발생했습니다.");
                }
            } else {
                alert(`결제 실패: ${response.error_msg || "알 수 없는 오류가 발생했습니다."}`);
            }
        });
    };

    return (
        <section className="pay-section">
            <div className="container">
                {/* 상단 버튼 영역 */}
                <div className="top-buttons">
                    {/* 뒤로 버튼 */}
                    <button
                        className="top-button back-button"
                        onClick={() => navigate(-1)} // 이전 페이지로 이동
                    >
                        뒤로
                    </button>

                    {/* 홈 버튼 */}
                    <button
                        className="top-button home-button"
                        onClick={() => navigate('/chooseRestaurant')} // ChooseRestaurant.js로 이동
                    >
                        홈
                    </button>
                </div>
                {/* 주문 상품 */}
                <h2>주문 상품</h2>
                {cart.map((item, index) => (
                    <div key={index} className="white-box">
                        <p>{item.name}</p>
                        <div className="flex-container">
                            <p>수량: {item.quantity}개</p>
                            <p>{item.price * item.quantity}원</p>
                        </div>
                    </div>
                ))}

                {/* 총 결제 금액 */}
                <h2>총 결제 금액</h2>
                <div className="white-box">
                    <div className="flex-container">
                        <p>총 주문 금액</p>
                        <p>{totalAmount}원</p>
                    </div>
                </div>

                {/* 결제 방법 */}
                <h2>결제 방법</h2>
                <div className="payment-methods">
                    {/* 신용·체크카드 */}
                    <div
                        className={`method-box ${selectedPayment === "credit-card" ? "selected" : ""}`}
                        onClick={() => {
                            setSelectedPayment("credit-card");
                            setPgProvider("html5_inicis"); // 신용·체크카드는 이니시스 설정
                        }}
                    >
                        <p>신용·체크카드</p>
                    </div>
                    {/* 카카오페이 */}
                    <div
                        className={`method-box ${selectedPayment === "kakaopay" ? "selected" : ""}`}
                        onClick={() => {
                            setSelectedPayment("kakaopay");
                            setPgProvider("kakaopay");
                        }}
                    >
                        <img src="/images4/카카오페이-removebg-preview.png" alt="카카오페이" className="method-icon" />
                    </div>
                    {/* 토스페이 */}
                    <div
                        className={`method-box ${selectedPayment === "tosspay" ? "selected" : ""}`}
                        onClick={() => {
                            setSelectedPayment("tosspay");
                            setPgProvider("tosspay");
                        }}
                    >
                        <img src="/images4/토스페이-removebg-preview.png" alt="토스페이" className="method-icon" />
                    </div>
                </div>

                {/* 결제하기 버튼 */}
                <button className="submit-btn" onClick={handlePayment}>
                    결제하기
                </button>
            </div>
        </section>
    );
}

export default Payment;







