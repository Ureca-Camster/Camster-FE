// MainPage.jsx
import React from 'react';
import Rank from '../component/Rank';
import { Col, Container, Row } from 'react-bootstrap';
import TodayProgress from '../component/TodayProgress';
import StudyList from '../component/StudyList';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function MainPage(props) {
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
    const navigate = useNavigate();

    const myStudyGroups = [
        {
          studyId: 100,
          studyName: "Java 알고리즘 스터디",
          description: "소개가 엄청나게 길어지면 어떻게 될까요? 저도 궁금해서 지금 테스트를 해보려고 합니다. 결과가 궁금합니다. 곧 월즈가 시작하는데 떨려서 죽겠습니다 아 맞다 장패드 포카 교환해야 하는데!",
          emoji: "✨"
        },
        {
          studyId: 200,
          studyName: "Python 알고리즘 스터디",
          description: "뭐 어쩌구 저쩌구 소개",
          emoji: "🐧"
        },
        {
          studyId: 220,
          studyName: "Figma 도전",
          description: "뭐 어쩌구 저쩌구 소개",
          emoji: "🔥"
        }
    ];
    const allStudyGroups = [
        {
            "studyId": 10,
            "studyName": "C++ 알고리즘 스터디",
            "description": "뭐 어쩌구 저쩌구 소개",
            "emoji": "💎",
            "isPublic": false
        },
        {
            "studyId": 20,
            "studyName": "Python 기초 뽀개기길어져라 제목아",
            "description": "뭐 어쩌구 저쩌구 소개",
            "emoji": "😑",
            "isPublic": false
        },
        {
            "studyId": 30,
            "studyName": "Zoom 클론 코딩",
            "description": "뭐 어쩌구 저쩌구 소개.. 두 줄 정도는 쓸 수 있잖아",
            "emoji": "👬",
            "isPublic": true
        },
        {
            "studyId": 40,
            "studyName": "정보보안기사 으쌰",
            "description": "뭐 어쩌구 저쩌구 소개",
            "emoji": "💪",
            "isPublic": true
        }
    ];

    return (
        <Container>
            <Row>
                <Col>
                    <TodayProgress />
                </Col>
                <Col>
                    <Rank />
                </Col>
            </Row>
            <Row>
                <div className="app-container mb-5">
                    <h1 className="app-title">내 스터디 목록👀</h1>
                    { isLoggedIn ? (
                        <StudyList studies={myStudyGroups} />
                    ) : (
                        <div className="study-list login-div">
                            <p className='login-text'>
                                <span
                                    onClick={() => navigate('/login')}
                                    className='login-link'
                                >로그인</span>{' '}
                                후 이용 가능합니다.
                            </p>
                        </div>
                    )}
                </div>
            </Row>
            <Row>
                <div className="app-container">
                    <h1 className="app-title">스터디 둘러보기🔎</h1>
                    <StudyList studies={allStudyGroups} />
                </div>
            </Row>
        </Container>
    );
}

export default MainPage;
