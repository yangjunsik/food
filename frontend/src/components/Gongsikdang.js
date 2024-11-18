import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';

function Gongsikdang() {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // 공식당 메뉴만 가져오기
                const response = await api.get("/menu", {
                    params: { restaurantName: "공식당" },
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
        <div>
            <h1>Official Cafeteria Menu</h1>
            {error && <p>{error}</p>}
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <h2>{item.name}</h2>
                        <p>Price: {item.price}원</p>
                        <p>Sector: {item.sector}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Gongsikdang;







