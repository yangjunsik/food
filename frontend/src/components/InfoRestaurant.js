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
        // 결제 페이지로 이동하면서 상태 전달
        navigate("/payment", {
            state: { cart: cart }
        });
    };

    return (
        <section className="info-section">
            <div className="info-restaurant">
                <h1>정보센터식당 메뉴</h1>
                {error && <p className="error">{error}</p>}
                <ul className="menu-list">
                    {menuItems.map((item, index) => (
                        <li key={index} className="menu-item">
                            <img src={item.image} alt={item.name} className="menu-item-image" />
                            <div className="menu-item-details">
                                <h2>{item.name}</h2>
                                <p>Price: {item.price}원</p>
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
                        <h2>선택한 메뉴</h2>
                        <ul>
                            {cart.map((cartItem, index) => (
                                <li key={index} className="cart-item">
                                    {cartItem.name} - {cartItem.quantity}개 - {cartItem.price * cartItem.quantity}원
                                    <button
                                        className="remove-from-cart-button"
                                        onClick={() => handleRemoveFromCart(cartItem.name)}
                                    >
                                        -
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="navigate-to-payment-button" onClick={navigateToPayment}>
                            결제창으로 이동
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default InfoRestaurant;



