import React, { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { useAppSelector } from '../store/hooks.ts';
import { useParams } from 'react-router-dom';

const CamStudyPage = () => {
    const { studyId } = useParams();
    const user = useAppSelector((state) => state.user);

    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [error, setError] = useState('');

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
                const subscriber = newSession.subscribe(event.stream, undefined);
                setSubscribers(prev => [...prev, subscriber]);
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
            publisher.publishVideo(!publisher.stream.videoActive);
        }
    };

    const toggleAudio = () => {
        if (publisher) {
            publisher.publishAudio(!publisher.stream.audioActive);
        }
    };

    return (
            <div>
                <h1>Video Session</h1>
                <div id="video-container">
                    {publisher && (
                        <div className="stream-container">
                            <UserVideoComponent streamManager={publisher} />
                        </div>
                    )}
                    {subscribers.map((sub, i) => (
                        <div key={i} className="stream-container">
                            <UserVideoComponent streamManager={sub} />
                        </div>
                    ))}
                </div>
                <button onClick={leaveSession}>Leave Session</button>
                <button onClick={toggleVideo}>Toggle Video</button>
                <button onClick={toggleAudio}>Toggle Audio</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
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
        <video autoPlay={true} ref={videoRef} />
    );
};

export default CamStudyPage;