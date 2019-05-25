import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
//import Pref from '/client/global/pref.js';
import Spin from '/client/components/uUi/Spin.jsx';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';

const Calendar = ({ eventsSubReady, allBatch, bCache, app }) => {
  
  const localizer = BigCalendar.momentLocalizer(moment);
  
  if( !eventsSubReady || !app ) {
    return(
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }

  const newEventsMap = allBatch.map( (entry, index)=> {
    let eventsSource = entry.events || [];
    let eventsFormat = [];
    let startEvent = eventsSource.length > 0 ? eventsSource[0].time : false;
    let completeEvent = entry.finishedAt !== false ? entry.finishedAt : new Date();
    if(startEvent !== false) {
      eventsFormat.push({
        id : Math.random().toString(36).substr(2, 5),
        title : `${entry.batch} - In Process`,
        start : startEvent,
        end : completeEvent,
        allDay : true
      });
    }
    for(let ev of eventsSource) {
      eventsFormat.push({
        id : Math.random().toString(36).substr(2, 5),
        title : `${entry.batch} - ${ev.detail}`,
        start : ev.time,
        end : ev.time,
      });
    }
    return eventsFormat;
  });
  const eventList = [].concat(...newEventsMap);
  
  return(
    <div className='overscroll'>
      <div className='centre'>
        <p></p>
        <BigCalendar
          events={eventList}
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          views={{ month: true, work_week: true }}
          showMultiDayTimes={true}
          popup={true}
          selectable='ignoreEvents'
          startAccessor="start"
          endAccessor="end"
          style={{ height: '80vh', width: '80vw' }}
        />
    
      </div>

    </div>
  );
};

export default withTracker( (props) => {
  const eventsSub = Meteor.subscribe('eventsData');

  return {
    eventsSubReady: eventsSub.ready(),
    allBatch: BatchDB.find( {}, { sort: { batch: -1 } } ).fetch(),
    bCache: CacheDB.findOne({dataName: 'batchInfo'}),
    app: props.app
  };
})(Calendar);