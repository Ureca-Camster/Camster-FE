import React from 'react';

function PostList({ posts, onCreatePost, onPostClick }) {
  return (
    <div style={styles.container}>
      <button className="custom-btn" onClick={onCreatePost}>+</button> 새 게시물을 작성하세요
      <div style={{ marginTop: "20px" }}>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id} style={styles.postItem}>
                <div onClick={() => onPostClick(post)} style={styles.postLink}>
                  <h3>{post.title}</h3>
                  <h5>{post.content}</h5>
                  <p>작성자: {post.nickname || "알 수 없음"}</p>
                  <p>작성일: {post.createDate}</p>
                </div>
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
  },
  postLink: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit'
  }
};

export default PostList;