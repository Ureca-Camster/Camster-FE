import React from 'react';
import { useAppSelector } from '../store/hooks.ts';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import StopWatch from '../component/StopWatch.jsx';
import OpenViduComponent from '../component/OpenViduComponent.jsx';

const CamStudyPage = () => {
    const { studyId } = useParams();
    const user = useAppSelector((state) => state.user);

    return (
        <Container fluid>
            <StopWatch />
            <OpenViduComponent
                studyId= {studyId}
            />
        </Container>
    );
};

export default CamStudyPage;