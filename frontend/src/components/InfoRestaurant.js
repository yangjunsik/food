import React, { useEffect, useState } from "react";
import api from "../axiosConfig"; // API 설정 파일 import
import "./css/InfoRestaurant.css"; // CSS 파일 연결

function InfoRestaurant() {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // '정보센터식당' 메뉴 데이터 가져오기
                const response = await api.get("/menu/info", {
                    params: { restaurantName: "정보센터식당" }
                });
                setMenuItems(response.data);
            } catch (error) {
                setError("Failed to fetch menu items");
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu();
    }, []);

    return (
        <div className="info-restaurant">
            <h1>정보센터식당 메뉴</h1>
            {error && <p className="error">{error}</p>}
            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        <h2>{item.name}</h2>
                        <p>Price: {item.price}원</p>
                        <p>Quantity: {item.number}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InfoRestaurant;
