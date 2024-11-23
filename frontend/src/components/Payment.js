import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/payment.css"; // CSS 파일 연결

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = location.state || { cart: [] };

    const [selectedPayment, setSelectedPayment] = useState("credit-card");

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePayment = () => {
        alert(`결제 방법: ${selectedPayment}`);
        // 결제 처리 로직 추가 필요
    };

    return (
        <section className="pay-section">
            <div className="container">
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

                {/* 총 주문 금액 */}
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
                    <div
                        className={`method-box ${selectedPayment === "credit-card" ? "selected" : ""}`}
                        onClick={() => setSelectedPayment("credit-card")}
                    >
                        <p>신용·체크카드</p>
                    </div>
                    <div
                        className={`method-box ${selectedPayment === "kakaopay" ? "selected" : ""}`}
                        onClick={() => setSelectedPayment("kakaopay")}
                    >
                        <img src="/images4/카카오페이-removebg-preview.png" alt="카카오페이" className="method-icon"/>
                    </div>
                    <div
                        className={`method-box ${selectedPayment === "tosspay" ? "selected" : ""}`}
                        onClick={() => setSelectedPayment("tosspay")}
                    >
                        <img src="/images4/토스페이-removebg-preview.png" alt="토스페이" className="method-icon"/>
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
