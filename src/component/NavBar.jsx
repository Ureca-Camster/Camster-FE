import React from 'react';
import camsterLogo from '../camster-logo-landscape.png';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

function NavBar(props) {
    const isLoggedIn = false;
    const navigate = useNavigate();
    function handleLoginButton() {
        navigate("/login");
    }

    return (
        <nav className="navbar-custom">
            <div className="navbar-logo">
                <img
                    src={camsterLogo}
                    alt="Camster logo"
                    className="navbar-logo-img"
                />
            </div>
            <div className="navbar-links">
                {isLoggedIn ? (
                    <>
                        <a href="mypage" className="navbar-username">닉네임</a>
                        <span className="navbar-username">님</span>
                        <button href="#" class="mybtn yellow rounded">로그아웃</button>
                    </>
                ) : (
                    <button onClick={handleLoginButton} class="mybtn red rounded">로그인</button>
                )}
            </div>
        </nav>
    );
}

export default NavBar;