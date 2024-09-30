import React from 'react';
import './PostList.css';
import { MdAddCircle } from "react-icons/md";

function PostList({ posts, onCreatePost, onPostClick }) {
  return (
    <div className="post-list-container">
      <div className='post-create' onClick={onCreatePost}>
        <MdAddCircle className='post-create-button' />
        <span>새 게시물을 작성하세요</span>
      </div>
      <div className="post-list-content">
        {posts.length > 0 ? (
          <ul style={{paddingLeft:"0"}}>
            {posts.map((post) => (
              <li key={post.id} className="post-item">
                <div onClick={() => onPostClick(post)} className="post-link">
                  <p className='post-item-title'>{post.title}</p>
                  <p className="post-content-preview">{post.content}</p>
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