import React from 'react';
import StudyCard from './StudyCard';
import './StudyList.css';

const StudyList = ({ studies }) => {
    return (
        <div className="study-list">
          {studies.map((study) => (
            <StudyCard
              key={study.studyId}
              studyName={study.studyName}
              description={study.description}
              emoji={study.emoji}
              isPublic={study.isPublic}
            />
          ))}
        </div>
      );
};

export default StudyList;