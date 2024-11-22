import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

function MyPage() {
    const [purchases, setPurchases] = useState([]);
    const [points, setPoints] = useState(0); // 사용자 포인트 상태
    const [depositAmount, setDepositAmount] = useState(""); // 적립할 금액 입력
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");

                // 구매 내역 가져오기
                const purchaseResponse = await axios.get("http://localhost:8080/api/purchases", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPurchases(purchaseResponse.data);

                // 사용자 포인트 가져오기
                const pointsResponse = await axios.get("http://localhost:8080/api/points", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPoints(pointsResponse.data.points);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };

        fetchData();
    }, []);

    const handleDeposit = () => {
        const IMP = window.IMP; // 아임포트 객체
        IMP.init("imp17808248"); // 아임포트 고유 가맹점 코드

        const merchantUid = `mid_${new Date().getTime()}`; // 유니크한 주문번호 생성
        const paymentData = {
            pg: "kakaopay", // 결제 시스템 (토스페이도 가능)
            pay_method: "card",
            merchant_uid: merchantUid,
            name: "포인트 적립",
            amount: parseInt(depositAmount, 10), // 적립 금액
            buyer_email: "user@example.com", // 사용자 이메일
            buyer_name: "테스터",
            buyer_tel: "010-1234-5678",
            buyer_addr: "서울특별시 강남구",
            buyer_postcode: "123-456",
        };

        IMP.request_pay(paymentData, async (response) => {
            if (response.success) {
                try {
                    const token = sessionStorage.getItem("token");
                    await axios.post(
                        "http://localhost:8080/api/points/deposit",
                        { amount: parseInt(depositAmount, 10) }, // 적립 금액 전달
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    alert(`${depositAmount}원이 적립되었습니다.`);
                    setPoints(points + parseInt(depositAmount, 10)); // 적립 후 포인트 갱신
                    setDepositAmount(""); // 입력 초기화
                } catch (error) {
                    console.error("포인트 적립 실패:", error);
                    alert("포인트 적립 중 오류가 발생했습니다.");
                }
            } else {
                alert(`결제 실패: ${response.error_msg}`);
            }
        });
    };

    return (
        <div className="container">
            <header>
                <h1>마이페이지</h1>
            </header>
            <section className="user-info">
                <h3>보유 포인트: {points}원</h3>
                <div className="deposit-section">
                    <input
                        type="number"
                        placeholder="적립할 금액 입력"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                    />
                    <button onClick={handleDeposit}>포인트 적립</button>
                </div>
            </section>
            <section className="purchase-history">
                <h3>나의 구매 내역</h3>
                <ul>
                    {purchases.map((purchase, index) => (
                        <li key={index}>
                            <a
                                onClick={() => navigate("/barcode", { state: purchase })}
                                style={{ cursor: "pointer", textDecoration: "underline" }}
                            >
                                {purchase.date} - 주문번호: {purchase.merchantUid} - 총 {purchase.items.length}개
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default MyPage;


