import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/MyPage.css";

function MyPage() {
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const purchaseResponse = await axios.get("http://localhost:8080/api/purchases", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPurchases(purchaseResponse.data);
            } catch (error) {
                console.error("구매 내역 로드 실패:", error);
            }
        };

        fetchPurchases();
    }, []);

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

