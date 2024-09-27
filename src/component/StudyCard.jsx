import React from 'react';
import './StudyCard.css';

const StudyCard = ({ studyId, studyName, description, emoji, isPublic, onClick, isClickable, isMyStudy }) => {
  const handleClick = () => {
    if (isClickable && onClick) {
      onClick(studyId, isPublic);
    }
  };

  const showLock = !isMyStudy && isPublic === false;

  return (
    <div 
      className={`study-card ${isClickable ? 'clickable' : ''}`} 
      onClick={handleClick}
    >
      <div className="study-card-header">
        <span className="study-card-emoji">{emoji}</span>
        <div className="study-card-title-container">
          <h3 className="study-card-title">{studyName}</h3>
          {showLock && <span className="study-card-lock">🔒</span>}
        </div>
      </div>
      <div className="study-card-description">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default StudyCard;