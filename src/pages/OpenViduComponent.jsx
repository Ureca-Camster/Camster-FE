import React, { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';

const OpenViduComponent = () => {
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [sessionName, setSessionName] = useState('');
    const [participantName, setParticipantName] = useState('');
    const [showJoinForm, setShowJoinForm] = useState(true);
    const [error, setError] = useState('');

    const OV = useRef(new OpenVidu());

    useEffect(() => {
        return () => {
            if (session) {
                leaveSession();
            }
        };
    }, [session]);

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
            console.log('Create session response:', data);  // 디버깅을 위한 로그
            return data.sessionId || data.id || sessionId;  // 서버 응답에 따라 적절한 값 반환
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
            console.log('Create token response:', data);  // 디버깅을 위한 로그
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
        if (!sessionName || !participantName) {
            setError('Session and participant names are required');
            return;
        }

        try {
            const token = await getToken(sessionName);
            
            let newSession = OV.current.initSession();
            setSession(newSession);

            newSession.on('streamCreated', (event) => {
                const subscriber = newSession.subscribe(event.stream, undefined);
                setSubscribers(prev => [...prev, subscriber]);
            });

            newSession.on('streamDestroyed', (event) => {
                setSubscribers(prev => prev.filter(sub => sub !== event.stream.streamManager));
            });

            await newSession.connect(token, { clientData: participantName });

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
            setShowJoinForm(false);
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
        setShowJoinForm(true);
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
            {showJoinForm ? (
                <div>
                    <h1>Join Session</h1>
                    <input
                        type="text"
                        placeholder="Session Name"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                    />
                    <button onClick={joinSession}>Join</button>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
            ) : (
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
                </div>
            )}
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

export default OpenViduComponent;