import React from 'react';
import camsterLogo from '../../camster-logo-landscape.png';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/loginSlice.ts';
import { resetUser } from '../../store/userSlice.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';

function NavBar(props) {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    function handleLoginButton() {
        navigate("/login");
    }
    function handleLogoutButton() {
        dispatch(logout());
        dispatch(resetUser());
    }

    return (
        <nav className="navbar-custom">
            <div className="navbar-logo">
                <img
                    src={camsterLogo}
                    alt="Camster logo"
                    className="navbar-logo-img"
                    onClick={() => { navigate("/") }}
                />
            </div>
            <div className="navbar-links">
                {isLoggedIn ? (
                    <>
                        <span onClick={()=>{navigate("/mypage")}} className="navbar-span navbar-username">{user.nickname}</span>
                        <span className="navbar-span">님</span>
                        <button onClick={handleLogoutButton} className="mybtn yellow rounded">로그아웃</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => { navigate("/register") }} className="mybtn yellow rounded">회원가입</button>
                        <button onClick={handleLoginButton} className="mybtn red rounded">로그인</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
