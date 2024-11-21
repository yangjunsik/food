import React, { useState } from "react";
import "./css/BarcodePage.css";

function BarcodePage() {
    const [selectedItem, setSelectedItem] = useState(null);

    const showBarcode = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="container">
            <header>
                <h1>바코드 확인</h1>
            </header>
            <section className="purchase-history">
                <h3>나의 구매 내역</h3>
                <ul>
                    <li>
                        <a href="#" onClick={() => showBarcode("돈까스 마요")}>
                            2024-11-10 - 돈까스 마요 - 5,000원
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => showBarcode("뚝배기알밥")}>
                            2024-11-08 - 뚝배기알밥 - 5,000원
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => showBarcode("떡라면")}>
                            2024-11-06 - 떡라면 - 3,000원
                        </a>
                    </li>
                </ul>
            </section>
            {selectedItem && (
                <section id="barcode-section">
                    <h3>구매 바코드</h3>
                    <p id="selected-item">{selectedItem}</p>
                    <img
                        id="barcode-image"
                        src="https://via.placeholder.com/150x50.png?text=Barcode"
                        alt="바코드 이미지"
                    />
                </section>
            )}
        </div>
    );
}

export default BarcodePage;
