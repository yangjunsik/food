// src/components/Menu.js
import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get("/menu"); // api 인스턴스를 사용하여 요청
                setMenuItems(response.data);
            } catch (error) {
                setError("Failed to fetch menu items");
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu();
    }, []);

    return (
        <div>
            <h1>School Cafeteria Menu</h1>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <h2>{item.name}</h2>
                        <p>Price: {item.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Menu;






