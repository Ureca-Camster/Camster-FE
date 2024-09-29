// StudyInfo.jsx
import React from 'react';
import { FaUser, FaEdit } from 'react-icons/fa';

function StudyInfo({
  studyRoom,
  memberCount,
  onEditClick,
  onMemberListClick,
  onCamStudyClick,
  onLeaveClick,
  isCreator
}) {
  return (
    <div style={styles.container}>
      <h1>{studyRoom.studyName} 스터디룸</h1>
      <div style={styles.descriptionBox}>
        <p>{studyRoom.description}</p>
        {isCreator && (
          <FaEdit
            style={styles.editIcon}
            onClick={onEditClick}
          />
        )}
      </div>
      <div style={styles.memberInfo}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaUser style={{ marginRight: "8px" }} /> {memberCount}명
        </span>
        <button className="custom-btn" onClick={onMemberListClick}>목록 보기</button>
      </div>
      <div style={styles.buttonContainer}>
        <button className="custom-btn" onClick={onCamStudyClick}>캠스터디 시작하기</button>
        <button className="custom-btn" onClick={onLeaveClick}>탈퇴</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: "4",
    border: "1px solid #8BC9FF",
    padding: "20px",
    borderRadius: "10px",
    height: "500px",
    overflow: "auto"
  },
  descriptionBox: {
    position: "relative",
    padding: "20px",
    border: "1px solid #8BC9FF",
    borderRadius: "10px"
  },
  editIcon: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    cursor: "pointer",
    width: "20px",
    height: "20px"
  },
  memberInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    marginTop: "20px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    marginTop: "20px"
  }
};

export default StudyInfo;