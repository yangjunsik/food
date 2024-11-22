import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import "./css/BarcodePage.css";

function BarcodePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, merchantUid } = location.state || { cart: [], merchantUid: null };

    const [barcodes, setBarcodes] = useState([]);

    useEffect(() => {
        if (!merchantUid) {
            alert("잘못된 접근입니다.");
            navigate("/mypage");
            return;
        }

        // 바코드 생성
        const generateBarcodes = () => {
            return cart.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                merchantUid: `${merchantUid}_${item.name}`,
                expiration: Date.now() + 2 * 60 * 60 * 1000, // 유효시간: 2시간
            }));
        };

        setBarcodes(generateBarcodes());
    }, [cart, merchantUid, navigate]);

    return (
        <div className="container">
            <header>
                <h1>바코드 확인</h1>
            </header>
            <section id="barcode-section">
                <h2>바코드</h2>
                {barcodes.map((barcode, index) => {
                    const isExpired = Date.now() > barcode.expiration;
                    return (
                        <div key={index} className="barcode-item">
                            <p>{barcode.name}</p>
                            {!isExpired ? (
                                <svg ref={(el) => JsBarcode(el, barcode.merchantUid, { format: "CODE128" })}></svg>
                            ) : (
                                <p className="expired">바코드 만료 (2시간 초과)</p>
                            )}
                        </div>
                    );
                })}
            </section>
        </div>
    );
}

export default BarcodePage;



