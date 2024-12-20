import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import "./css/Cafeteria.css";

function Cafeteria() {
    const [menuItems, setMenuItems] = useState([]); // 메뉴 데이터
    const [cart, setCart] = useState([]); // 장바구니 데이터
    const [error, setError] = useState(null); // 에러 처리
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get("/menu/cafe", {
                    params: { restaurantName: "카페테리아 첨성" },
                });
                const updatedMenu = response.data.map((item) => ({
                    ...item,
                    name: item.name.trim(), // 공백 제거
                    price: Number(item.price), // price를 숫자로 변환
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

    const navigateToPayment = () => {
        navigate("/payment", { state: { cart: cart } });
    };

    return (
        <section className="cafe-section">
            <div className="cafe-restaurant">
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
                <h1>카페테리아 첨성 메뉴</h1>
                {error && <p className="error">{error}</p>}
                <ul className="menu-list">
                    {menuItems.map((item, index) => (
                        <li key={index} className="menu-item">
                            {/* 메뉴 이미지 */}
                            <img
                                src={`/images3/${item.name.replace(/\s/g, "")}.jpg`}
                                alt={item.name}
                                className="menu-item-image"
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                onError={(e) => (e.target.src = "/images3/default.jpg")} // 기본 이미지
                            />
                            {/* 메뉴 이름 */}
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
                                    onClick={() => handleAddToCart(item)}
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


export default Cafeteria;
