import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/ChooseRestaurant.css"; // CSS 파일 연결

function ChooseRestaurant() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token"); // 세션 토큰 삭제
        alert("로그아웃 되었습니다.");
        navigate("/login"); // 로그인 페이지로 이동
    };

    return (
        <section className="ch-section">
            <div className="container">
                <h2>식당 선택</h2>

                <div className="restaurant-list">
                    {/* 공식당 */}
                    <Link to="/gongsikdang" className="restaurant">
                        <div className="restaurant-box official-dang" id="official-dang">
                            <h3>공식당</h3>
                        </div>
                    </Link>

                    {/* 카페테리아 첨성 */}
                    <Link to="/cafeteria" className="restaurant">
                        <div className="restaurant-box cafeteria-chumseong">
                            <h3>카페테리아 첨성</h3>
                        </div>
                    </Link>

                    {/* 정보센터식당 */}
                    <Link to="/infoRestaurant" className="restaurant">
                        <div className="restaurant-box infocenter-restaurant">
                            <h3>정보센터식당</h3>
                        </div>
                    </Link>
                </div>

                {/* 마이페이지 */}
                <div className="mypage">
                    <Link to="/mypage">
                        <div className="mypage-box">
                            <h3>마이페이지</h3>
                        </div>
                    </Link>
                </div>

                {/* 로그아웃 버튼 */}
                <div className="logout">
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            </div>
        </section>
    );
}

export default ChooseRestaurant;

