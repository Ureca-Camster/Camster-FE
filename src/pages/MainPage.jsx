import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../store/hooks.ts';
import { addMyStudyGroup, resetMyStudyGroups, setMyStudyGroups  } from '../store/myStudyGroupsSlice.ts';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'
import Swal from 'sweetalert2';
import TodayProgress from '../component/MainPage/TodayProgress.jsx';
import Rank from '../component/MainPage/Rank.jsx';
import StudyList from '../component/MainPage/StudyList.jsx';
import StudyJoinModal from '../component/MainPage/StudyJoinModal.jsx';
import StudyCreateModal from '../component/MainPage/StudyCreateModal.jsx';

function MainPage() {
    const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
    const myStudyGroups = useAppSelector((state) => state.myStudyGroups.myStudyGroups);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [allStudyGroups, setAllStudyGroups] = useState([]);

    useEffect(() => {
        const fetchMyStudyGroups = async () => {
            if (isLoggedIn && myStudyGroups.length === 0) {
                try {
                    const response = await fetch('/studies/mystudies', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        dispatch(setMyStudyGroups(data));
                    } else {
                        console.error('Failed to fetch my study groups');
                    }
                } catch (error) {
                    console.error('Error fetching my study groups:', error);
                }
            } else if (!isLoggedIn && myStudyGroups.length > 0) {
                // 로그아웃 상태이고 myStudyGroups에 데이터가 있으면 초기화
                dispatch(resetMyStudyGroups());
            }
        };

        fetchMyStudyGroups();
    }, [isLoggedIn, myStudyGroups.length, dispatch]);

    useEffect(() => {
        const fetchAllStudyGroups = async () => {
            try {
                const response = await fetch('/studies', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllStudyGroups(data);
                } else {
                    console.error('Failed to fetch all study groups');
                }
            } catch (error) {
                console.error('Error fetching all study groups:', error);
            }
        };

        fetchAllStudyGroups();
    }, []);

    const handleStudyClick = (studyId, isPublic) => {
        if (!isLoggedIn) {
            Swal.fire({
                text: '로그인 후 이용 가능합니다.',
                icon: "warning",
                timer: 1200,
                showConfirmButton: false
            })
            return;
        }

        const study = myStudyGroups.find(s => s.studyId === studyId);
        if (study) {
            navigate(`/study/${studyId}`);
        } else {
            setSelectedStudy(allStudyGroups.find(s => s.studyId === studyId));
            setShowJoinModal(true);
        }
    };

    const handleJoinStudy = async (password) => {
        const joinRequestBody = { studyPassword: password };
        console.log("joinRequestBody", joinRequestBody);
        try {
            const response = await fetch(`/studies/${selectedStudy.studyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(joinRequestBody),
            });

            if (response.ok) {
                // 스터디 가입 성공
                dispatch(addMyStudyGroup({
                    studyId: selectedStudy.studyId,
                    studyName: selectedStudy.studyName,
                    description: selectedStudy.discription,
                    emoji: selectedStudy.emoji
                }));
                navigate(`/study/${selectedStudy.studyId}`);
            } else {
                // 스터디 가입 실패
                Swal.fire({
                    text: '스터디 가입에 실패했습니다.',
                    icon: "error",
                    timer: 1200,
                    showConfirmButton: false
                })
            }
        } catch (error) {
            console.error('Error joining study:', error);
            Swal.fire({
                text: '스터디 가입 중 오류가 발생했습니다.',
                icon: "error",
                timer: 1200,
                showConfirmButton: false
            })
        }

        setShowJoinModal(false);
        setSelectedStudy(null);
    };

    const handleCreateStudy = async (studyData) => {
        try {
            fetch('/studies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studyName: studyData.studyName,
                    description: studyData.description,
                    emoji: studyData.emoji,
                    isPublic: studyData.isPublic,
                    studyPassword: studyData.studyPassword
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create study');
                }
                return response.json();
            })
            .then(responseData => {
                console.log("Response data:", responseData);
                const studyId = responseData;
                dispatch(addMyStudyGroup({
                    studyId: studyId,
                    studyName: studyData.studyName,
                    description: studyData.description,
                    emoji: studyData.emoji
                }));
                navigate(`/study/${studyId}`);
            })
            .catch(error => {
                console.error('Error:', error);
                // 여기에 에러 처리 로직을 추가할 수 있습니다.
            });
        } catch (error) {
            console.error('Error creating study:', error);
            Swal.fire({
                text: '스터디 생성 중 오류가 발생했습니다.',
                icon: "error",
                timer: 1200,
                showConfirmButton: false
            })
        }
    };

    return (
        <Container>
            <Row className='mb-3'>
                <Col xs="8">
                    <TodayProgress />
                </Col>
                <Col xs="4">
                    <Rank />
                </Col>
            </Row>
            <Row>
                <div className="app-container mb-5">
                    <div className="title-button-container">
                        <h1 className="app-title">내 스터디 목록👀</h1>
                        {isLoggedIn && (
                            <Button className="create-study-button" onClick={() => setShowCreateModal(true)}>
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
                show={showJoinModal}
                onHide={() => setShowJoinModal(false)}
                onJoin={handleJoinStudy}
                isPublic={selectedStudy?.isPublic}
            />
            <StudyCreateModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSubmit={handleCreateStudy}
            />
        </Container>
    );
}

export default MainPage;