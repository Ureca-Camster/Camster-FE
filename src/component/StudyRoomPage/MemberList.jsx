// MemberList.jsx
import React from 'react';

function MemberList({ members, onClose }) {
  return (
    <div style={styles.modal}>
      <h2>가입된 멤버 목록</h2>
      <ul>
        {members.map(member => (
          <li key={member.memberId}>{member.nickname}</li>
        ))}
      </ul>
      <button className="custom-btn" onClick={onClose}>닫기</button>
    </div>
  );
}

const styles = {
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "30px",
    width: "400px",
    backgroundColor: "#fff",
    border: "1px solid #8BC9FF",
    borderRadius: "10px",
    zIndex: 1000,
  }
};

export default MemberList;