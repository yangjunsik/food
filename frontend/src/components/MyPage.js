import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import axios from "axios";
import "./css/MyPage.css";

function MyPage() {
    const [user, setUser] = useState({});
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate(); // useNavigate를 이용한 경로 이동 설정

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");

                if (!token) {
                    console.error("사용자 인증 토큰이 없습니다.");
                    return;
                }

                // 사용자 정보 가져오기
                const userResponse = await axios.get("/user/info", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("User Response:", userResponse.data);
                setUser(userResponse.data);

                // 구매 내역 가져오기
                const menuResponse = await axios.get("/menu", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Menu Response:", menuResponse.data);
                setPurchases(menuResponse.data);
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, []);

    const handleBarcodeClick = () => {
        navigate("/barcode"); // "/barcode" 경로로 이동
    };

    return (
        <div className="container">
            <header>
                <h1>마이페이지</h1>
            </header>
            <section className="profile">
                <div className="profile-header">
                    <h2>{user.name || "사용자"} 님</h2>
                    <p>
                        보유 포인트: <span id="points">{user.points || 0}</span>p
                    </p>
                </div>
            </section>
            <section className="purchase-history">
                <h3>나의 구매 내역</h3>
                <ul>
                    {purchases.map((purchase, index) => (
                        <li key={index}>
                            {purchase.restaurantName} - {purchase.sector} - {purchase.name} -{" "}
                            {purchase.price}원
                        </li>
                    ))}
                </ul>
            </section>
            <section className="actions">
                <button className="button action-button">포인트 충전</button>
                <button
                    className="button action-button"
                    onClick={handleBarcodeClick} // 클릭 시 BarcodePage로 이동
                >
                    구매 바코드 확인
                </button>
            </section>
        </div>
    );
}

export default MyPage;
