import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CamStudyPage(props) {
	const { studyId } = useParams();
    const navigate = useNavigate();

    const handleOut = () => {
        if(window.confirm("캠스터디를 나가시겠습니까?")) {
            navigate(`/study/${studyId}`);
          }
    }

    return (
        <div>
            { studyId } Cam Study Page
            <button onClick={handleOut}>나가기</button>
        </div>
    );
}

export default CamStudyPage;
