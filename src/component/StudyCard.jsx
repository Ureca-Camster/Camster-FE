import React from 'react';
import './StudyCard.css';

const StudyCard = ({ studyName, description, emoji, isPublic }) => {
  return (
    <div className="study-card">
      <div className="study-card-header">
        <span className="study-card-emoji">{emoji}</span>
        <div className="study-card-title-container">
          <h3 className="study-card-title">{studyName}</h3>
          {isPublic === false && <span className="study-card-lock">🔒</span>}
        </div>
      </div>
      <div className="study-card-description">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default StudyCard;