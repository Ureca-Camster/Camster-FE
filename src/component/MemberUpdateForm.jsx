import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './Input.css';

function MemberUpdateForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [nickname, setNickname] = useState('');
    const [goalTime, setGoalTime] = useState('');
    const [todayTime, setTodayTime] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setNickname(user.nickname);
            setGoalTime(user.goalTime);
            setTodayTime(user.todayTime);
        }
    }, [user]);

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
        dispatch(
            setUser({
                nickname,
                email: user.email,
                goalTime,
                todayTime,
            })
        );
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleTogglePassword = (field) => {
        if (field === 'new') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirm') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className='modify-form'>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <label>닉네임</label><br />
                    <input
                        type='text'
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <label>이메일</label><br />
                    <input type='email' value={user.email} readOnly />
                </div>
                <div className="input-wrapper">
                    <label>목표 학습 시간</label><br />
                    <input
                        type='number'
                        value={goalTime}
                        onChange={(e) => setGoalTime(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <label>오늘 학습 시간</label><br />
                    <input
                        type='number'
                        value={todayTime}
                        onChange={(e) => setTodayTime(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <label>비밀번호 수정</label><br />
                    <div className="password-input-wrapper">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <FontAwesomeIcon 
                            icon={faEye}
                            onMouseDown={() => handleTogglePassword('new')}
                            onMouseUp={() => handleTogglePassword('new')}
                            onMouseLeave={() => setShowNewPassword(false)}
                            className="password-toggle"
                        />
                    </div>
                </div>
                <div className="input-wrapper" style={{marginBottom: '2px'}}>
                    <label>비밀번호 수정 확인</label><br />
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <FontAwesomeIcon 
                            icon={faEye}
                            onMouseDown={() => handleTogglePassword('confirm')}
                            onMouseUp={() => handleTogglePassword('confirm')}
                            onMouseLeave={() => setShowConfirmPassword(false)}
                            className="password-toggle"
                        />
                    </div>
                    <div className={
                        `password-match-message ${newPassword === confirmPassword ? 'match' : 'mismatch'}
                        ${passwordMatchMessage === '' ? 'nonexist' : 'exist'}`}>
                        {passwordMatchMessage}
                    </div>
                </div>
                <button className='mybtn skyblue rounded' type='submit'>
                    수정 완료
                </button>
            </form>
        </div>
    );
}

export default MemberUpdateForm;