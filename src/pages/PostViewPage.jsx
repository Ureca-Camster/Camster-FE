import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from '../store/hooks.ts'; // 현재 로그인한 사용자 정보를 가져오기 위함

function PostViewPage() {
  const { boardId } = useParams();
  const [post, setPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [comments, setComments] = useState([]);  // 댓글 상태
  const [newComment, setNewComment] = useState("");  // 새 댓글 입력 상태
  const [editingCommentId, setEditingCommentId] = useState(null);  // 수정 중인 댓글 ID 상태
  const [editedCommentContent, setEditedCommentContent] = useState("");  // 수정 중인 댓글 내용 상태
  const [isEditingPost, setIsEditingPost] = useState(false);  // 게시물 수정 모드
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    // 게시물 정보를 가져오는 API 호출
    fetch(`http://localhost:8080/boards/${boardId}`)
      .then(response => response.json())
      .then(data => {
        setPost(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      })
      .catch(error => console.error("게시물 정보를 불러오는데 실패했습니다.", error));

    // 댓글 리스트를 가져오는 API 호출
    fetch(`http://localhost:8080/comments/board/${boardId}`)
      .then(response => response.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error("댓글 정보를 불러오는데 실패했습니다.", error);
        setComments([]);  // 오류 발생 시 빈 배열로 설정
      });
  }, [boardId]);

  // 게시물 수정 함수
  const handleEditSubmit = () => {
    if (window.confirm("정말로 게시물을 수정하시겠습니까?")) {
      const updatedPost = {
        ...post,
        title: editedTitle,
        content: editedContent,
        memberId: user.memberId,
      };

      fetch(`http://localhost:8080/boards/${boardId}?currentMemberId=${user.memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      })
        .then(response => {
          if (!response.ok) throw new Error("게시물 수정에 실패했습니다.");
          return response.json();
        })
        .then(data => {
          setPost(data);
          setIsEditingPost(false);  // 게시물 수정 모드 종료
          alert("게시물이 성공적으로 수정되었습니다.");
        })
        .catch(error => {
          console.error("게시물 수정에 실패했습니다.", error);
          alert("게시물 수정에 실패했습니다.");
        });
    }
  };

  // 게시물 수정 모드로 전환
  const toggleEditPost = () => {
    setIsEditingPost(!isEditingPost);
  };

  // 게시물 삭제 함수
  const handleDelete = () => {
    if (window.confirm("정말로 게시물을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/boards/${boardId}?currentMemberId=${user.memberId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) throw new Error("게시물 삭제에 실패했습니다.");
          navigate(`/study/${post.studyId}`);
          alert("게시물이 성공적으로 삭제되었습니다.");
        })
        .catch(error => {
          console.error("게시물 삭제에 실패했습니다.", error);
          alert("게시물 삭제에 실패했습니다.");
        });
    }
  };

  // 새 댓글 추가 함수
  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const commentData = {
      boardId: boardId,
      content: newComment,
      memberId: user.memberId,  // 로그인된 사용자 ID 사용
      nickname: user.nickname
    };

    fetch(`http://localhost:8080/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    })
      .then(response => response.json())
      .then(data => {
        setComments([...comments, data]);  // 새 댓글 추가
        setNewComment("");  // 입력 필드 초기화
      })
      .catch(error => {
        console.error("댓글 추가에 실패했습니다.", error);
        alert("댓글 추가에 실패했습니다.");
      });
  };

  // 댓글 수정 모드로 전환
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);  // 수정할 댓글 ID 설정
    setEditedCommentContent(content);  // 기존 댓글 내용을 수정 필드에 세팅
  };

  // 댓글 수정 저장 함수
  const handleSaveEditedComment = (commentId) => {
    // 서버에 수정된 댓글을 전송하는 로직
    fetch(`http://localhost:8080/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: editedCommentContent }),
    })
      .then(response => response.json())
      .then(updatedComment => {
        // 댓글 리스트에서 해당 댓글을 업데이트
        setComments(comments.map(comment => 
          comment.commentId === commentId ? updatedComment : comment
        ));
        // 수정 모드 종료
        setEditingCommentId(null);
        setEditedCommentContent("");
      })
      .catch(error => console.error("댓글 수정에 실패했습니다.", error));
  };

  // 댓글 삭제 함수
  const handleDeleteComment = (commentId) => {
    if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/comments/${commentId}`, {
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

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "20px", maxWidth: "1200px", margin: "0 auto", position: "relative", height: "90vh", overflow: "hidden" }}>
      <div style={{ 
        flex: "1", 
        border: "1px solid #8BC9FF",  
        padding: "20px", 
        borderRadius: "20px", 
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
        position: "relative",
        overflowY: "auto",  // 스크롤이 필요할 때 스크롤바 생성
        height: "100%", 
        overflowX: "hidden" 
      }}>
        {/* 뒤로 버튼 */}
        <button 
          onClick={() => navigate(-1)} 
          className="custom-btn back-btn"
          style={{ 
            position: "absolute", 
            top: "20px", 
            left: "20px", 
            zIndex: 1
          }}  
        >
          뒤로
        </button>

        {/* 게시물 수정 및 삭제 버튼 */}
        {user.memberId === post.memberId && (
          <div style={{ position: "absolute", top: "20px", right: "20px" }}>
            <button onClick={toggleEditPost} className="custom-btn" style={{ marginRight: "10px" }}>
              {isEditingPost ? "수정 취소" : "수정"}
            </button>
            <button onClick={handleDelete} className="custom-btn">
              삭제
            </button>
          </div>
        )}

        {/* 게시물 제목 및 내용 */}
        {isEditingPost ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "60px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #8BC9FF" }}
              placeholder="제목을 입력하세요"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{ width: "100%", height: "200px", padding: "10px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #8BC9FF" }}
              placeholder="내용을 입력하세요"
            />
            <button onClick={handleEditSubmit} className="custom-btn">
              저장
            </button>
          </>
        ) : (
          <>
            <h1 style={{ marginTop: "60px" }}>{post.title}</h1>
            <p>{post.content}</p>
            <p>작성자: {post.nickname}</p>
            <p>작성일: {new Date(post.createDate).toLocaleString()}</p>
          </>
        )}

        <hr style={{ borderTop: "1px solid #8BC9FF", margin: "20px 0" }} />

        {/* 댓글 리스트 */}
        <h3>댓글</h3>
        {comments.length > 0 ? (
          <ul>
            {comments.map(comment => (
              <li key={comment.commentId} style={{ marginBottom: "20px" }}>
                {editingCommentId === comment.commentId ? (
                  <>
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      style={{ width: "100%", height: "80px", marginBottom: "10px" }}
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
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      <p>작성자: {comment.nickname || "알 수 없음"}</p>
                      <p>작성일: {new Date(comment.createdDate).toLocaleString()}</p>
                    </div>
                    {(user.memberId === post.memberId || user.memberId === comment.memberId) && (
                      <>
                        <button 
                          onClick={() => handleEditComment(comment.commentId, comment.content)} 
                          className="custom-btn"
                          style={{ marginTop: "10px" }}
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.commentId)} 
                          className="custom-btn"
                          style={{ marginTop: "10px" }}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>댓글이 없습니다.</p>
        )}

        {/* 새 댓글 입력 */}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #8BC9FF" }}
        />
        <button onClick={handleAddComment} className="custom-btn">댓글 달기</button>
      </div>

      {/* 스크롤바 스타일 */}
      <style>
      {`
        ::-webkit-scrollbar {
          width: 10px;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #8BC9FF;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background-color: #f5f5f5;
        }
        .custom-btn {
          padding: 5px 10px;
          border: 1px solid #8BC9FF;
          background-color: white;
          color: black;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .custom-btn:hover {
          background-color: #8BC9FF;
          color: white;
        }
      `}
      </style>
    </div>
  );
}

export default PostViewPage;
