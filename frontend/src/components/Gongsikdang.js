import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // React Router 추가
import api from '../axiosConfig';
import './css/Gongsikdang.css'; // CSS 파일 import

function Gongsikdang() {
    const [menuItems, setMenuItems] = useState({ a: [], b: [], c: [], d: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get("/menu", {
                    params: { restaurantName: "공식당" },
                });

                const menuData = { a: [], b: [], c: [], d: [] };

                response.data.forEach((item) => {
                    if (item.sector === 'A') menuData.a.push(item);
                    if (item.sector === 'B') menuData.b.push(item);
                    if (item.sector === 'C') menuData.c.push(item);
                    if (item.sector === 'D') menuData.d.push(item);
                });

                setMenuItems(menuData);
            } catch (error) {
                setError("Failed to fetch menu items");
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu();
    }, []);

    return (
        <div className="container">
            <h2>코너 선택</h2>
            {error && <p className="error">{error}</p>}

            {/* 코너를 두 개씩 배치 */}
            <div className="grid">
                {/* 첫 번째 줄: A 코너와 B 코너 */}
                <div className="row">
                    <div className="zone">
                        <div className="zone-name">A 코너</div>
                        <div className="menu">
                            {menuItems.a.map((item, index) => (
                                <div key={index} className="menu-line">
                                    <span className="menu-name">{item.name}</span>
                                    <span className="menu-price">{item.price}원</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="zone">
                        <div className="zone-name">B 코너</div>
                        <div className="menu">
                            {menuItems.b.map((item, index) => (
                                <div key={index} className="menu-line">
                                    <span className="menu-name">{item.name}</span>
                                    <span className="menu-price">{item.price}원</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 두 번째 줄: C 코너와 D 코너 */}
                <div className="row">
                    <div className="zone">
                        <div className="zone-name">C 코너</div>
                        <div className="menu">
                            {menuItems.c.map((item, index) => (
                                <div key={index} className="menu-line">
                                    <span className="menu-name">{item.name}</span>
                                    <span className="menu-price">{item.price}원</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="zone">
                        <div className="zone-name">D 코너</div>
                        <div className="menu">
                            {menuItems.d.map((item, index) => (
                                <div key={index} className="menu-line">
                                    <span className="menu-name">{item.name}</span>
                                    <span className="menu-price">{item.price}원</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 네 개의 버튼 */}
            <div className="bottom-buttons">
                <Link to="/a-details" className="bottom-button">A 코너</Link>
                <Link to="/b-details" className="bottom-button">B 코너</Link>
                <Link to="/c-details" className="bottom-button">C 코너</Link>
                <Link to="/d-details" className="bottom-button">D 코너</Link>
            </div>
        </div>
    );
}

export default Gongsikdang;
