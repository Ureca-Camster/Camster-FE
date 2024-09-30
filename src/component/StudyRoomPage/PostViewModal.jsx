import React, { useState, useEffect } from "react";
import { useAppSelector } from '../../store/hooks.ts';
import './PostViewModal.css';

function PostViewModal({ studyId, post, onClose, onPostUpdated }) {
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
        return response.text(); // 응답 본문이 비어있을 수 있으므로 text()로 받습니다.
      })
      .then(data => {
        setIsEditingPost(false);
        // 서버 응답이 성공적이면 로컬 데이터를 업데이트합니다.
        const updatedPostWithAllData = {
          ...post,
          ...updatedPost
        };
        onPostUpdated(updatedPostWithAllData);
        alert("게시물이 성공적으로 수정되었습니다.");
      })
      .catch(error => {
        console.error("게시물 수정에 실패했습니다.", error);
        alert("게시물 수정에 실패했습니다.");
      });
  };

  const handleDelete = () => {
    if (window.confirm("게시물을 삭제하시겠습니까?")) {
      fetch(`/studies/${studyId}/boards/${post.id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) throw new Error("게시물 삭제에 실패했습니다.");
          onClose();
          onPostUpdated();
          alert("게시물이 성공적으로 삭제되었습니다.");
        })
        .catch(error => {
          console.error("게시물 삭제에 실패했습니다.", error);
          alert("게시물 삭제에 실패했습니다.");
        });
    }
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
      body: JSON.stringify({content: newComment}),
    })
      .then(response => response.json())
      .then(data => {
        setComments([...comments, data]);
        setNewComment("");
      })
      .catch(error => {
        console.error("댓글 추가에 실패했습니다.", error);
        alert("댓글 추가에 실패했습니다.");
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
        alert("댓글이 성공적으로 수정되었습니다.");
      })
      .catch(error => {
        console.error("댓글 수정에 실패했습니다.", error);
        alert("댓글 수정에 실패했습니다.");
      });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      fetch(`/boards/${post.id}/comments/${commentId}`, {
        method: "DELETE",
      })
        .then(() => {
          setComments(comments.filter(comment => comment.id !== commentId));
        })
        .catch(error => {
          console.error("댓글 삭제에 실패했습니다.", error);
          alert("댓글 삭제에 실패했습니다.");
        });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
        
        {user.memberId === post.memberId && (
          <div className="edit-delete-buttons">
            <button onClick={() => setIsEditingPost(!isEditingPost)} className="custom-btn">
              {isEditingPost ? "수정 취소" : "수정"}
            </button>
            <button onClick={handleDelete} className="custom-btn">삭제</button>
          </div>
        )}

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
            <button onClick={handleEditSubmit} className="custom-btn">저장</button>
          </>
        ) : (
          <>
            <h1>{post.title}</h1>
            <p>작성자: {post.nickname}</p>
            <p>작성일: {post.createDate}</p>
            <p>{post.content}</p>
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
                    <button onClick={() => handleSaveEditedComment(comment.id)} className="custom-btn">
                      저장
                    </button>
                    <button onClick={() => setEditingCommentId(null)} className="custom-btn">
                      취소
                    </button>
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
                        <button 
                          onClick={() => handleEditComment(comment.id, comment.content)} 
                          className="custom-btn"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)} 
                          className="custom-btn"
                        >
                          삭제
                        </button>
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

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="textarea"
        />
        <button onClick={handleAddComment} className="custom-btn">댓글 달기</button>
      </div>
    </div>
  );
}

export default PostViewModal;