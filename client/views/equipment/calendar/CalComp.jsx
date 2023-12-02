import React, { useCallback } from 'react';
import moment from 'moment';
import 'moment-business-time';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const CalComp = ({ events, getEvents, defaultView, height })=> {
  const now = moment();
  
  const dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 0 && {
        style: { backgroundColor: 'rgb(150,150,150,0.1)' }
      }),
      ...(moment(date).day() === 6 && {
        style: { backgroundColor: 'rgb(150,150,150,0.1)' }
      }),
      ...(moment(date).isHoliday() && {
        className: 'grayFade'
      }),
      ...(moment(date).isSame(now, 'day') && {
        style: {backgroundColor: "hsl(210 29% 84%)" }
      }),
    }),
    []
  );
  
  const clicker = (start, end)=> {
    return now.isBetween(start, end, 'day') ? 'miniAction' : '';
  };
  
  const eventPropGetter = useCallback(
    ({done, pass, willpass, mId, start, end}) => ({
      ...(mId !== undefined && {
        className: 'midnightblue whiteT miniAction'
      }),
      ...(done && {
        className: `green ${clicker(start, end)}`
      }),
      ...(pass && {
        className: `trueyellow ${clicker(start, end)}`
      }),
      ...(willpass && {
        className: `yellowGlow`
      })
    }),
    []
  );
  
  const handleSelectEvent = useCallback(
    (event) => {
      if(event.mId) {
        // if(moment().isBetween(event.start, event.end) || moment().isSame(event.end, 'day')) {
        if(moment().isBetween(event.start, event.end, 'day')) {
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