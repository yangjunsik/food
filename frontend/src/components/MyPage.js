import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

function MyPage() {
    const [purchases, setPurchases] = useState([]); // 구매 내역
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: "http://localhost:8080",
    });

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const purchaseResponse = await api.get("/api/purchases", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPurchases(purchaseResponse.data);
            } catch (error) {
                console.error("구매 내역 로드 실패:", error);
            }
        };

        fetchPurchases();
    }, []);


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
            <header>
                <h1>마이페이지</h1>
            </header>
            <section className="purchase-history">
                <h3>나의 구매 내역</h3>
                <ul>
                    {purchases.map((purchase, index) => (
                        <li key={index}>
                            <a
                                onClick={() => handleBarcodeClick(purchase)}
                                style={{cursor: "pointer", textDecoration: "underline"}}
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





