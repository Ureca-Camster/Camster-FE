import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRanks } from '../store/rankSlice.ts';
import { ListGroup } from 'react-bootstrap';

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Rank = () => {
    const { ranks, lastUpdated } = useSelector((state) => state.rank);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRanks = async () => {
            try {
                const response = await fetch('your-api-endpoint');
                const data = await response.json();
                const today = new Date().toISOString().split('T')[0];
                dispatch(setRanks({ ranks: data.rank, lastUpdated: today }));
            } catch (error) {
                console.error('Failed to fetch ranks:', error);
            }
        };

        const today = new Date().toISOString().split('T')[0];
        if (!lastUpdated || lastUpdated !== today) {
            //   fetchRanks();
            dispatch(setRanks({ ranks: [

                {"nickname": "강아지", "time":10000},
        
                {"nickname": "고양이", "time":8000},
        
                {"nickname": "토끼토끼", "time":7503}
        
            ], lastUpdated: today }));
        }
    }, [dispatch, lastUpdated]);

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
                    <span style={{ color: '#2299FF', fontFamily:'Paperlogy-7Bold', letterSpacing:'3px'}}>{formatTime(rank.time)}</span>
                </ListGroup.Item>
            ))}
        </ListGroup>
        </div>
    );
};

export default Rank;
