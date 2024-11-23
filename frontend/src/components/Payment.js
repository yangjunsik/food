import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/payment.css";
import axios from "axios";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = location.state || { cart: [] };

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [pgProvider, setPgProvider] = useState("kakaopay");
    const [pointBalance, setPointBalance] = useState(0);
    const [pointUsage, setPointUsage] = useState(0);

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalAmount = Math.max(totalAmount - pointUsage, 0);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get("http://localhost:8080/api/points", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPointBalance(response.data.points || 0);
            } catch (error) {
                console.error("포인트 정보 가져오기 실패:", error);
                setPointBalance(0);
            }
        };

        fetchPoints();
    }, []);

    const handlePayment = () => {
        const IMP = window.IMP;
        IMP.init("imp17808248");

        const merchantUid = `mid_${new Date().getTime()}`;
        const paymentData = {
            pg: pgProvider,
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

                    await axios.post(
                        "http://localhost:8080/api/purchases",
                        {
                            purchase: {
                                merchantUid,
                                date: new Date().toISOString(),
                                totalAmount,
                                paymentMethod,
                                pgProvider,
                                items: cart.map((item) => ({
                                    name: item.name,
                                    quantity: item.quantity,
                                    price: item.price,
                                })),
                                status: "SUCCESS",
                            },
                            pointUsage,
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
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

                <h2>충전포인트</h2>
                <div className="white-box">
                    <p>포인트 잔액: {pointBalance}원</p>
                    <input
                        type="number"
                        value={pointUsage}
                        onChange={(e) => {
                            const usage = Math.min(
                                parseInt(e.target.value, 10) || 0,
                                pointBalance,
                                totalAmount
                            );
                            setPointUsage(usage);
                        }}
                        placeholder="사용할 포인트 입력"
                    />
                </div>

                <h2>총 결제 금액: {finalAmount}원</h2>

                <h2>결제 대행사</h2>
                <div className="pg-option">
                    <input
                        type="radio"
                        id="kakao-payment"
                        name="pg-provider"
                        value="kakaopay"
                        checked={pgProvider === "kakaopay"}
                        onChange={(e) => setPgProvider(e.target.value)}
                    />
                    <label htmlFor="kakao-payment">카카오페이</label>
                </div>
                <div className="pg-option">
                    <input
                        type="radio"
                        id="toss-payment"
                        name="pg-provider"
                        value="tosspay"
                        checked={pgProvider === "tosspay"}
                        onChange={(e) => setPgProvider(e.target.value)}
                    />
                    <label htmlFor="toss-payment">토스페이</label>
                </div>

                <button onClick={handlePayment}>결제하기</button>
            </div>
        </section>
    );
}

export default Payment;







