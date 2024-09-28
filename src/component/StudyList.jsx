import React from 'react';
import StudyCard from './StudyCard';
import './StudyList.css';

const StudyList = ({ studies, onStudyClick, isClickable }) => {
    return (
        <div className="study-list">
            {studies.length > 0 ? (
                studies.map((study) => (
                    <StudyCard
                        key={study.studyId}
                        studyId={study.studyId}
                        studyName={study.studyName}
                        description={study.description}
                        emoji={study.emoji}
                        isPublic={study.isPublic}
                        onClick={isClickable ? onStudyClick : undefined}
                        isClickable={isClickable}
                    />
                ))
            ) : (
                <div className="empty-study-list">
                    <p>스터디 목록이 비어있습니다.</p>
                </div>
            )}
        </div>
    );
};

export default StudyList;