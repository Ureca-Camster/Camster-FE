import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Rank from '../component/Rank';
import TodayProgress from '../component/TodayProgress';
import StudyList from '../component/StudyList';
import StudyJoinModal from '../component/StudyJoinModal';
import './MainPage.css'

function MainPage() {
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [myStudyGroups, setMyStudyGroups] = useState([
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
    ]);
    const [allStudyGroups, setAllStudyGroups] = useState([
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
    ]);

    const handleStudyClick = (studyId, isPublic) => {
        if (!isLoggedIn) {
            alert('로그인 후 이용 가능합니다.');
            return;
        }

        const study = myStudyGroups.find(s => s.studyId === studyId);
        if (study) {
            navigate(`/study/${studyId}`);
        } else {
            setSelectedStudy(allStudyGroups.find(s => s.studyId === studyId));
            setShowModal(true);
        }
    };

    const handleJoinStudy = async (password) => {
        try {
            const response = await fetch(`/studies/${selectedStudy.studyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studyPassword: password }),
            });

            if (response.ok) {
                // 스터디 가입 성공
                setMyStudyGroups([...myStudyGroups, selectedStudy]);
                navigate(`/study/${selectedStudy.studyId}`);
            } else {
                // 스터디 가입 실패
                alert('스터디 가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error joining study:', error);
            alert('스터디 가입 중 오류가 발생했습니다.');
        }

        setShowModal(false);
        setSelectedStudy(null);
    };

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
                    <div className="title-button-container">
                        <h1 className="app-title">내 스터디 목록👀</h1>
                        {isLoggedIn && (
                            <Button className="create-study-button" onClick={() => {/* 스터디 개설 모달 */}}>
                                스터디 개설하기
                            </Button>
                        )}
                    </div>
                    { isLoggedIn ? (
                        <StudyList 
                            studies={myStudyGroups} 
                            onStudyClick={handleStudyClick} 
                            isClickable={true}
                        />
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
                    <StudyList 
                        studies={allStudyGroups} 
                        onStudyClick={handleStudyClick} 
                        isClickable={isLoggedIn}
                    />
                </div>
            </Row>
            <StudyJoinModal 
                show={showModal}
                onHide={() => setShowModal(false)}
                onJoin={handleJoinStudy}
                isPublic={selectedStudy?.isPublic}
            />
        </Container>
    );
}

export default MainPage;