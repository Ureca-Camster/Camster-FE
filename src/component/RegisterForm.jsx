import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './Input.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [goalHours, setGoalHours] = useState('');
    const [goalMinutes, setGoalMinutes] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        if (password || confirmPassword) {
            if (password === confirmPassword) {
                setPasswordMatchMessage('비밀번호가 일치합니다.');
                setIsFormValid(true);
            } else {
                setPasswordMatchMessage('비밀번호가 일치하지 않습니다.');
                setIsFormValid(false);
            }
        } else {
            setPasswordMatchMessage('');
            setIsFormValid(false);
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            confirmPasswordRef.current.focus();
            return;
        }

        // 시간과 분을 초로 변환
        const goalTimeInSeconds = (parseInt(goalHours) * 3600) + (parseInt(goalMinutes) * 60);

        const userData = {
            nickname,
            email,
            memberPassword: password,
            goalTime: goalTimeInSeconds
        };

        try {
            const response = await fetch('/members/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "회원가입 완료!",
                    showConfirmButton: false,
                    timer: 1200
                })
                navigate('/');
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: "warning",
                    title: "회원가입 실패",
                    text: `${errorData.message}`,
                    showConfirmButton: false,
                    timer: 1200
                })
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "warning",
                title: "회원가입 실패",
                text: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
                showConfirmButton: false,
                timer: 1200
            })
        }
    };

    const handleTogglePassword = (field) => {
        if (field === 'new') {
            setShowPassword(!showPassword);
        } else if (field === 'confirm') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className='register-form'>
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
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
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
                            onMouseDown={() => handleTogglePassword('new')}
                            onMouseUp={() => handleTogglePassword('new')}
                            onMouseLeave={() => setShowPassword(false)}
                            className="password-toggle"
                        />
                    </div>
                </div>
                <div className="input-wrapper" style={{marginBottom: '2px'}}>
                    <label>비밀번호 확인</label><br />
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            ref={confirmPasswordRef}
                            required
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
                        `password-match-message ${password === confirmPassword ? 'match' : 'mismatch'}
                        ${passwordMatchMessage === '' ? 'nonexist' : 'exist'}`}>
                        {passwordMatchMessage}
                    </div>
                </div>
                <button 
                    className={'mybtn skyblue rounded'} 
                    type='submit'
                >
                    가입
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;