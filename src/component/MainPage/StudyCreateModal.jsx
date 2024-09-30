import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import EmojiPicker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './StudyCreateModal.css';

const StudyCreateModal = ({ show, onHide, onSubmit }) => {
  const [studyName, setStudyName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiError, setEmojiError] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emoji) {
      setEmojiError(true);
      return;
    }
    onSubmit({ studyName, description, emoji, isPublic, studyPassword: isPublic ? '' : password });
    resetForm();
  };

  const resetForm = () => {
    setStudyName('');
    setDescription('');
    setEmoji('');
    setIsPublic(true);
    setPassword('');
    setShowEmojiPicker(false);
  };

  const handleCancel = () => {
    resetForm();
    onHide();
  };

  const onEmojiClick = (emojiObject) => {
    setEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
    setEmojiError(false);
  };

  const handlePublicToggle = (e) => {
    const newIsPublic = e.target.checked;
    setIsPublic(newIsPublic);
    if (newIsPublic) {
      setPassword('');
    }
  };

  const handleMouseDown = () => setShowPassword(true);
  const handleMouseUp = () => setShowPassword(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <div className="emoji-input-container">
              <Form.Control
                type="text"
                placeholder="이모지를 선택하세요"
                value={emoji}
                readOnly
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                isInvalid={emojiError}
              />
              <Button variant="outline-secondary" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                {emoji || '😀'}
              </Button>
            </div>
            {emojiError && <Form.Control.Feedback type="invalid">이모지를 선택해주세요.</Form.Control.Feedback>}
            {showEmojiPicker && (
              <div className="emoji-picker-container" ref={emojiPickerRef}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-1 public-toggle-container">
            <Form.Label>공개 여부</Form.Label>
            <div className="toggle-wrapper">
              <Form.Check
                type="switch"
                id="public-switch"
                checked={isPublic}
                onChange={handlePublicToggle}  
                className="custom-switch"
              />
              <span className="toggle-label">{isPublic ? "공개 스터디" : "비공개 스터디"}</span>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <div className="password-input-wrapper">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder={isPublic ? "공개 스터디는 비밀번호가 필요하지 않습니다" : "비공개 스터디 비밀번호 입력"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPublic}
                required={!isPublic}
              />
              {!isPublic &&
              <FontAwesomeIcon 
                icon={faEye}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="password-toggle"
              />}
            </div>
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