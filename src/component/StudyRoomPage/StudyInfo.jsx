import React from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import './StudyInfo.css'

const StudyInfo = ({
  studyRoom,
  memberCount,
  onEditClick,
  onMemberListClick,
  onCamStudyClick,
  onLeaveClick,
  isLeader
}) => {
  return (
    <div className="study-info-container">
      <div className="study-info-header">
        <span className="study-info-emoji">{studyRoom.emoji}</span>
        <div className="study-info-title-container">
          <h1 className="study-info-title">{studyRoom.studyName}</h1>
          {!studyRoom.isPublic && <FaLock className="study-info-lock" />}
        </div>
      </div>
      <div className="study-info-description">
        <p>{studyRoom.description}</p>
        {isLeader && (
          <button className="edit-button" onClick={onEditClick}>
            <MdEdit />
          </button>
        )}
      </div>
      <div className="member-info">
        <div>
          <FaUser />
          <span>{memberCount}명</span>
        </div>

        <button onClick={onMemberListClick} className='member-list-btn'>목록 보기</button>
      </div>
      <div className="action-buttons">
        <button onClick={onCamStudyClick} className='cam-study-btn'><IoVideocam/> 캠스터디 시작하기</button>
        <button onClick={onLeaveClick} className='withdraw-btn'>탈퇴</button>
      </div>
    </div>
  );
};

export default StudyInfo;