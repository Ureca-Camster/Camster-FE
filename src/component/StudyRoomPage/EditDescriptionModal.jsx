// EditDescriptionModal.jsx
import React from 'react';

function EditDescriptionModal({ description, onDescriptionChange, onSave, onClose }) {
  return (
    <div style={styles.modal}>
      <h2>스터디 설명 수정</h2>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="스터디 설명을 수정하세요..."
        style={styles.textarea}
      />
      <div style={styles.buttonContainer}>
        <button className="custom-btn" onClick={onSave}>저장</button>
        <button className="custom-btn" onClick={onClose}>취소</button>
      </div>
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
    width: "500px",
    backgroundColor: "#fff",
    border: "1px solid #8BC9FF",
    borderRadius: "10px",
    zIndex: 1000,
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    fontSize: "14px",
    marginBottom: "10px",
    border: "1px solid #8BC9FF",
    borderRadius: "5px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between"
  }
};

export default EditDescriptionModal;