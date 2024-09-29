// PostList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PostList({ posts, onCreatePost }) {
  return (
    <div style={styles.container}>
      <button className="custom-btn" onClick={onCreatePost}>+</button> 새 게시물을 작성하세요
      <div style={{ marginTop: "20px" }}>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.boardId} style={styles.postItem}>
                <Link to={`/post/${post.boardId}`}>
                  <h3>{post.title}</h3>
                </Link>
                <h5>{post.content}</h5>
                <p>작성자: {post.nickname || "알 수 없음"}</p>
                <p>작성일: {new Date(post.createDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: "6",
    border: "1px solid #8BC9FF",
    padding: "20px",
    borderRadius: "10px",
    maxHeight: "500px",
    overflowY: "auto"
  },
  postItem: {
    marginBottom: "10px",
    borderBottom: "1px solid #8BC9FF",
    paddingBottom: "10px"
  }
};

export default PostList;