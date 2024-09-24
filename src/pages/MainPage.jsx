// MainPage.jsx
import React from 'react';
import Rank from '../component/Rank';
import { Col, Container, Row } from 'react-bootstrap';
import TodayProgress from '../component/TodayProgress';

function MainPage(props) {

    return (
        <Container>
            <Row>
                <Col xs={12} md={8}>
                    <TodayProgress />
                </Col>
                <Col xs={6} md={4}>
                    <Rank />
                </Col>
            </Row>
        </Container>
    );
}

export default MainPage;
