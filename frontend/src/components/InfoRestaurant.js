import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import "./css/Cafeteria.css";

function Cafeteria() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get("/menu/cafe", {
                    params: { restaurantName: "카페테리아 첨성" },
                const response = await api.get("/menu/info", {
                    params: { restaurantName: "정보센터식당"}
                });
                const updatedMenu = response.data.map((item) => ({
                    ...item,
                    price: item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원", // 단위 추가
                    quantity: 1, // 기본 수량 초기화
                }));
                setMenuItems(updatedMenu);
            } catch (error) {
                setError("Failed to fetch menu items");
                console.error("Error fetching menu:", error);
            }
        };

        fetchMenu();
    }, []);

    const handleAddToCart = (item) => {
        const existingItem = cart.find((cartItem) => cartItem.name === item.name);
        if (existingItem) {
            setCart(
                cart.map((cartItem) =>
                    cartItem.name === item.name
                        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                        : cartItem
                )
            );
        } else {
            setCart([...cart, { ...item }]);
        }

        // 장바구니에 추가 후 메뉴 수량 초기화
        setMenuItems(
            menuItems.map((menuItem) =>
                menuItem.name === item.name ? { ...menuItem, quantity: 1 } : menuItem
            )
        );
    };

    const handleQuantityChange = (item, delta) => {
        setMenuItems(
            menuItems.map((menuItem) =>
                menuItem.name === item.name
                    ? {
                        ...menuItem,
                        quantity: Math.max(1, (menuItem.quantity || 1) + delta),
                    }
                    : menuItem
            )
        );
    };

    const handleRemoveFromCart = (itemName) => {
        setCart(cart.filter((cartItem) => cartItem.name !== itemName));
    };

    const clearCart = () => {
        setCart([]);
    };

    const navigateToPayment = () => {
        navigate("/payment", { state: { cart } });
    };

    return (
        <div className="cafeteria-container">
            <header className="cafeteria-header">
                <h1>카페테리아 첨성</h1>
            </header>
            <div className="cafeteria-content">
                <div className="menu-grid">
                    {menuItems.map((item, index) => (
                        <div key={index} className="menu-item">
                            <div className="menu-text">
                                <span className="menu-name">{item.name}</span>
                                <span className="menu-price">{item.price}</span>
                            </div>
                            <div className="quantity-controls">
                                <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                                <span>{item.quantity || 1}</span>
                                <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                            </div>
                            <button
                                className="add-to-cart-button"
                                onClick={() => handleAddToCart(item)}
                            >
                                담기
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-section">
                    <ul className="cart-items">
                        {cart.map((cartItem, index) => (
                            <li key={index} className="cart-item">
                                <span className="cart-item-name">{cartItem.name}</span>
                                <span className="cart-item-quantity">{cartItem.quantity}개</span>
                                <span className="cart-item-price">
                                    {`${parseInt(cartItem.price.replace(/[^\d]/g, '')) * cartItem.quantity}원`}
                                </span>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => handleRemoveFromCart(cartItem.name)}
                                >
                                    ✖
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button className="clear-button" onClick={clearCart}>
                        전체 삭제
                    </button>
                    <button className="payment-button" onClick={navigateToPayment}>
                        결제하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cafeteria;
