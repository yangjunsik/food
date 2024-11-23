import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import "./css/InfoRestaurant.css";

function InfoRestaurant() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get("/menu/info/a", {
                    params: { sector: "A" }
                });
                const updatedMenu = response.data.map((item) => ({
                    ...item,
                    name: item.name.trim(),
                    price: Number(item.price),
                    quantity: 1
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
                {/* 상단 버튼 영역 */}
                <div className="top-buttons">
                    {/* 뒤로 버튼 */}
                    <button
                        className="top-button back-button"
                        onClick={() => navigate(-1)} // 이전 페이지로 이동
                    >
                        뒤로
                    </button>

                    {/* 홈 버튼 */}
                    <button
                        className="top-button home-button"
                        onClick={() => navigate('/chooseRestaurant')} // ChooseRestaurant.js로 이동
                    >
                        홈
                    </button>
                </div>
                <h1>공식당 A코너 메뉴</h1>
                {error && <p className="error">{error}</p>}
                <ul className="menu-list">
                    {menuItems.map((item, index) => (
                        <li key={index} className="menu-item">
                            <img
                                src={`/images2/${item.name.replace(/\s/g, "")}.PNG`}
                                alt={item.name}
                                className="menu-item-image"
                                style={{width: "100px", height: "100px", objectFit: "cover"}}
                                onError={(e) => (e.target.src = "/images2/default.png")}
                            />
                            <h3 className="menu-item-name">{item.name}</h3>

                            <div className="menu-item-details">
                                <p>가격: {item.price}원</p>
                                {/* 남은 수량 표시 */}
                                <p>남은 수량: {item.number || 0}개</p>
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
