import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./component/page/MainPage";
import PostWritePage from "./component/page/PostWritePage";
import PostViewPage from "./component/page/PostViewPage";
import LoginPage from "./component/page/LoginPage";
import RegisterPage from "./component/page/RegisterPage";
import StudyRoomPage from "./component/page/StudyRoomPage";
import CamStudyPage from "./component/page/CamStudyPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<MainPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="study/:studyNo" element={<StudyRoomPage />} />
                <Route path="study/:studyNo/camstudy" element={<CamStudyPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="post-write" element={<PostWritePage />} />
                <Route path="post/:postId" element={<PostViewPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
