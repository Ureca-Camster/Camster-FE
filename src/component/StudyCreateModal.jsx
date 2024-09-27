import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './StudyCreateModal.css';

const StudyCreateModal = ({ show, onHide, onSubmit }) => {
    const [studyName, setStudyName] = useState('');
    const [description, setDescription] = useState('');
    const [emoji, setEmoji] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ studyName, description, emoji, isPublic, password: isPublic ? '' : password });
      resetForm();
    };
  
    const resetForm = () => {
      setStudyName('');
      setDescription('');
      setEmoji('');
      setIsPublic(true);
      setPassword('');
    };
  
    const handleCancel = () => {
      resetForm();
      onHide();
    };

  return (
    <Modal show={show} onHide={handleCancel} centered className="study-create-modal">
      <Modal.Header closeButton>
        <Modal.Title>스터디 개설</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>스터디 이름</Form.Label>
            <Form.Control
              type="text"
              placeholder="스터디 이름을 지어주세요"
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>설명</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="스터디 설명을 적어주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>이모지</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter one emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-1 public-toggle-container">
            <Form.Label>공개 여부</Form.Label>
            <div className="toggle-wrapper">
              <Form.Check
                type="switch"
                id="public-switch"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="custom-switch"
              />
              <span className="toggle-label">{isPublic ? "공개 스터디" : "비공개 스터디"}</span>
            </div>
          </Form.Group>
          
          <Form.Group className="mb-3">
            {/* <Form.Label>Password</Form.Label> */}
            <Form.Control
              type="password"
              placeholder={isPublic ? "공개 스터디는 비밀번호가 필요하지 않습니다" : "비공개 스터디 비밀번호 입력"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPublic}
              required={!isPublic}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              스터디 개설
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StudyCreateModal;