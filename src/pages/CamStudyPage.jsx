import React from 'react';
import { useParams } from 'react-router-dom';

function CamStudyPage(props) {
	// const { studyNo } = useParams();
    const studyNo = 1;
    return (
        <div>
            { studyNo } Cam Study Page
        </div>
    );
}

export default CamStudyPage;