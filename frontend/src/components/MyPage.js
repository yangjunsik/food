import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

function MyPage() {
    const [purchases, setPurchases] = useState([]); // 구매 내역
    const [pointBalance, setPointBalance] = useState(0); // 사용자 포인트
    const [chargeAmount, setChargeAmount] = useState(""); // 충전 금액 입력
    const navigate = useNavigate();

    // 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");

                // 사용자 포인트 정보 가져오기
                const pointResponse = await axios.get("http://localhost:8080/api/points", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Point API Response:", pointResponse.data); // 응답 확인용 로그
                setPointBalance(pointResponse.data.points || 0); // null 또는 undefined일 경우 기본값 0

                // 구매 내역 가져오기
                const purchaseResponse = await axios.get("http://localhost:8080/api/purchases", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPurchases(purchaseResponse.data);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };

        fetchData();
    }, []);

    // 포인트 충전
    const handleChargePoints = async () => {
        const IMP = window.IMP;
        IMP.init("imp17808248"); // 아임포트 상점 키 (테스트 키 사용)

        if (!chargeAmount || isNaN(chargeAmount) || chargeAmount <= 0) {
            alert("유효한 금액을 입력해주세요.");
            return;
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        // 아임포트 결제 데이터
        const paymentData = {
            pg: "kakaopay", // 결제 방식 (카카오페이)
            pay_method: "card", // 결제 수단
            merchant_uid: `charge_${new Date().getTime()}`, // 고유 주문번호
            name: "포인트 충전",
            amount: chargeAmount, // 충전 금액
            buyer_email: "test@example.com", // 테스트용 이메일
            buyer_name: "테스터", // 테스트용 이름
            buyer_tel: "010-1234-5678", // 테스트용 전화번호
            buyer_addr: "서울특별시 강남구", // 테스트용 주소
            buyer_postcode: "123-456", // 테스트용 우편번호
        };

        IMP.request_pay(paymentData, async (response) => {
            if (response.success) {
                try {
                    // 포인트 충전 요청
                    await axios.post(
                        "http://localhost:8080/api/points/charge",
                        { amount: chargeAmount },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    const bonus = chargeAmount >= 100000 ? Math.floor(chargeAmount * 0.1) : 0;
                    const totalCharged = parseInt(chargeAmount) + bonus;

                    alert(`포인트 충전 완료! ${bonus > 0 ? `추가 ${bonus} 포인트 지급!` : ""}`);
                    setPointBalance((prev) => prev + totalCharged); // 화면 갱신
                    setChargeAmount(""); // 입력 필드 초기화
                } catch (error) {
                    console.error("포인트 충전 실패:", error);
                    alert("포인트 충전 중 오류가 발생했습니다.");
                }
            } else {
                alert(`결제 실패: ${response.error_msg}`);
            }
        });
    };

    // 구매 내역 클릭 시 바코드 화면으로 이동
    const handleBarcodeClick = (purchase) => {
        navigate("/barcode", {
            state: {
                cart: purchase.items,
                merchantUid: purchase.merchantUid,
            },
        });
    };

    return (
        <div className="container">
            <header>
                <h1>마이페이지</h1>
            </header>
            <section className="point-section">
                <h2>내 포인트</h2>
                <p>현재 포인트: {pointBalance}원</p> {/* pointBalance 값 표시 */}
                <div className="charge-form">
                    <input
                        type="number"
                        placeholder="충전할 금액 입력"
                        value={chargeAmount}
                        onChange={(e) => setChargeAmount(e.target.value)}
                    />
                    <button onClick={handleChargePoints}>충전</button>
                </div>
            </section>
            <section className="purchase-history">
                <h3>나의 구매 내역</h3>
                <ul>
                    {purchases.map((purchase, index) => (
                        <li key={index}>
                            <a
                                onClick={() => handleBarcodeClick(purchase)}
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





