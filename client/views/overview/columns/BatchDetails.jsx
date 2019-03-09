import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const BatchDetails = ({hBs, lBs, cBs, bCache, user})=> {
  
  /*
  let headers = wBs && wBs.length > 0 ? Object.keys(wBs[0]) :
                cBs && cBs.length > 0 ? Object.keys(cBs[0]) :
                [];
  headers.length > 0 && headers.shift();
  console.log(headers);
  */
  
  return(
    <div className='overGridScroll' tabIndex='1'>
      
      <div className='overGridRowScrollHeader'></div>
      
      {!hBs ? null :
        hBs.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}hot${index}`}
              source='hot'
              ck={entry}
              user={user} />
      )})}
      
      <div className='overGridRowScrollHeader'></div>
      
      {!lBs ? null :
        lBs.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}luke${index}`}
              source='luke'
              ck={entry}
              user={user} />
      )})}
      
      <div className='overGridRowScrollHeader'></div>
      
      {!cBs ? null :
        cBs.map( (entry, index)=>{
          return(
            <BatchDetailChunk 
              key={`${entry.batchID}cool${index}`}
              source='cool'
              ck={entry}
              user={user} />
      )})}
      
    </div>
  
  );
};

export default BatchDetails;


const BatchDetailChunk = ({ck, source, user})=> (

  <div className='overGridRowScroll' title={`${ck.batch} = ${source}`}>
    <div><i>SO: {ck.salesOrder}</i></div>
    <div><i>Created {ck.timeElapse} ago</i></div>
    <div><i>Due {ck.salesEnd}</i></div>
    <div>
      <NumStat
        num={
          ck.weekDaysRemain < 0 ? 
            ck.weekDaysRemain * -1 :
            ck.weekDaysRemain
        }
        name={
          ck.weekDaysRemain < 0 ? 
            ck.weekDaysRemain === -1 ?
              'Weekday Overdue' :
              'Weekdays Overdue' : 
                ck.weekDaysRemain === 1 ?
                  'Weekday Remaining' :
                  'Weekdays Remaining'}
        title=''
        color={ck.weekDaysRemain < 0 ? 'yellowT' : 'blueT'}
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.itemQuantity}
        name='Total Boards'
        title=''
        color='blueT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.percentOfDoneItems}
        name='Boards Complete'
        title=''
        color='greenT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.nonConTotal}
        name='Total Noncons'
        title=''
        color='redT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.percentOfNCitems}
        name='of boards have noncons'
        title=''
        color='redT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.nonConsPerNCitem}
        name='Average Noncons Per Board'
        title='mean average'
        color='redT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.itemHasRMA}
        name='RMA Boards'
        title=''
        color='redT'
        size='big' />
      </div>
    <div>
      <NumStat
        num={ck.itemIsScrap}
        name='Scrap Boards'
        title=''
        color='redT'
        size='big' />
    </div>
    <div>
      <WatchButton 
        list={user.watchlist}
        type='batch'
        keyword={ck.batch}
        unique={`watch=${ck.batch}`}/>
    </div>
  </div>
);