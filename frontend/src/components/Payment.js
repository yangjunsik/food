import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/payment.css"; // CSS 파일 연결
import axios from "axios"; // axios로 백엔드 연동

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = location.state || { cart: [] };

    const [paymentMethod, setPaymentMethod] = useState("card");

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const pointBalance = 3000; // 예시로 설정한 포인트 잔액
    const pointUsage = pointBalance >= totalAmount ? totalAmount : pointBalance;
    const finalAmount = totalAmount - pointUsage;

    const handlePayment = () => {
        const IMP = window.IMP;
        IMP.init("imp17808248");

        const merchantUid = `mid_${new Date().getTime()}`;
        const paymentData = {
            pg: "kakaopay",
            pay_method: paymentMethod,
            merchant_uid: merchantUid,
            name: "주문 상품",
            amount: finalAmount,
            buyer_email: "test@example.com",
            buyer_name: "테스터",
            buyer_tel: "010-1234-5678",
            buyer_addr: "서울특별시 강남구",
            buyer_postcode: "123-456",
        };

        IMP.request_pay(paymentData, async (response) => {
            if (response.success) {
                try {
                    const token = sessionStorage.getItem("token");

                    if (!token) {
                        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
                        navigate("/login");
                        return;
                    }

                    // POST 요청으로 구매 데이터 전송
                    await axios.post(
                        "http://localhost:8080/api/purchases", // 명확한 주소 사용
                        {
                            merchantUid,
                            date: new Date().toISOString(),
                            totalAmount,
                            paymentMethod,
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

                    alert("결제 성공!");
                    navigate("/barcode", {
                        state: {
                            merchantUid,
                            cart,
                        },
                    });
                } catch (error) {
                    console.error("백엔드 저장 오류:", error);
                    alert("결제 성공했지만 데이터 저장 중 문제가 발생했습니다.");
                }
            } else {
                alert(`결제 실패: ${response.error_msg}`);
            }
        });
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
                <h2>총 주문 금액</h2>
                <div className="white-box">
                    <div className="flex-container">
                        <p>총 주문 금액</p>
                        <p>{totalAmount}원</p>
                    </div>
                </div>

                {/* 충전 포인트 */}
                <h2>충전포인트</h2>
                <div className="white-box">
                    <div className="flex-container">
                        <p>포인트 잔액</p>
                        <p>{pointBalance}원</p>
                    </div>
                    <div className="transparent-box">
                        <div className="flex-container">
                            <p>사용 포인트</p>
                            <p>{pointUsage}원</p>
                        </div>
                    </div>
                </div>

                {/* 총 결제 금액 */}
                <h2>총 결제 금액</h2>
                <div className="white-box">
                    <div className="flex-container">
                        <p>최종 결제 금액</p>
                        <p>{finalAmount}원</p>
                    </div>
                </div>

                {/* 결제 수단 */}
                <h2>결제 수단</h2>
                <div className="payment-option">
                    <input
                        type="radio"
                        id="card-payment"
                        name="payment-method"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="card-payment">카드 간편결제</label>
                </div>
                <div className="payment-option">
                    <input
                        type="radio"
                        id="simple-account"
                        name="payment-method"
                        value="trans"
                        checked={paymentMethod === "trans"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="simple-account">계좌 간편결제</label>
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




