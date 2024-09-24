import React from 'react';
import camsterLogo from '../camster-logo-landscape.png';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/loginSlice.ts';
import { resetUser, setUser } from '../store/userSlice.ts';

function NavBar(props) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    function handleLoginButton() {
        fetch('http://localhost:8080/members/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'hong@ureca.com',
                password: 'password123' // 실제 비밀번호 입력
            })
        })
        .then(response => response.json())
        .then(data => {
            // 로그인 성공 시 Redux에 사용자 정보를 저장
            console.log("Login data:", data);  // 로그인 성공 시 데이터를 출력
            dispatch(login());
            dispatch(setUser({
                memberid: data.memberid,  // member_id 저장
                nickname: data.nickname,
                email: data.email,
                goalTime: data.goalTime,
                todayTime: data.todayTime,
            }));
        })
        .catch(error => {
            console.error("Login failed:", error);
        });
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
                        <span onClick={() => { navigate("/mypage") }} className="navbar-span navbar-username">{user.nickname}</span>
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
