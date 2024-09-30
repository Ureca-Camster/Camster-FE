import React from 'react';
import './PostList.css';

function PostList({ posts, onCreatePost, onPostClick }) {
  return (
    <div className="post-list-container">
      <button className="custom-btn" onClick={onCreatePost}>+</button> 새 게시물을 작성하세요
      <div className="post-list-content">
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="post-item">
                <div onClick={() => onPostClick(post)} className="post-link">
                  <h3>{post.title}</h3>
                  <h5 className="post-content-preview">{post.content}</h5>
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

export default PostList;