import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Rank = () => {
    const [ranks, setRanks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRanks = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/records/rank');
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setRanks(data);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Failed to fetch ranks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRanks();
    }, []); // 빈 의존성 배열은 컴포넌트가 마운트될 때만 실행됨을 의미합니다

    if (isLoading) {
        return <div>Loading ranks...</div>;
    }

    return (
        <div>
            <h3 style={{fontWeight: "bold", marginBottom: "0"}}>어제의 TOP3👑</h3>
            <ListGroup className="mx-auto">
                {ranks.slice(0, 3).map((rank, index) => (
                    <ListGroup.Item 
                        key={index} 
                        className="d-flex justify-content-between align-items-center"
                        style={{ 
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: '300px',
                        }}
                    >
                        <span className="fw-bold" style={{ width: '30px', fontFamily:'Krona One' }}>{index + 1}</span>
                        <span className="flex-grow-1" style={{ paddingTop: '1px' , marginTop: '1px'}}>{rank.nickname}</span>
                        <span style={{ color: '#2299FF', fontFamily:'Paperlogy-8ExtraBold', letterSpacing:'3px'}}>{formatTime(rank.time)}</span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default Rank;