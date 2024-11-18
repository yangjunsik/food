import React from "react";
import { Link } from "react-router-dom";
import "./css/ChooseRestaurant.css"; // CSS 파일 연결

function ChooseRestaurant() {
    return (
        <div className="container">
            <h2>식당을 선택하세요</h2>

            <div className="restaurant-list">
                {/* 공식당 */}
                <Link to="/gongsikdang" className="restaurant">
                    <div className="restaurant-box official-dang" id="official-dang">
                        <h3>공식당</h3>
                    </div>
                </Link>

                {/* 카페테리아 첨성 */}
                <Link to="/cafeteria-chumseong" className="restaurant">
                    <div className="restaurant-box cafeteria-chumseong">
                        <h3>카페테리아 첨성</h3>
                    </div>
                </Link>

                {/* 정보센터식당 */}
                <Link to="/infocenter-restaurant" className="restaurant">
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
        </div>
    );
}

export default ChooseRestaurant;
