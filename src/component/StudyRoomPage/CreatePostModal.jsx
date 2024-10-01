// CreatePostModal.jsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function CreatePostModal({ onSubmit, onClose }) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const handleSubmit = () => {
    onSubmit(postTitle, postContent);
    setPostTitle("");
    setPostContent("");
  };

  return (
    <div style={styles.modal}>
      <h2 style={styles.title}>새 게시물 작성</h2>
      <input
        type="text"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        style={styles.input}
        className='mb-3'
      />
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="게시물 내용을 입력하세요..."
        style={styles.textarea}
      />
      <div style={styles.buttonContainer}>
        <Button onClick={handleSubmit} variant="primary" style={styles.submitButton}>등록</Button>
        <Button onClick={onClose} variant="secondary" style={styles.cancleButton}>취소</Button>
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
    padding: "30px 30px 22px 30px",
    width: "500px",
    backgroundColor: "#fff",
    border: "6px solid #8BC9FF",
    borderRadius: "50px",
    zIndex: 1000,
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    border: "1px solid #8BC9FF",
    borderRadius: "5px",
    fontSize: "18px"
  },
  textarea: {
    width: "100%",
    height: "200px",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    border: "1px solid #8BC9FF",
    borderRadius: "5px",
    fontSize: "18px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "end",
    gap: "10px"
  },
  submitButton: {
    width: "120px",  // 등록 버튼의 너비를 늘립니다.
    fontSize: "17px"
  },
  cancleButton: {
    fontSize: "16px"
  }
};

export default CreatePostModal;