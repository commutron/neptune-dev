import React from 'react';
import moment from 'moment';
import '/client/components/bigUi/ItemFeed/style.css';
import { HistoryBlock } from '/client/components/bigUi/ItemFeed/ItemFeed.jsx';

const EventsTimeline = ({ id, batch, verifyList, eventList, doneBatch })=> {

  let sortedList = [...verifyList, ...eventList].sort((x, y)=> {
                      if (moment(x.time).isBefore(y.time)) { return -1 }
                      if (moment(y.time).isBefore(x.time)) { return 1 }
                      return 0;
                    });
                    
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
        {verifyList.length > 0 && eventList.length > 0 &&
          <p>Combined timeline of Events and First-Off Verifications</p>}
        {sortedList.map( (dt, ix)=>{
          if(!dt.key) {
            return( 
              <EventBlock
                key={dt.time.toISOString()+ix}
                dt={dt} /> 
            );
          }else{
            return( 
              <HistoryBlock
                key={dt.time.toISOString()+ix}
                entry={dt}
                id={id}
                batch={batch}
                serial={dt.serial}
                done={doneBatch}
                showHeader={true} /> 
            );
          }
        })}
      </div>
    </div>
  );
};

export default EventsTimeline;


const EventBlock = ({ dt })=>{

  return(
    <div className='infoBlock genericEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className="far fa-calendar-plus fa-lg fa-fw iG"></i>
          </div>
          <div>{dt.title} - {dt.detail}</div>
        </div>
        <div className='rightText'>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'></div>
        </div>
      </div>
    </div>
  );
};