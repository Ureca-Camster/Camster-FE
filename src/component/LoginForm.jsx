import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice.ts';
import { login } from '../store/loginSlice.ts';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './Input.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('/members/login', {
                email,
                memberPassword: password
            });
            return response.status === 200;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('/members');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            return null;
        }
    };

    function handleLoginButton() {
        dispatch(login());
        dispatch(setUser({
            nickname: '홍길동', 
            email: 'hong@ureca.com',
            goalTime: 10000,
            todayTime: 8000,
        }));
        navigate("/");
    }
    
    const handleLogin = async (e) => {
        e.preventDefault();
        const loginSuccess = await loginUser(email, password);
        if (loginSuccess) {
            dispatch(login());
            const userInfo = await fetchUserInfo();
            if (userInfo) {
                dispatch(setUser({
                    nickname: userInfo.nickname,
                    email: userInfo.email,
                    goalTime: userInfo.goalTime,
                    todayTime: userInfo.todayTime,
                }));
            }
            navigate("/");
        } else {
            console.log('Login failed');
            setPassword(''); // Reset password input
        }
    };

    const handleMouseDown = () => setShowPassword(true);
    const handleMouseUp = () => setShowPassword(false);

    return (
        <div className='login-form'>
            <form onSubmit={handleLoginButton}>
                <div className="input-wrapper">
                    <label>이메일</label><br />
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <label>비밀번호</label><br />
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FontAwesomeIcon 
                            icon={faEye}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="password-toggle"
                        />
                    </div>
                </div>
                
                <button className='mybtn skyblue rounded' type='submit' style={{ marginLeft: '0px' }}>
                    로그인
                </button>
            </form>
        </div>
    );
}

export default LoginForm;