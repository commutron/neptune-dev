import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';
import PrioritySquareData from '/client/components/bigUi/PrioritySquare.jsx';
import { PrioritySquare } from '/client/components/bigUi/PrioritySquare.jsx';
import BinaryStat from '/client/components/uUi/BinaryStat.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const BatchDetails = ({
  oB,
  bCache, pCache, 
  user, clientTZ, app, dense
})=> {
  
  const statusCols = ['remaining', 'priority', 'items quantity', 'flow', 'released', 'active'];
  const ncCols = ['NC total', 'NC unresolved', 'NC per item', 'NC items', 'scrap', 'RMA'];
  
  return(
    <div className={`overGridScroll ${dense ? 'dense' : ''}`} tabIndex='1'>
      
      
      
      {!dense ? 
        <div className='overGridRowScrollHeader'></div>
      :
        <div className='overGridRowScroll'>
          {['SO', 'due',...statusCols,...app.phases,...ncCols, 'watch']
            .map( (entry, index)=>{
              return(
                <div key={entry+index}>
                  <i className='cap ovColhead'>{entry}</i>
                </div>
        )})}
        </div>
      }
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}live${index}`}
              sindex={index}
              ck={entry}
              user={user}
              clientTZ={clientTZ}
              pCache={pCache}
              app={app}
              statusCols={statusCols}
              ncCols={ncCols}
              dense={dense} />
      )})}
      
    </div>
  );
};

export default BatchDetails;


const BatchDetailChunk = ({ 
  sindex, ck, user, clientTZ, pCache, app, 
  statusCols, ncCols, dense
})=> {
  
  const releasedToFloor = Array.isArray(ck.releases) ?
    ck.releases.findIndex( x => x.type === 'floorRelease') >= 0 :
    typeof ck.floorRelease === 'object';
  
  const dueDate = moment(ck.salesEnd || ck.end);
  const adaptDate = dueDate.isAfter(moment(), 'year') ?
                    "MMM Do, YYYY" : "MMM Do";
  
  return(
    <div className='overGridRowScroll' title={ck.batch}>
      {Roles.userIsInRole(Meteor.userId(), 'debug') && 
        <div><b>{ck.batch}</b></div> }
      <div>
        <i><i className='label'>SO:<br /></i>{ck.salesOrder}</i>
      </div>
      <div>
        <i><i className='label'>Due:<br /></i>{dueDate.format(adaptDate)}</i>
      </div>
      
      <BatchTopStatus
        batchID={ck._id}
        releasedToFloor={releasedToFloor}
        clientTZ={clientTZ}
        pCache={pCache}
        app={app}
        statusCols={statusCols}
        dense={dense} />
    
      <PhaseProgress
        batchID={ck._id}
        releasedToFloor={releasedToFloor}
        app={app} />
        
      <NonConCounts
        batchID={ck._id}
        releasedToFloor={releasedToFloor}
        app={app}
        ncCols={ncCols} />
        
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
};

const BatchTopStatus = ({ 
  batchID, releasedToFloor, clientTZ, pCache, app, 
  statusCols, dense
})=> {
  
  const [ stData, setStatus ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('overviewBatchStatus', batchID, clientTZ, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setStatus( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(stData);
      }
    });
  }, [batchID]);
  
  const dt = stData;
  const pt = pCache.dataSet.find( x => x.batchID === batchID );
   
  if( dt && dt.batchID === batchID ) {
    
    return(
      <Fragment>
        {/*<div><i>Created {dt.timeElapse} ago</i></div>*/}
        <div>
          <NumStat
            num={ dense ? dt.weekDaysRemain : Math.abs(dt.weekDaysRemain) }
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
        
        {!pt ?
          <PrioritySquareData
            batchID={batchID}
            app={app} />
        :
          <PrioritySquare
            batchID={batchID}
            ptData={pt}
            app={app} />
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
            name='Flow'
            title='Has had a Process Flow assigned'
            size=''
            onIcon='far fa-check-circle fa-2x' 
            offIcon='far fa-times-circle fa-2x' />
        </div>
        <div>
          <BinaryStat
            good={releasedToFloor}
            name='Released'
            title={`Has been released from ${Pref.kitting}`}
            size=''
            onIcon='fas fa-flag fa-2x'
            offIcon='far fa-flag fa-2x' />
        </div>
        <div>
          <BinaryStat
            good={dt.isActive}
            name='Active'
            title={`Has had ${Pref.tide} activity today`}
            size=''
            onIcon='fas fa-shoe-prints fa-2x' 
            offIcon='far fa-pause-circle fa-2x' />
        </div>
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {statusCols.map( (st, index)=>{
        return(
          <div key={batchID + st + index + 'x'}>
            <i className='fade small label'>{st}</i>
          </div>
      )})}
    </Fragment>
  );
};

/////////////////////////////////////////////

const PhaseProgress = ({ batchID, releasedToFloor, app })=> {
  
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
 
  if(releasedToFloor !== false && dt && dt.batchID === batchID) {
    return(
      <Fragment>
        {dt.phaseSets.map( (phase, index)=>{
          if(phase.steps.length === 0) {
            return(
              <div key={batchID + phase + index + 'x'}>
               <i className='fade small label'>{phase.phase}</i>
              </div>
            );
          }else{
            const calNum = Math.floor( ( 
              phase.count / (dt.totalItems * phase.steps.length) 
                * 100 ) );
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
                  title={`all clear: ${phase.allClear}`}
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
            <i className='fade small label'>{phase}</i>
          </div>
      )})}
    </Fragment>
  );    
};


////////////////////////////////////

const NonConCounts = ({ batchID, releasedToFloor, app, ncCols })=> {
  
  const [ ncData, setNC ] = useState(false);
  
  useEffect( ()=> {
    if(!releasedToFloor) { null }else{
      Meteor.call('nonconQuickStats', batchID, 'warm', (error, reply)=>{
        error && console.log(error);
        if( reply ) { 
          setNC( reply );
          Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(ncData);
        }
      });
    }
  }, [batchID]);
  
  const dt = ncData;
    
  if(releasedToFloor && dt && dt.batchID === batchID) {
    return(
      <Fragment>
        <div>
          <NumStat
            num={dt.nonConTotal}
            name='NC Total'
            title='Total Noncons'
            color='redT'
            size='big' />
          </div>
          <div>
            <NumStat
              num={dt.nonConLeft}
              name='NC Unresolved'
              title='Unresolved Noncons'
              color='orangeT'
              size='big' />
          </div>
          <div>
            <NumStat
              num={dt.nonConRate}
              name='NC per Item'
              title='Rate of Noncons per Item'
              color='redT'
              size='big' />
          </div>
          <div>
            <NumStat
              num={dt.percentOfNCitems}
              name='NC Items'
              title='Percent of Items with Noncons'
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
      {ncCols.map( (nc, index)=>{
        return(
          <div key={batchID + nc + index + 'x'}>
            <i className='fade small label'>{nc}</i>
          </div>
      )})}
    </Fragment>
  );
};