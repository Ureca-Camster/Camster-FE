import React from 'react';
import { useParams } from 'react-router-dom';

function PostViewPage(props) {
	const { postId } = useParams();
    return (
        <div>
            { postId } Post Page
        </div>
    );
}

export default PostViewPage;