import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice.ts';
import { login } from '../store/loginSlice.ts';
import axios from 'axios';

function MemberUpdateForm() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginSuccess = await loginUser(email, password);
        if (loginSuccess) {
            dispatch(login());
            const userInfo = await fetchUserInfo();
            if (userInfo) {
                // Update Redux store with user info
                dispatch(setUser({
                    nickname: userInfo.nickname,
                    email: userInfo.email,
                    goalTime: userInfo.goalTime,
                    todayTime: userInfo.todayTime,
                }));
            }
        } else {
            // Handle login failure (e.g., show an error message)
            console.log('Login failed');
        }
    };

    return (
        <div className='modify-form'>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>이메일</label><br />
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>비밀번호</label><br />
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button className='mybtn skyblue rounded' type='submit' style={{ marginLeft: '0px' }}>
                    로그인
                </button>
            </form>
        </div>
    );
}

export default MemberUpdateForm;