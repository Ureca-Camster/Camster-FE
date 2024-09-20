import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../store/loginSlice.ts';
import { setUser } from '../store/userSlice.ts';

function MyPage(props) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
    const user = useSelector((state) => state.user);

    const [nickname, setNickname] = useState('');
    const [goalTime, setGoalTime] = useState('');
    const [todayTime, setTodayTime] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Set initial values from user state
    useEffect(() => {
        if (user) {
            setNickname(user.nickname);
            setGoalTime(user.goalTime);
            setTodayTime(user.todayTime);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch the login action with the updated values
        dispatch(login());
        dispatch(setUser({
            nickname,
            email: user.email, // Keep the original email
            goalTime,
            todayTime,
        }));
        // Handle password update separately if needed
        if (newPassword && newPassword === confirmPassword) {
            // Perform password update logic here
            alert("Update password to: " + newPassword);
        } else if (newPassword || confirmPassword) {
            alert("Passwords do not match!");
        }
        // Reset the password fields
        setNewPassword('');
        setConfirmPassword('');
    };

    return (<>
        {isLoggedIn ? (
            <div className='modify-form'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>닉네임:</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>이메일:</label>
                        <input
                            type="email"
                            value={user.email}
                            readOnly
                        />
                    </div>
                    <div>
                        <label>목표 학습 시간:</label>
                        <input
                            type="number"
                            value={goalTime}
                            onChange={(e) => setGoalTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>오늘 학습 시간:</label>
                        <input
                            type="number"
                            value={todayTime}
                            onChange={(e) => setTodayTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>비밀번호 수정:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>비밀번호 수정 확인:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button className="mybtn skyblue rounded" type="submit">수정 완료</button>
                </form>
            </div>
        ) : (
            <p>로그인되지 않음</p>
        )}</>
    );
}

export default MyPage;