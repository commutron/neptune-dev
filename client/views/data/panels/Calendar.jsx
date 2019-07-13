import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';
import Spin from '/client/components/uUi/Spin.jsx';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';

const Calendar = ({ eventsSubReady, allBatch, bCache, app }) => {
  
  const localizer = BigCalendar.momentLocalizer(moment);
  let startTime = new Date(); startTime.setHours(Pref.statisticalStartHour,00,00);
  let endTime = new Date(); endTime.setHours(Pref.statisticalEndHour,00,00);
  
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
    //let startEvent = eventsSource.length > 0 ? eventsSource[0].time : false;
    //let completeEvent = entry.finishedAt !== false ? entry.finishedAt : new Date();
    for(let ev of eventsSource) {
      eventsFormat.push({
        id : Math.random().toString(36).substr(2, 5),
        title : `${entry.batch} ${ev.detail}`,
        start : ev.time,
        end : ev.time,
      });
    }
    return eventsFormat;
  });
  const newTideMap = allBatch.map( (entry, index)=> {
    let tidesSource = entry.tide || [];
    let tidesFormat = [];
    for(let td of tidesSource) {
      const stopTime = !td.stopTime ? new Date() : td.stopTime;
      tidesFormat.push({
        id : td.tKey,
        title : `${entry.batch}`,
        start : td.startTime,
        end : stopTime,
      });
    }
    return tidesFormat;
  });
  const taskList = [].concat(...newEventsMap,...newTideMap);
  
  return(
    <div className='overscroll'>
      <div className='centre' style={{ minHeight: '80vh'}}>
   
        <p></p>
        <BigCalendar
          events={taskList}
          localizer={localizer}
          defaultDate={new Date()}
          defaultView='month'
          views={{ month: true, work_week: true, day: true }}
          showMultiDayTimes={true}
          step={15}
          timeslots={4}
          popup={true}
          selectable='ignoreEvents'
          min={startTime}
          max={endTime}
          drilldownView='day'
          style={{ minHeight: '80vh', width: '80vw' }}
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