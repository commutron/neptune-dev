import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';
import PrioritySquare from '/client/components/tinyUi/PrioritySquare.jsx';
import BinaryStat from '/client/components/uUi/BinaryStat.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const BatchDetails = ({hB, lB, cB, hBs, lBs, cBs, bCache, user, app})=> {
  
  const clientTZ = moment.tz.guess();
  
  return(
    <div className='overGridScroll' tabIndex='1'>
      
      <div className='overGridRowScrollHeader'></div>
      
      {!hB ? null :
        hB.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}hot${index}`}
              sindex={index}
              ck={entry}
              warm={true}
              user={user}
              clientTZ={clientTZ}
              app={app} />
      )})}
      
      <div className='overGridRowScrollHeader'></div>
      
      {!lB ? null :
        lB.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}luke${index}`}
              sindex={index}
              ck={entry}
              warm={true}
              user={user}
              clientTZ={clientTZ}
              app={app} />
      )})}
      
      <div className='overGridRowScrollHeader'></div>
      
      {!cB ? null :
        cB.map( (entry, index)=>{
          return(
            <BatchDetailChunk 
              key={`${entry.batchID}cool${index}`}
              sindex={index}
              ck={entry}
              warm={false}
              user={user}
              clientTZ={clientTZ}
              app={app} />
      )})}
      
    </div>
  
  );
};

export default BatchDetails;


const BatchDetailChunk = ({ sindex, ck, warm, user, clientTZ, app})=> (

  <div className='overGridRowScroll'>
    {Roles.userIsInRole(Meteor.userId(), ['nightly', 'debug']) && 
      <div><b>{ck.batch}</b></div> }
    <div><i>SO: {ck.salesOrder}</i></div>
    <div><i>Due {moment(ck.end).format("MMM Do, YYYY")}</i></div>
    
    <BatchTopStatus
      batchID={ck._id}
      clientTZ={clientTZ}
      app={app} />
    
    <PhaseProgress
      batchID={ck._id}
      warm={warm}
      app={app} />
      
    <NonConCounts
      batchID={ck._id}
      warm={warm}
      app={app} />
      
    <div>
      <WatchButton 
        list={user.watchlist}
        type='batch'
        keyword={ck.batch}
        unique={`watch=${ck.batch}`}
        iconOnly={true} />
    </div>
  </div>
);

const BatchTopStatus = ({ batchID, clientTZ, app })=> {
  
  const [ stData, setStatus ] = useState(false);
  
  useEffect( ()=> {
    const doProto = Roles.userIsInRole(Meteor.userId(), 'nightly');
    Meteor.call('overviewBatchStatus', batchID, clientTZ, doProto, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setStatus( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(stData);
      }
    });
  }, [batchID]);
  
  const dt = stData;
   
   
  if( dt && dt.batchID === batchID ) {
    
    const bffrTime = dt.estEnd2fillBuffer;
    const overQuote = dt.overQuote;
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({batchID, bffrTime, overQuote});
    
    return(
      <Fragment>
        <div><i>Created {dt.timeElapse} ago</i></div>
        <div>
          <NumStat
            num={
              dt.weekDaysRemain < 0 ? 
                dt.weekDaysRemain * -1 :
                dt.weekDaysRemain
            }
            name={
              dt.weekDaysRemain < 0 ? 
                dt.weekDaysRemain === -1 ?
                  'Weekday Overdue' :
                  'Weekdays Overdue' : 
                    dt.weekDaysRemain === 1 ?
                      'Weekday Remaining' :
                      'Weekdays Remaining'}
            title=''
            color={dt.weekDaysRemain < 0 ? 'yellowT' : 'blueT'}
            size='big' />
        </div>
        
      {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
        <PrioritySquare
          bffrTime={bffrTime}
          overQuote={overQuote} />
      }
    
        <div>
          <NumStat
            num={dt.itemQuantity}
            name='Total Boards'
            title=''
            color='blueT'
            size='big' />
        </div>
        <div>
          <BinaryStat
            good={dt.riverChosen}
            name='Flow Assigned'
            title='A Process Flow has been assigned'
            size='big' />
        </div>
      </Fragment>
    );
  }
  
  const placeholderStatus = Roles.userIsInRole(Meteor.userId(), 'nightly') ?
    ['duration', 'remaining', 'proto rank', '# of items', 'flow'] :
    ['duration', 'remaining', '# of items', 'flow'];
    
  return(
    <Fragment>
      {placeholderStatus
        .map( (st, index)=>{
          return(
            <div key={batchID + st + index + 'x'}>
              <i className='fade small'>{st}</i>
            </div>
      )})}
    </Fragment>
  );
};

/////////////////////////////////////////////

const PhaseProgress = ({ batchID, warm, app })=> {
  
  const [ progData, setProg ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('phaseProgress', batchID, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setProg( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(progData);
      }
    });
  }, [batchID]);
  
  const dt = progData;
    
 
  if(warm !== false && dt && dt.batchID === batchID) {
    return(
      <Fragment>
        {dt.phaseSets.map( (phase, index)=>{
          if(phase.steps.length === 0) {
            return(
              <div key={batchID + phase + index + 'x'}>
               <i className='fade small'>{phase.phase}</i>
              </div>
            );
          }else{
            const calNum = ( 
              phase.count / (dt.totalItems * phase.steps.length) 
                * 100 ).toFixed(0);
            Roles.userIsInRole(Meteor.userId(), 'debug') && 
              console.log(`${dt.batch} ${phase.phase} calNum: ${calNum}`);
            let fadeTick = calNum == 0 ? '0' :
                 calNum < 10 ? '5' :
                 calNum < 20 ? '10' :
                 calNum < 30 ? '20' :
                 calNum < 40 ? '30' :
                 calNum < 50 ? '40' :
                 calNum < 60 ? '50' :
                 calNum < 70 ? '60' :
                 calNum < 80 ? '70' :
                 calNum < 90 ? '80' :
                 calNum < 100 ? '90' :
                 '100';
            let niceName = phase.phase === 'finish' ?
                            Pref.isDone : phase.phase;
            return(
              <div 
                key={batchID + phase + index + 'g'} 
                className={'fillRight' + fadeTick}>
                <NumStat
                  num={ calNum + '%' }
                  name={niceName}
                  title=''
                  color='whiteT'
                  size='big' />
            </div>
        )}})}
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {app.phases.map( (phase, index)=>{
        return(
          <div key={batchID + phase + index + 'z'}>
            <i className='fade small'>{phase}</i>
          </div>
      )})}
    </Fragment>
  );    
};


////////////////////////////////////

const NonConCounts = ({ batchID, warm, app })=> {
  
  const [ ncData, setNC ] = useState(false);
  
  useEffect( ()=> {
    const temp = !warm ? 'cool' : 'warm';
    Meteor.call('nonconQuickStats', batchID, temp, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setNC( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(ncData);
      }
    });
  }, [batchID]);
  
  const dt = ncData;
    
  if(warm !== false && dt && dt.batchID === batchID) {
    return(
      <Fragment>
        <div>
          <NumStat
            num={dt.nonConTotal}
            name='Total Noncons'
            title=''
            color='redT'
            size='big' />
          </div>
          <div>
            <NumStat
              num={dt.nonConLeft}
              name='Unresolved Noncons'
              title=''
              color='orangeT'
              size='big' />
          </div>
          <div>
            <NumStat
              num={dt.percentOfNCitems}
              name='of Items have noncons'
              title=''
              color='redT'
              size='big' />
          </div>
          <div>
            <NumStat
              num={dt.itemIsScrap}
              name='Scrap Boards'
              title=''
              color='redT'
              size='big' />
          </div>
          <div>
            <NumStat
              num={dt.itemHasRMA}
              name='RMA Boards'
              title=''
              color='redT'
              size='big' />
          </div>
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {['total nc', 'unresolved nc', '% of items', 'scrap', 'rma']
        .map( (nc, index)=>{
          return(
            <div key={batchID + nc + index + 'x'}>
              <i className='fade small'>{nc}</i>
            </div>
      )})}
    </Fragment>
  );
};