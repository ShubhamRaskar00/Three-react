import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../../components';
import axios from 'axios';

const localizer = momentLocalizer(moment);

function Schedule() {
  const [events, setEvents] = useState([]);
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setIsGoogleAuthorized(true);
      setAccessToken(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
  });

  const handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      const newEvent = { start, end, title };
      setEvents([...events, newEvent]);
      if (isGoogleAuthorized) {
        addEventToGoogleCalendar(newEvent);
      }
    }
  };

  const addEventToGoogleCalendar = async (event) => {
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/api/add-event`,
        {
          accessToken,
          event,
        }
      );

      if (response.data.success) {
        console.log('Event added to Google Calendar:', response.data.event);
        // update the local state with the returned event data
        // setEvents(prevEvents => [...prevEvents, response.data.event]);
      } else {
        console.error('Failed to add event to Google Calendar');
      }
    } catch (error) {
      console.error('Error adding event to Google Calendar:', error);
    }
  };

  return (
    <div className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      {!isGoogleAuthorized && (
        <Button onClick={() => login()} className="mb-4 bg-blue-500 text-white hover:bg-blue-700 ">
          Link Google Calendar
        </Button>
      )}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 100px)' }}
        selectable
        onSelectSlot={handleSelect}
      />
    </div>
  );
}

export default Schedule;