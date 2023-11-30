import React, { useCallback } from 'react';
import moment from 'moment';
import 'moment-business-time';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const CalComp = ({ events, getEvents, defaultView, height })=> {
  
  const dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 0 && {
        style: { backgroundColor: 'rgb(150,150,150,0.1)' }
      }),
      ...(moment(date).day() === 6 && {
        style: { backgroundColor: 'rgb(150,150,150,0.1)' }
      }),
      ...(moment(date).isHoliday() && {
        className: 'yellowGlow'
      }),
    }),
    []
  );
  
  const eventPropGetter = useCallback(
    ({done, pass, mId}) => ({
      ...(mId !== undefined && {
        className: 'midnightblue miniAction'
      }),
      ...(done && {
        className: `green ${mId ? 'miniAction' : ''}`
      }),
      ...(pass && {
        className: `orange ${mId ? 'miniAction' : ''}`
      })
    }),
    []
  );
  
  const handleSelectEvent = useCallback(
    (event) => {
      if(event.mId) {
        if(moment().isBetween(event.start, event.end) || moment().isSame(event.end, 'day')) {
          Session.set('now', event.link);
          Session.set('nowSV', event.mId);
          FlowRouter.go('/production');
        }
      }
    },
    []
  );

  return(
  	<Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView={defaultView}
      views={['month', 'week']}
      style={{ height: height }}
      onNavigate={(e)=>getEvents(e)}
      popup={true}
      dayPropGetter={dayPropGetter}
      eventPropGetter={eventPropGetter}
      onSelectEvent={handleSelectEvent}
      // onDoubleClickEvent={handleSelectEvent}
  	/>
  );
};

export default CalComp;