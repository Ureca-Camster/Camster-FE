import React from 'react';
import { useParams } from 'react-router-dom';

function StudyRoomPage(props) {
	const { studyNo } = useParams();
    return (
        <div>
            { studyNo } Study Room Page
        </div>
    );
}

export default StudyRoomPage;