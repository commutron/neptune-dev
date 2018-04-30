import React from 'react';
import moment from 'moment';

const FirstsTimeline = ({ id, batch, doneFirsts })=> {
   let sortedFirst = doneFirsts.sort((x, y)=> {
                      if (moment(x.time).isBefore(y.time)) { return -1 }
                      if (moment(y.time).isBefore(x.time)) { return 1 }
                      return 0;
                    });
                    
                    
                    
  return(
    <div className='wide centre'>
      <h3>Process First-Offs</h3>
      <div className='timelineList'>
        {sortedFirst.map( (dt, index)=>{
          let color = dt.good === true ? 'good' : dt.good === false ? 'bad' : 'fine';
          return(
            <div key={index} className='timelineWrap'>
              <dl className={'timelineItem ' + color}>
                <dt className='timelineItemTitle'>{moment(dt.time).format("YYYY, ddd, MMM Do, h:mm a")}</dt>
                <dd className='timelineItemBody cap'>
                  {dt.step} <i className='breath'></i>
                  <button
                    className='leapText'
                    onClick={()=>FlowRouter.go('/data/batch?request=' + batch + '&specify=' + dt.bar)}
                  >{dt.bar}</button>
                </dd>
              </dl>
            </div>
        )})}
      </div>
      <div className='timelineListFooter centre'><i className='fas fa-chevron-down fa-lg fa-fw blueT'></i></div>
    </div>
  );
};

export default FirstsTimeline;