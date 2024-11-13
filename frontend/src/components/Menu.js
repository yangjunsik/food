// src/components/Menu.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        // Menu 데이터를 가져오는 함수
        const fetchMenu = async () => {
            try {
                const response = await axios.get("http://localhost:8080/menu", { withCredentials: true });
                setMenuItems(response.data); // 서버에서 받은 데이터 설정
            } catch (error) {
                setError("Failed to fetch menu items");
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu(); // 페이지 로딩 시 데이터 요청
    }, []);

    if (error) {
        return <div>An error occurred while fetching the menu.</div>;
    }

    return (
        <div>
            <h1>School Cafeteria Menu</h1>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <h2>{item.name}</h2>
                        <p>Price: {item.price}</p>
                        <img src={item.image} alt={item.name} width="100" />
                        <p>Number: {item.number}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Menu;



