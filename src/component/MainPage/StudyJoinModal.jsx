import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const StudyJoinModal = ({ show, onHide, onJoin, isPublic }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin(password);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isPublic ? '스터디 가입' : '비밀번호 입력'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isPublic ? (
          <p>해당 스터디에 가입하시겠습니까?</p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button variant="primary" onClick={() => onJoin(password)}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudyJoinModal;