import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js'
import '/client/components/bigUi/ItemFeed/style.css';

import CreateBlock from '/client/components/bigUi/ItemFeed/CreateBlock.jsx';
import { HistoryBlock } from '/client/components/bigUi/ItemFeed/ItemFeed.jsx';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const EventsTimeline = ({ 
  id, batchData, 
  releaseList, verifyList, eventList, alterList, quoteList, 
  doneBatch 
})=> {
  
  const rL = releaseList || [];
  const vL = verifyList || [];
  const eL = eventList || [];
  const aL = alterList || [];
  const qL = quoteList || [];
  
  let sortedList = [...rL, ...vL, ...eL, ...aL, ...qL].sort((x, y)=> {
    let timeX = x.time || x.changeDate || x.updatedAt;
    let timeY = y.time || y.changeDate || y.updatedAt;
    if (moment(timeX).isBefore(timeY)) { return -1 }
    if (moment(timeY).isBefore(timeX)) { return 1 }
    return 0;
  });
                    
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
        {vL.length > 0 && eL.length > 0 &&
          <p>Combined timeline of Events and First-Off Verifications</p>}
          
        <CreateBlock
          title={`${Pref.batch} created`}
          user={batchData.createdWho}
          datetime={batchData.createdAt} />
        
        {sortedList.map( (dt, ix)=>{
          if(dt.key) {
            return( 
              <HistoryBlock
                key={dt.time.toISOString()+ix}
                entry={dt}
                id={id}
                batch={batchData.batch}
                serial={dt.serial}
                done={doneBatch}
                showHeader={true} /> 
            );
          }else if( typeof dt.changeKey === 'string' ) {
            return( 
              <AlterBlock
                key={dt.changeDate.toISOString()+ix}
                dt={dt} /> 
            );
          }else if( typeof dt.timeAsMinutes === 'number' ) {
            return( 
              <QuoteBlock
                key={dt.updatedAt.toISOString()+ix}
                dt={dt} /> 
            );
          }else if( typeof dt.detail === 'string' ) {
            return( 
              <EventBlock
                key={dt.time.toISOString()+ix}
                dt={dt} /> 
            );
          }else{
            return( 
              <ReleaseBlock
                key={dt.time+ix}
                id={id}
                done={doneBatch}
                dt={dt} /> 
            );
          }
        })}
      </div>
    </div>
  );
};

export default EventsTimeline;


const AlterBlock = ({ dt })=>{

  return(
    <div className='infoBlock alterEvent'>
      
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className="fas fa-eraser fa-lg fa-fw iG"></i>
          </div>
          
          <div>Altered: <em className='clean'>"{dt.changeKey}"</em></div>
          <div>for {dt.changeReason}</div>
          
          
        </div>
        
        <div className='rightText'>
          <div><UserNice id={dt.changeWho} /></div>
          <div>{moment(dt.changeDate).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'></div>
        </div>
        
      </div>
      
      <div className='moreInfoList'>
        <dd>{dt.oldValue.toLocaleString()} <i className="fas fa-arrow-right fa-fw"></i> {dt.newValue.toLocaleString()}</dd>
      </div>
      
    </div>
  );
};

const QuoteBlock = ({ dt })=>{

  const hoursDur = moment.duration(dt.timeAsMinutes, "minutes")
                    .asHours().toFixed(2, 10);
  
  return(
    <div className='infoBlock alterEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className="fas fa-hourglass-start fa-lg fa-fw iG"></i>
          </div>
          <div>Quote Time set to {hoursDur} hours</div> 
          <div>({dt.timeAsMinutes} minutes)</div>
        </div>
        <div className='rightText'>
          <div>{moment(dt.updatedAt).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'></div>
        </div>
      </div>
    </div>
  );
};

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

const ReleaseBlock = ({ id, done, dt })=>{
  
  function handleCancel() {
    Meteor.call('cancelFloorRelease', id, (err)=>{
      err && console.log(err);
    });
  }
  
  return(
    <div className='infoBlock genericEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className={`leftAnchor ${dt.caution ? 'yellowT' : 'greenT'}`}>
            <i className="fas fa-flag fa-lg fa-fw"></i>
          </div>
          <div>Released to the Floor by <UserNice id={dt.who} /></div>
          {dt.caution ?
            <div>Caution: {dt.caution}</div>
          : null}
        </div>
        <div className='rightText'>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'>
	          <button
	            title='Cancel Release'
              className='miniAction'
              onClick={()=>handleCancel()} 
              disabled={done || !Roles.userIsInRole(Meteor.userId(), 'run')}
              readOnly={true}>
              <i className='fas fa-undo-alt fa-lg fa-fw'></i>
            </button>
	        </div>
        </div>
      </div>
    </div>
  );
};