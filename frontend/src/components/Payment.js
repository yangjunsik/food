import React from "react";
import { useLocation } from "react-router-dom";
import "./css/payment.css"; // 주신 CSS 파일 연결

function Payment() {
    const location = useLocation();
    const { cart } = location.state || { cart: [] }; // 전달받은 상태가 없을 경우 기본값 설정

    // 총 금액 계산
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const pointBalance = 3000; // 예시로 설정한 포인트 잔액
    const pointUsage = pointBalance >= totalAmount ? totalAmount : pointBalance; // 사용 포인트 계산
    const finalAmount = totalAmount - pointUsage; // 최종 결제 금액

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
                <input type="radio" id="simple-account" name="payment-method" value="simple-account" defaultChecked />
                <label htmlFor="simple-account">계좌 간편결제</label>
            </div>
            <div className="payment-option">
                <input type="radio" id="card-payment" name="payment-method" value="card" />
                <label htmlFor="card-payment">카드 간편결제</label>
            </div>

            {/* 결제하기 버튼 */}
            <button className="submit-btn">결제하기</button>
        </div>
        </section>
    );
}

export default Payment;
