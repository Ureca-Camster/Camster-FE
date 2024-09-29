import React, { useState, useEffect } from "react";
import { useAppSelector } from '../../store/hooks.ts';

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
    fetch(`/comments/board/${post.id}`)
      .then(response => response.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error("댓글 정보를 불러오는데 실패했습니다.", error);
        setComments([]);
      });
  };

  const handleEditSubmit = () => {
    if (window.confirm("정말로 게시물을 수정하시겠습니까?")) {
      const updatedPost = {
        title: editedTitle,
        content: editedContent
      };
      console.log("updatePost", updatedPost);

      fetch(`/studies/${studyId}/boards/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      })
        .then(response => {
          if (!response.ok) throw new Error("게시물 수정에 실패했습니다.");
          return response.json();
        })
        .then(data => {
          setIsEditingPost(false);
          onPostUpdated();
          alert("게시물이 성공적으로 수정되었습니다.");
        })
        .catch(error => {
          console.error("게시물 수정에 실패했습니다.", error);
          alert("게시물 수정에 실패했습니다.");
        });
    }
  };

  const handleDelete = () => {
    if (window.confirm("정말로 게시물을 삭제하시겠습니까?")) {
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

    const commentData = {
      boardId: post.id,
      content: newComment,
      memberId: user.memberId,
      nickname: user.nickname
    };

    fetch('/comments', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
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
    fetch(`/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: editedCommentContent }),
    })
      .then(response => response.json())
      .then(updatedComment => {
        setComments(comments.map(comment => 
          comment.commentId === commentId ? updatedComment : comment
        ));
        setEditingCommentId(null);
        setEditedCommentContent("");
      })
      .catch(error => console.error("댓글 수정에 실패했습니다.", error));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      fetch(`/comments/${commentId}`, {
        method: "DELETE",
      })
        .then(() => {
          setComments(comments.filter(comment => comment.commentId !== commentId));
        })
        .catch(error => {
          console.error("댓글 삭제에 실패했습니다.", error);
          alert("댓글 삭제에 실패했습니다.");
        });
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeButton}>X</button>
        
        {user.memberId === post.memberId && (
          <div style={styles.editDeleteButtons}>
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
              style={styles.input}
              placeholder="제목을 입력하세요"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={styles.textarea}
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

        <hr style={styles.hr} />

        <h3>댓글</h3>
        {comments.length > 0 ? (
          <ul style={styles.commentList}>
            {comments.map(comment => (
              <li key={comment.commentId} style={styles.commentItem}>
                {editingCommentId === comment.commentId ? (
                  <>
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      style={styles.textarea}
                    />
                    <button onClick={() => handleSaveEditedComment(comment.commentId)} className="custom-btn">
                      저장
                    </button>
                    <button onClick={() => setEditingCommentId(null)} className="custom-btn">
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <p>{comment.content}</p>
                    <div style={styles.commentInfo}>
                      <p>작성자: {comment.nickname || "알 수 없음"}</p>
                      <p>작성일: {new Date(comment.createdDate).toLocaleString()}</p>
                    </div>
                    {(user.memberId === post.memberId || user.memberId === comment.memberId) && (
                      <div style={styles.commentButtons}>
                        <button 
                          onClick={() => handleEditComment(comment.commentId, comment.content)} 
                          className="custom-btn"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.commentId)} 
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
          style={styles.textarea}
        />
        <button onClick={handleAddComment} className="custom-btn">댓글 달기</button>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  editDeleteButtons: {
    position: 'absolute',
    top: '10px',
    right: '40px',
    display: 'flex',
    gap: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #8BC9FF',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #8BC9FF',
    minHeight: '100px',
  },
  hr: {
    borderTop: '1px solid #8BC9FF',
    margin: '20px 0',
  },
  commentList: {
    listStyle: 'none',
    padding: 0,
  },
  commentItem: {
    marginBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '10px',
  },
  commentInfo: {
    fontSize: '12px',
    color: 'gray',
  },
  commentButtons: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
};

export default PostViewModal;