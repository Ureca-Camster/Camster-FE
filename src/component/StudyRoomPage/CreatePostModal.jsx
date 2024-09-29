// CreatePostModal.jsx
import React, { useState } from 'react';

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
      <h2>새 게시물 작성</h2>
      <input
        type="text"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        style={styles.input}
      />
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="게시물 내용을 입력하세요..."
        style={styles.textarea}
      />
      <div style={styles.buttonContainer}>
        <button className="custom-btn" onClick={handleSubmit}>등록</button>
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
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    border: "1px solid #8BC9FF",
    borderRadius: "5px"
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

export default CreatePostModal;