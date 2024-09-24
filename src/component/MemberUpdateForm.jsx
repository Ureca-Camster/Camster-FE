// MemberUpdateForm.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice.ts';
import { login } from '../store/loginSlice.ts';

function MemberUpdateForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [nickname, setNickname] = useState('');
    const [goalTime, setGoalTime] = useState('');
    const [todayTime, setTodayTime] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');

    // Set initial values from user state
    useEffect(() => {
        if (user) {
            setNickname(user.nickname);
            setGoalTime(user.goalTime);
            setTodayTime(user.todayTime);
        }
    }, [user]);

    // Handle real-time password matching
    useEffect(() => {
        if (confirmPassword) {
            if (newPassword === confirmPassword) {
                setPasswordMatchMessage('비밀번호가 일치합니다.');
            } else {
                setPasswordMatchMessage('비밀번호가 일치하지 않습니다.');
            }
        } else {
            setPasswordMatchMessage('');
        }
    }, [newPassword, confirmPassword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch the login action with the updated values
        dispatch(login());
        dispatch(
            setUser({
                nickname,
                email: user.email, // Keep the original email
                goalTime,
                todayTime,
            })
        );

        // Reset the password fields after processing if needed
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className='modify-form'>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>닉네임</label><br />
                    <input
                        type='text'
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>이메일</label><br />
                    <input type='email' value={user.email} readOnly />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>목표 학습 시간</label><br />
                    <input
                        type='number'
                        value={goalTime}
                        onChange={(e) => setGoalTime(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>오늘 학습 시간</label><br />
                    <input
                        type='number'
                        value={todayTime}
                        onChange={(e) => setTodayTime(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>비밀번호 수정</label><br />
                    <input
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>비밀번호 수정 확인</label><br />
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordMatchMessage && (
                        <p
                            style={{
                                backgroundColor:
                                    newPassword === confirmPassword ? 'green' : 'red',
                                color: 'white',
                                padding: '5px',
                                borderRadius: '4px',
                                marginTop: '5px',
                            }}
                        >
                            {passwordMatchMessage}
                        </p>
                    )}
                </div>
                <button className='mybtn skyblue rounded' type='submit' style={{ marginLeft: '0px' }}>
                    수정 완료
                </button>
            </form>
        </div>
    );
}

export default MemberUpdateForm;
