import React from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import './Layout.css'; // 새로운 CSS 파일을 import합니다

function Layout() {
    return (
        <div className="layout">
            <NavBar />
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;