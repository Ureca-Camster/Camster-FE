import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Layout from "./component/Layout";
import MainPage from "./pages/MainPage";
import PostWritePage from "./pages/PostWritePage";
import PostViewPage from "./pages/PostViewPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudyRoomPage from "./pages/StudyRoomPage";
import CamStudyPage from "./pages/CamStudyPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<MainPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="mypage" element={<MyPage />} />
                    <Route path="study/:studyNo" element={<StudyRoomPage />} />
                    <Route path="study/:studyNo/camstudy" element={<CamStudyPage />} />
                    <Route path="post-write" element={<PostWritePage />} />
                    <Route path="post/:boardId" element={<PostViewPage />} />
                </Route>
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
