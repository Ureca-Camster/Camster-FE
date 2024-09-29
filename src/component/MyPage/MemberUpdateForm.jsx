import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/userSlice.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import '../Input.css';
import Swal from 'sweetalert2';

function MemberUpdateForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [nickname, setNickname] = useState('');
    const [goalHours, setGoalHours] = useState('');
    const [goalMinutes, setGoalMinutes] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        if (user) {
            setNickname(user.nickname);
            // Convert seconds to hours and minutes
            const totalMinutes = Math.floor(user.goalTime / 60);
            setGoalHours(Math.floor(totalMinutes / 60).toString());
            setGoalMinutes((totalMinutes % 60).toString());
        }
    }, [user]);

    useEffect(() => {
        if (newPassword || confirmPassword) {
            if (newPassword === confirmPassword) {
                setPasswordMatchMessage('비밀번호가 일치합니다.');
                setIsFormValid(true);
            } else {
                setPasswordMatchMessage('비밀번호가 일치하지 않습니다.');
                setIsFormValid(false);
            }
        } else {
            setPasswordMatchMessage('');
            setIsFormValid(true);  // Form is valid even without password change
        }
    }, [newPassword, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid) {
            // Convert hours and minutes to seconds
            const goalTimeInSeconds = (parseInt(goalHours) * 3600) + (parseInt(goalMinutes) * 60);

            dispatch(
                setUser({
                    memberId: user.memberId,
                    nickname: nickname,
                    email: user.email,
                    goalTime: goalTimeInSeconds,
                    todayTime: user.todayTime
                })
            );

            try {
                const response = await fetch('/members', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nickname: nickname,
                        memberPassword: newPassword,
                        goalTime: goalTimeInSeconds
                    }),
                });

                if(response.ok) {
                    setNewPassword('');
                    setConfirmPassword('');
        
                    Swal.fire({
                        title: "수정 완료!",
                        icon: "success",
                        timer: 1200,
                        showConfirmButton: false
                    })
                }
            } catch (error) {
                console.error('Error updating member:', error);
                Swal.fire({
                    text: '업데이트 중 오류가 발생했습니다.',
                    icon: "error",
                    timer: 1200,
                    showConfirmButton: false
                })
            }
        } else {
            confirmPasswordRef.current.focus();
        }
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
                        required
                    />
                </div>
                <div className="input-wrapper">
                    <label>이메일</label><br />
                    <input type='email' value={user.email} readOnly />
                </div>
                <div className="input-wrapper">
                    <label>목표 학습 시간</label><br />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type='number'
                            value={goalHours}
                            onChange={(e) => setGoalHours(e.target.value)}
                            min="0"
                            max="23"
                            style={{ width: '50px', marginRight: '5px' }}
                            required
                        />
                        <span>시간</span>
                        <input
                            type='number'
                            value={goalMinutes}
                            onChange={(e) => setGoalMinutes(e.target.value)}
                            min="0"
                            max="59"
                            style={{ width: '50px', marginLeft: '10px', marginRight: '5px' }}
                            required
                        />
                        <span>분</span>
                    </div>
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
                            ref={confirmPasswordRef}
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
                <button 
                    className={'mybtn skyblue rounded'} 
                    type='submit'
                >
                    수정 완료
                </button>
            </form>
        </div>
    );
}

export default MemberUpdateForm;