import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isToday, isSameMonth } from 'date-fns';
import './MonthlyTracker.css';
import { useAppSelector } from '../../store/hooks.ts';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthlyTracker = ({ memberId }) => {
  const user = useAppSelector((state) => state.user);

  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [recordList, setRecordList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(currentDate, 'yyyy-MM-dd'));
  const [hoveredDate, setHoveredDate] = useState(null);

  const isCurrentMonth = isSameMonth(new Date(year, month - 1), currentDate);

  useEffect(() => {
    fetchData();
  }, [memberId, year, month]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/records?year=${year}&month=${month}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setRecordList(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePrevMonth = () => {
    const prevDate = subMonths(new Date(year, month - 1, 1), 1);
    setYear(prevDate.getFullYear());
    setMonth(prevDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    if (!isCurrentMonth) {
      const nextDate = addMonths(new Date(year, month - 1, 1), 1);
      setYear(nextDate.getFullYear());
      setMonth(nextDate.getMonth() + 1);
    }
  };

  const handleDateClick = (date, record) => {
    if (record?.time > 0 || isToday(new Date(date))) {
      setSelectedDate(date);
    }
  };

  const handleDateHover = (date, hasData) => {
    if (hasData || isToday(new Date(date))) {
      setHoveredDate(date);
    } else {
      setHoveredDate(null);
    }
  };

  const renderCalendar = () => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const daysInMonth = endDate.getDate();
    const startDay = startDate.getDay();

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isCurrentDay = isToday(new Date(date));
      let record;
      let hasData;
      let time;

      if (isCurrentDay) {
        time = user.todayTime;
        hasData = time > 0;
      } else {
        record = recordList.find(r => r.date === date);
        time = record ? record.time : 0;
        hasData = time > 0;
      }

      const percentage = hasData ? Math.min(100, Math.round((time / user.goalTime) * 100)) : 0;

      let backgroundColor;
      if (hasData) {
        backgroundColor = percentage >= 100 ? '#8BC9FF' : `rgba(139, 201, 255, ${percentage / 100})`;
      } else if (isCurrentDay) {
        backgroundColor = 'white'; // Today with no data is white
      } else {
        backgroundColor = 'white';
      }

      const hoverColor = `rgba(${139 * 0.8}, ${201 * 0.8}, ${255 * 0.8}, ${Math.max(0.7, percentage / 100)})`;

      calendarDays.push(
        <div
          key={date}
          className={`day ${selectedDate === date ? 'selected' : ''} ${hasData || isCurrentDay ? 'has-data' : 'no-data'} ${isCurrentDay ? 'today' : ''}`}
          style={{ 
            backgroundColor: hoveredDate === date ? hoverColor : backgroundColor,
            cursor: hasData || isCurrentDay ? 'pointer' : 'default'
          }}
          onClick={() => handleDateClick(date, { time })}
          onMouseEnter={() => handleDateHover(date, hasData || isCurrentDay)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  const getSelectedDateInfo = () => {
    const isSelectedToday = isToday(new Date(selectedDate));
    let time;

    if (isSelectedToday) {
      time = user.todayTime;
    } else {
      const record = recordList.find(r => r.date === selectedDate);
      time = record ? record.time : 0;
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const percentage = time > 0 ? Math.round((time / user.goalTime) * 100) : 0;

    return {
      timeFormatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      percentage
    };
  };

  return (
    <div className="monthly-tracker">
      <div className='calendar-div'>
      <div className="calendar-header">
        <button className="nav-button" onClick={handlePrevMonth}>◀️</button>
        <h2>{year}<br></br>{monthNames[month - 1]}</h2>
        {!isCurrentMonth && <button className="nav-button" onClick={handleNextMonth}>▶️</button>}
        {isCurrentMonth && <div className="nav-button-placeholder"></div>}
      </div>
      <div className="calendar">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        {renderCalendar()}
      </div>
      </div>
      {selectedDate && (
        <div className="selected-date-info">
          <span>{selectedDate}</span>
          <span style={{letterSpacing:'1px'}}>{getSelectedDateInfo().timeFormatted}</span>
          <span style={{letterSpacing:'1px'}}>{getSelectedDateInfo().percentage} %</span>
        </div>
      )}
    </div>
  );
};

export default MonthlyTracker;