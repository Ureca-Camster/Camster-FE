import React from 'react';
import NavBar from './NavBar'; // NavBar import
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div>
            <NavBar /> {/* 모든 페이지에서 공통으로 사용 */}
            <main>
                <Outlet /> {/* 현재 라우트에 맞는 페이지가 렌더링됨 */}
            </main>
        </div>
    );
}

export default Layout;
