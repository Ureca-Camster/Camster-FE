// MyPage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MemberUpdateForm from '../component/MemberUpdateForm';
import MonthlyTracker from '../component/MonthlyTracker';
import { Col, Container, Row } from 'react-bootstrap';

function MyPage() {
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
    const navigate = useNavigate();

    return (
        <>
            {isLoggedIn ? (
                <Container>
                    <Row>
                        <Col xs="8" style={{padding:"0"}}><MonthlyTracker /></Col>
                        <Col xs="4" style={{padding:"0"}}><MemberUpdateForm /></Col>
                    </Row>
                </Container>
            ) : (
                <div className='login-div'>
                    <p className='login-text'>
                        <span
                            onClick={() => navigate('/login')}
                            className='login-link'
                        >로그인</span>{' '}
                        후 이용 가능합니다.
                    </p>
                </div>
            )}
        </>
    );
}

export default MyPage;
