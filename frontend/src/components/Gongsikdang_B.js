import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // navigate 사용
import api from "../axiosConfig";
import "./css/InfoRestaurant.css";

function InfoRestaurant() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // navigate 선언

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get("/menu/info/b", {
                    params: { sector: "B" }
                });
                console.log("Fetched Menu Data:", response.data); // 데이터 확인
                const updatedMenu = response.data.map((item) => ({
                    ...item,
                    name: item.name.trim(), // 공백 제거
                    price: Number(item.price), // 숫자로 변환
                    quantity: 1 // 기본 수량 초기화
                }));
                setMenuItems(updatedMenu);
            } catch (error) {
                setError("Failed to fetch menu items");
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu();
    }, []);

    const handleAddToCart = (item, quantity) => {
        if (quantity < 1) return;
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.name === item.name
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity }]);
        }
    };

    const handleQuantityChange = (item, delta) => {
        setMenuItems(menuItems.map(menuItem =>
            menuItem.name === item.name
                ? { ...menuItem, quantity: Math.max(1, (menuItem.quantity || 1) + delta) }
                : menuItem
        ));
    };

    const handleRemoveFromCart = (itemName) => {
        setCart(cart.filter(cartItem => cartItem.name !== itemName));
    };

    const navigateToPayment = () => {
        navigate("/payment", {
            state: { cart: cart }
        });
    };

    return (
        <section className="info-section">
            <div className="info-restaurant">
                <h1>공식당 B코너 메뉴</h1>
                {error && <p className="error">{error}</p>}
                <ul className="menu-list">
                    {menuItems.map((item, index) => (
                        <li key={index} className="menu-item">
                            {/* 메뉴 이미지 */}
                            <img
                                src={`/images2/${item.name.replace(/\s/g, "")}.PNG`}
                                alt={item.name}
                                className="menu-item-image"
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                onError={(e) => (e.target.src = "/images2/default.png")} // 기본 이미지
                            />
                            {/* 메뉴 이름 */}
                            <h3 className="menu-item-name">{item.name}</h3>
                            <div className="menu-item-details">
                                <p>가격: {item.price}원</p> {/* 수정된 부분 */}
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                                    <span>{item.quantity || 1}</span>
                                    <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                                </div>
                                <button
                                    className="add-to-cart-button"
                                    onClick={() => handleAddToCart(item, item.quantity || 1)}
                                >
                                    담기
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {cart.length > 0 && (
                    <div className="cart-summary">
                        <h2>장바구니</h2>
                        <ul>
                            {cart.map((cartItem, index) => (
                                <li key={index} className="cart-item">
                                    <span className="cart-item-name">{cartItem.name}</span>
                                    <span className="cart-item-quantity">{cartItem.quantity}개</span>
                                    <span className="cart-item-price">
                                        {cartItem.price * cartItem.quantity}원
                                    </span>
                                    <button
                                        className="remove-from-cart-button"
                                        onClick={() => handleRemoveFromCart(cartItem.name)}
                                    >
                                        ✖
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="navigate-to-payment-button"
                            onClick={navigateToPayment}
                        >
                            결제창으로 이동
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default InfoRestaurant;
