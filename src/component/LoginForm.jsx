import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice.ts';
import { login } from '../store/loginSlice.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './Input.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function LoginForm() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginResponse = await loginUser(email, password);
            dispatch(login());
            dispatch(setUser({
                memberId: loginResponse.memberId,
                nickname: loginResponse.nickname,
                email: loginResponse.email,
                goalTime: loginResponse.goalTime,
                todayTime: loginResponse.todayTime,
            }));
            await Swal.fire({
                icon: "success",
                title: "로그인 성공",
                timer: 1200,
                showConfirmButton: false,
            });
            navigate("/");
        } catch (error) {
            console.error('Login error:', error);
            if (error.message === 'Invalid email or password') {
                Swal.fire({
                    icon: "error",
                    title: "로그인 실패",
                    text: "이메일 또는 비밀번호가 올바르지 않습니다.",
                    timer: 1200,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "로그인 오류",
                    text: "예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.",
                    timer: 1200,
                    showConfirmButton: false,
                });
            }
            setPassword(''); // Reset password input
        }
    };

    const handleMouseDown = () => setShowPassword(true);
    const handleMouseUp = () => setShowPassword(false);

    return (
        <div className='login-form'>
            <form onSubmit={handleLogin}>
                <div className="input-wrapper">
                    <label>이메일</label><br />
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-wrapper">
                    <label>비밀번호</label><br />
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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