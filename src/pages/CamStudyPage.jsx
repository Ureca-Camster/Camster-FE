import React, { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { useAppSelector } from '../store/hooks.ts';
import { useParams } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { MdMic, MdMicOff } from "react-icons/md";

import './CamStudyPage.css'

const CamStudyPage = () => {
    const { studyId } = useParams();
    const user = useAppSelector((state) => state.user);

    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [error, setError] = useState('');
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);

    const OV = useRef(new OpenVidu());

    useEffect(() => {
        joinSession();
        return () => {
            if (session) {
                leaveSession();
            }
        };
    }, []);

    const getToken = async (mySessionId) => {
        const createSession = async (sessionId) => {
            const response = await fetch(`/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customSessionId: sessionId }),
            });
            if (!response.ok) {
                throw new Error(`Unable to create session: ${await response.text()}`);
            }
            const data = await response.json();
            console.log('Create session response:', data);
            return data.sessionId || data.id || sessionId;
        };

        const createToken = async (sessionId) => {
            if (!sessionId) {
                throw new Error('Session ID is undefined');
            }
            const response = await fetch(`/sessions/${sessionId}/connections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`Unable to create token: ${await response.text()}`);
            }
            const data = await response.text();
            console.log('Create token response:', data);
            return data;
        };

        try {
            console.log('Attempting to create session with ID:', mySessionId);
            const sessionId = await createSession(mySessionId);
            console.log('Session created with ID:', sessionId);
            const token = await createToken(sessionId);
            console.log('Token created:', token);
            return token;
        } catch (error) {
            console.error('Error in getToken:', error);
            throw error;
        }
    };

    const joinSession = async () => {
        try {
            const token = await getToken(studyId);

            let newSession = OV.current.initSession();
            setSession(newSession);

            newSession.on('streamCreated', (event) => {
                // 자신의 스트림은 구독하지 않음
                if (event.stream.connection.connectionId !== newSession.connection.connectionId) {
                    const subscriber = newSession.subscribe(event.stream, undefined);
                    setSubscribers(prev => [...prev, subscriber]);
                }
            });

            newSession.on('streamDestroyed', (event) => {
                setSubscribers(prev => prev.filter(sub => sub !== event.stream.streamManager));
            });

            await newSession.connect(token, { clientData: user.nickname });

            let publisher = await OV.current.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            newSession.publish(publisher);
            setPublisher(publisher);
        } catch (error) {
            console.error('Error joining session:', error);
            setError(`Failed to join session: ${error.message}`);
        }
    };

    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
        window.close();
    };

    const toggleVideo = () => {
        if (publisher) {
            publisher.publishVideo(!isVideoOn);
            setIsVideoOn(!isVideoOn);
        }
    };

    const toggleAudio = () => {
        if (publisher) {
            publisher.publishAudio(!isAudioOn);
            setIsAudioOn(!isAudioOn);
        }
    };

    const parseClientData = (connectionData) => {
        try {
            const parsedData = JSON.parse(connectionData);
            return parsedData.clientData || 'Unknown';
        } catch (error) {
            console.error('Error parsing client data:', error);
            return 'Unknown';
        }
    };

    return (
        <div>
            <div id="video-container">
                {publisher && (
                    <div className="stream-container">
                        <UserVideoComponent streamManager={publisher} />
                        <div className="stream-name">{user.nickname} (나)</div>
                    </div>
                )}
                {subscribers.map((sub, i) => (
                    <div key={i} className="stream-container">
                        <UserVideoComponent streamManager={sub} />
                        <div className="stream-name">{parseClientData(sub.stream.connection.data)}</div>
                    </div>
                ))}
            </div>
            <div className='video-controls'>
                <button onClick={leaveSession} className="control-button"><CiLogout /> 나가기</button>
                <button onClick={toggleVideo} className={`control-button ${isVideoOn ? '' : 'active'}`}>
                    {isVideoOn ? (
                        <>
                            <IoVideocamOff /> 비디오 끄기
                        </>
                    ) : (
                        <>
                            <IoVideocam /> 비디오 켜기
                        </>
                    )}
                </button>
                <button onClick={toggleAudio} className={`control-button ${isAudioOn ? '' : 'active'}`}>
                    {isAudioOn ? (
                        <>
                            <MdMicOff /> 오디오 끄기
                        </>
                    ) : (
                        <>
                            <MdMic /> 오디오 켜기
                        </>
                    )}
                </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

const UserVideoComponent = ({ streamManager }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <div className="video-wrapper">
            <video autoPlay={true} ref={videoRef} />
        </div>
    );
};

export default CamStudyPage;