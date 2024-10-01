import React, { useState, useEffect } from "react";
import { useAppSelector } from '../../store/hooks.ts';
import './PostViewModal.css';
import Swal from 'sweetalert2';
import { MdClose } from "react-icons/md";
import { Button } from 'react-bootstrap';

function PostViewModal({ studyId, post, onClose, onPostUpdated, onPostDeleted }) {
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = () => {
    fetch(`/boards/${post.id}/comments`)
      .then(response => response.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error("댓글 정보를 불러오는데 실패했습니다.", error);
        setComments([]);
      });
  };

  const handleEditSubmit = () => {
    const updatedPost = {
      title: editedTitle,
      content: editedContent
    };

    fetch(`/studies/${studyId}/boards/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("게시물 수정에 실패했습니다.");
        }
        return response.text(); // 응답 본문이 비어있을 수 있으므로 text()로
      })
      .then(data => {
        setIsEditingPost(false);
        // 서버 응답이 성공적이면 로컬 데이터를 업데이트
        const updatedPostWithAllData = {
          ...post,
          ...updatedPost
        };
        onPostUpdated(updatedPostWithAllData);
        // Swal.fire({
        //   icon: 'success',
        //   title: '게시물 수정 완료!',
        //   showConfirmButton: false,
        //   timer: 1200
        // });
      })
      .catch(error => {
        console.error("게시물 수정에 실패했습니다.", error);
        Swal.fire({
          icon: 'error',
          title: '게시물 수정 실패',
          text: '다시 시도해주세요.',
          showConfirmButton: false,
          timer: 1200
        });
      });
  };

  const handleDelete = () => {
    Swal.fire({
      title: '게시물을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/studies/${studyId}/boards/${post.id}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (!response.ok) throw new Error("게시물 삭제에 실패했습니다.");
            onPostDeleted(post.id); // 부모 컴포넌트에 삭제된 게시물 ID 전달
            onClose();
            // Swal.fire({
            //   icon: 'success',
            //   title: '게시물 삭제 완료',
            //   showConfirmButton: false,
            //   timer: 1200
            // });
          })
          .catch(error => {
            console.error("게시물 삭제에 실패했습니다.", error);
            Swal.fire({
              icon: 'error',
              title: '게시물 삭제 실패',
              text: '다시 시도해주세요.',
              showConfirmButton: false,
              timer: 1200
            });
          });
      }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    fetch(`/boards/${post.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then(response => response.json())
      .then(data => {
        setComments([...comments, data]);
        setNewComment("");
      })
      .catch(error => {
        console.error("댓글 추가에 실패했습니다.", error);
        Swal.fire({
          icon: 'error',
          title: '댓글 작성 실패',
          text: '다시 시도해주세요.',
          showConfirmButton: false,
          timer: 1200
        });
      });
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  const handleSaveEditedComment = (commentId) => {
    fetch(`/boards/${post.id}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: editedCommentContent }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("댓글 수정에 실패했습니다.");
        }
        return response.text(); // 응답 본문이 비어있을 수 있으므로 text()로 받습니다.
      })
      .then(() => {
        // 서버 응답이 성공적이면 로컬 데이터를 업데이트합니다.
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? { ...comment, content: editedCommentContent }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditedCommentContent("");
        // Swal.fire({
        //   icon: 'success',
        //   title: '댓글 수정 완료',
        //   showConfirmButton: false,
        //   timer: 1200
        // });
      })
      .catch(error => {
        console.error("댓글 수정에 실패했습니다.", error);
        Swal.fire({
          icon: 'error',
          title: '댓글 수정 실패',
          text: '다시 시도해주세요.',
          showConfirmButton: false,
          timer: 1200
        });
      });
  };

  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: '댓글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/boards/${post.id}/comments/${commentId}`, {
          method: "DELETE",
        })
          .then(() => {
            setComments(comments.filter(comment => comment.id !== commentId));
            // Swal.fire({
            //   icon: 'success',
            //   title: '댓글 삭제 완료',
            //   showConfirmButton: false,
            //   timer: 1200
            // });
          })
          .catch(error => {
            console.error("댓글 삭제에 실패했습니다.", error);
            Swal.fire({
              icon: 'error',
              title: '댓글 삭제 실패',
              text: '다시 시도해주세요.',
              showConfirmButton: false,
              timer: 1200
            });
          });
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <button onClick={onClose} className="close-button"><MdClose /></button>
        </div>

        <div className="modal-body">
          {isEditingPost ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="input"
                placeholder="제목을 입력하세요"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="textarea"
                placeholder="내용을 입력하세요"
              />
              <div className="edit-buttons">
                <Button onClick={handleEditSubmit} className="custom-btn" variant="light">저장</Button>
                <Button onClick={() => setIsEditingPost(false)} className="custom-btn" variant="light">취소</Button>
              </div>
            </>
          ) : (
            <>
              <h1>{post.title}</h1>
              <p>작성자: {post.nickname}</p>
              <p>작성일: {post.createDate}</p>
              <p style={{marginBottom: "20px"}}>{post.content}</p>
              {user.memberId === post.memberId && (
                <div className="edit-buttons">
                  <Button
                    variant="light"
                    onClick={() => setIsEditingPost(true)}
                    className="custom-btn">
                    수정
                  </Button>
                  <Button
                    variant="light"
                    onClick={handleDelete} className="custom-btn">삭제</Button>
                </div>
              )}
            </>
          )}

          <hr className="hr" />

          <h3>댓글</h3>
          {comments.length > 0 ? (
            <ul className="comment-list">
              {comments.map(comment => (
                <li key={comment.id} className="comment-item">
                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        value={editedCommentContent}
                        onChange={(e) => setEditedCommentContent(e.target.value)}
                        className="textarea"
                      />
                      <div className="comment-buttons">
                        <Button variant="" onClick={() => handleSaveEditedComment(comment.id)} className="custom-btn">
                          저장
                        </Button>
                        <Button onClick={() => setEditingCommentId(null)} className="custom-btn">
                          취소
                        </Button></div>
                    </>
                  ) : (
                    <>
                      <p>{comment.content}</p>
                      <div className="comment-info">
                        <p>작성자: {comment.nickname || "알 수 없음"}</p>
                        <p>작성일: {comment.createdDate}</p>
                      </div>
                      {(user.memberId === post.memberId || user.memberId === comment.memberId) && (
                        <div className="comment-buttons">
                          <Button
                            variant="light"
                            onClick={() => handleEditComment(comment.id, comment.content)}
                            className="custom-btn"
                          >
                            수정
                          </Button>
                          <Button
                            variant="light"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="custom-btn"
                          >
                            삭제
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>작성된 댓글이 없습니다.</p>
          )}

          <div className="comment-input-container">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="textarea"
            />
            <Button variant="light" onClick={handleAddComment} className="custom-btn">댓글 달기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostViewModal;