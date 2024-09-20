import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage(props) {
    const navigate = useNavigate();
    const linkStyle = {
        color: 'blue',
        textDecoration: 'underline',
        cursor: 'pointer'
    };
    return (
        <div>
            <p>404</p>
            <p style={linkStyle} onClick={() => navigate("/")}>Go back to home</p>
        </div>
    );
}

export default NotFoundPage;