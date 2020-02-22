import React, { useState, useEffect } from 'react';
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
  
  const [ incList, incListSet ] = useState( [] );
  
  const [ incRelease, releaseSet ] = useState( true );
  const [ incVerify, verifySet ] = useState( true );
  const [ incEvent, eventSet ] = useState( true );
  const [ incAlter, alterSet ] = useState( true );
  const [ incQuote, quoteSet ] = useState( true );
  
  useEffect( ()=>{
    const rL = incRelease ? releaseList || [] : [];
    const vL = incVerify ? verifyList || [] : [];
    const eL = incEvent ? eventList || [] : [];
    const aL = incAlter ? alterList || [] : [];
    const qL = incQuote ? quoteList || [] : [];
    const fn = batchData.finishedAt !== false ? 
                [{ complete: true, time: batchData.finishedAt }] : [];
    
    const concatPings = [...rL, ...vL, ...eL, ...aL, ...qL, ...fn];
    
    incListSet(concatPings);
    
  }, [
    releaseList, verifyList, eventList, alterList, quoteList,
    incRelease, incVerify, incEvent, incAlter, incQuote
  ]);
  
  let sortedList = incList.sort((x, y)=> {
    let timeX = x.time || x.changeDate || x.updatedAt;
    let timeY = y.time || y.changeDate || y.updatedAt;
    if (moment(timeX).isBefore(timeY)) { return -1 }
    if (moment(timeY).isBefore(timeX)) { return 1 }
    return 0;
  });
                    
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
        <div className='comfort uiCheck vbreak'>
          <span title='releases and clearances'>
            <input
              type='checkbox'
              id='inputRel'
              onChange={(e)=>releaseSet(!incRelease)}
              defaultChecked={incRelease} />
            <label htmlFor='inputRel'>Green-Lights</label>
          </span>
          <span title={`${Pref.trackFirst} verifications`}>
            <input
              type='checkbox'
              id='inputVer'
              onChange={(e)=>verifySet(!incVerify)}
              defaultChecked={incVerify} />
            <label htmlFor='inputVer'>{Pref.trackFirst}s</label>
          </span>
          <span title='general and benchmark events'>
            <input
              type='checkbox'
              id='inputEvt'
              onChange={(e)=>eventSet(!incEvent)}
              defaultChecked={incEvent} />
            <label htmlFor='inputEvt'>Events</label>
          </span>
          <span title='top-level alterations'>
            <input
              type='checkbox'
              id='inputAlt'
              onChange={(e)=>alterSet(!incAlter)}
              defaultChecked={incAlter} />
            <label htmlFor='inputAlt'>Alters</label>
          </span>
          <span title={`quote ${Pref.timeBudget} changes`}>
            <input
              type='checkbox'
              id='inputQut'
              onChange={(e)=>quoteSet(!incQuote)}
              defaultChecked={incQuote} />
            <label htmlFor='inputQut'>Quotes</label>
          </span>
        </div>
          
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
          }else if( typeof dt.who === 'string' ) {
            return( 
              <ReleaseBlock
                key={dt.time+ix}
                id={id}
                done={doneBatch}
                dt={dt}
                icon={dt.type === 'floorRelease' && 'fas fa-flag'} /> 
            );
          }else if( typeof dt.complete === 'boolean' ) {
            return( 
              <CompleteBlock
                key={'completefinish'+ix}
                title={`${Pref.batch} complete`}
                datetime={dt.time} />
            );
          }else{
            return( null );
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

const ReleaseBlock = ({ id, done, dt, icon })=>{

  // const actionString = aK = 'floorRelease' ? 'Released to the Floor' :
  //                           'smtKitRelease' ? 'Cleared for SMT' :
  //                           'thKitRelease' ? 'Cleared for Through Hole' :
  //                           'pcbKitRelease' ? 'Cleared for PCBs' :
  //                           'Released';
  const aK = dt.type;
  
  let actionString = aK === 'floorRelease' ? 
                      'Released to the Floor' : 'Released';
  for(let cl of Pref.clearencesArray) {
    if( aK === cl.keyword ) {
      actionString = `${cl.post} ${cl.link} ${cl.context}`;
      break;
    }
  }
  
  function handleCancel() {
    // Meteor.call('cancelFloorRelease', id, (err)=>{
    //   err && console.log(err);
    // }); // DEPRECIATED
    Meteor.call('cancelReleaseLEGACY', id, aK, (err)=>{
      err && console.log(err);
    });
  }
  
  return(
    <div className='infoBlock genericEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className={`leftAnchor ${dt.caution ? 'yellowT' : 'greenT'}`}>
            <i className={`${icon || 'fas fa-check-square'} fa-lg fa-fw`}></i>
          </div>
          <div>{actionString} by <UserNice id={dt.who} /></div>
          {dt.caution ?
            <div>Caution: {dt.caution}</div>
          : null}
        </div>
        <div className='rightText'>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'>
	          <button
	            title='Cancel'
              className='miniAction'
              onClick={()=>handleCancel()} 
              disabled={done || !Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])}
              readOnly={true}>
              <i className='fas fa-undo-alt fa-lg fa-fw'></i>
            </button>
	        </div>
        </div>
      </div>
    </div>
  );
};


const CompleteBlock = ({ title, datetime })=> (
  
  <div className='infoBlock finish'>
    <div className='blockTitle cap'>
      <div>
        <div className='leftAnchor'><i className="fas fa-flag-checkered fa-lg fa-fw iPlain"></i></div>
        <div>{title}</div>
      </div>
      <div className='rightText'>
        <div>{moment(datetime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
        <div className='rightAnchor'></div>
      </div>
    </div>
  </div>
);