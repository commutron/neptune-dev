import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeedX/style.css';

import CreateBlock from '/client/components/bigUi/ItemFeedX/CreateBlock';
import EventBlock from './EventBlock';
import AlterBlock from './AlterBlock';
import QuoteBlock from './QuoteBlock';
import ReleaseBlock from './ReleaseBlock';
import CompleteBlock from './CompleteBlock';
import HistoryBlock from '/client/components/bigUi/ItemFeedX/HistoryBlock';

const XBatchTimeline = ({ 
  batchData, seriesId,
  releaseList, verifyList, eventList, alterList, quoteList, 
  doneBatch, brancheS
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
    const fn = batchData.completed ? 
                [{ complete: true, time: batchData.completedAt }] : [];
    
    const concatPings = [...rL, ...vL, ...eL, ...aL, ...qL, ...fn];
    
    incListSet(concatPings);
    
  }, [
    releaseList, 
    verifyList,
    eventList, 
    alterList,
    quoteList,
    incRelease, 
    incVerify,
    incEvent, 
    incAlter,
    incQuote
  ]);
  
  let sortedList = incList.sort((x, y)=> {
    let timeX = x.time || x.changeDate || x.updatedAt;
    let timeY = y.time || y.changeDate || y.updatedAt;
    if (moment(timeX).isBefore(timeY)) { return -1 }
    if (moment(timeY).isBefore(timeX)) { return 1 }
    return 0;
  });
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
  const canEdit = Roles.userIsInRole(Meteor.userId(), 'edit');

  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
        <div className='comfort uiCheck vbreak'>
          <span title='releases and clearances' className='middle'>
            <input
              type='checkbox'
              id='inputRel'
              onChange={(e)=>releaseSet(!incRelease)}
              defaultChecked={incRelease} />
            <label htmlFor='inputRel'>Clearances</label>
          </span>
          <span title={`${Pref.trackFirst} verifications`} className='middle'>
            <input
              type='checkbox'
              id='inputVer'
              onChange={(e)=>verifySet(!incVerify)}
              defaultChecked={incVerify} />
            <label htmlFor='inputVer'>{Pref.trackFirst}s</label>
          </span>
          <span title='top-level alterations' className='middle'>
            <input
              type='checkbox'
              id='inputAlt'
              onChange={(e)=>alterSet(!incAlter)}
              defaultChecked={incAlter} />
            <label htmlFor='inputAlt'>Alters</label>
          </span>
          <span title={`quote ${Pref.timeBudget} changes`} className='middle'>
            <input
              type='checkbox'
              id='inputQut'
              onChange={(e)=>quoteSet(!incQuote)}
              defaultChecked={incQuote} />
            <label htmlFor='inputQut'>Quotes</label>
          </span>
          
          <span title='general and benchmark events' className='middle'>
            <input
              type='checkbox'
              id='inputEvt'
              onChange={(e)=>eventSet(!incEvent)}
              defaultChecked={incEvent} />
            <label htmlFor='inputEvt'>Events</label>
          </span>
        </div>
          
        <CreateBlock
          title={`${Pref.xBatch} created`}
          user={batchData.createdWho}
          datetime={batchData.createdAt}
          cal={calFunc} />
        
        {sortedList.map( (dt, ix)=>{
          if(dt.key) {
            return( 
              <HistoryBlock
                key={dt.time.toISOString()+ix}
                entry={dt}
                seriesId={seriesId}
                serial={dt.serial}
                canEdit={canEdit}
                cal={calFunc} /> 
            );
          }else if( typeof dt.changeKey === 'string' ) {
            return( 
              <AlterBlock
                key={dt.changeDate.toISOString()+ix}
                dt={dt}
                cal={calFunc} /> 
            );
          }else if( typeof dt.timeAsMinutes === 'number' ) {
            return( 
              <QuoteBlock
                key={dt.updatedAt.toISOString()+ix}
                dt={dt}
                cal={calFunc} /> 
            );
          }else if( typeof dt.detail === 'string' ) {
            return( 
              <EventBlock
                key={dt.time.toISOString()+ix}
                dt={dt}
                cal={calFunc} /> 
            );
          }else if( typeof dt.who === 'string' ) {
            return( 
              <ReleaseBlock
                key={dt.time+ix}
                id={batchData._id}
                done={doneBatch}
                dt={dt}
                icon={dt.type === 'floorRelease' && 'fas fa-flag'}
                brancheS={brancheS}
                cal={calFunc} /> 
            );
          }else if( typeof dt.complete === 'boolean' ) {
            return( 
              <CompleteBlock
                key={'completefinish'+ix}
                title={`${Pref.xBatch} complete`}
                datetime={dt.time}
                cal={calFunc} />
            );
          }else{
            return( null );
          }
        })}
          
      </div>
    </div>
  );
};

export default XBatchTimeline;