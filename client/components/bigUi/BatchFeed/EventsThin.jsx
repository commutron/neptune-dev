import React from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js'
import '/client/components/bigUi/ItemFeed/style.css';

const EventsThin = ({ id, batch, eventList })=> {

  const eL = eventList || [];
  
  let sortedList = eL.sort((x, y)=> {
    if (x.time > y.time) { return -1 }
    if (x.time < y.time) { return 1 }
    return 0;
  });
                    
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
        
        {sortedList.map( (dt, ix)=>{
          return( 
            <dl className='space1v genericEvent indent cap' key={dt.time.toISOString()+ix}>
              <dt><i className="far fa-calendar-plus fa-fw iG"></i> {dt.title}</dt>
              <dd>{dt.detail}, {moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</dd>
            </dl>
          );
        })}
      </div>
    </div>
  );
};

export default EventsThin;
