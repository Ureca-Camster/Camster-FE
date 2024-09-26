import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice.ts';
import { login } from '../store/loginSlice.ts';
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

    function handleLoginTest() {
        dispatch(login());
        dispatch(setUser({
            nickname: '홍길동', 
            email: 'hong@ureca.com',
            goalTime: 10000,
            todayTime: 8000,
        }));
        navigate("/");
    }

    const loginUser = async (email, memberPassword) => {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    memberPassword
                }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Login failed:', error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginResponse = await loginUser(email, password);
        if (loginResponse) {
            dispatch(login());
            dispatch(setUser({
                memberId: loginResponse.memberId,
                nickname: loginResponse.nickname,
                email: loginResponse.email,
                goalTime: loginResponse.goalTime,
                todayTime: loginResponse.todayTime,
            }));
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
            <form onSubmit={handleLoginTest}>
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