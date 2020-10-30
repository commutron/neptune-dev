import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import BatchTopStatus from './BatchTopStatus.jsx';
import ReleasedCheck from './ReleasedCheck.jsx';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import BranchProgress from './BranchProgress.jsx';
import NonConCounts from './NonConCounts.jsx';

const BatchDetails = ({
  oB,
  bCache, pCache, acCache,
  user, clientTZ, app, brancheS,
  isDebug, isNightly,
  dense, filterBy, branchArea
})=> {
  
  const branchClear = brancheS.filter( b => b.reqClearance === true );
  
  const statusCols = ['due', 'remaining workdays', 'items quantity','serial flow'];
  
  const progCols = branchArea ?
                    [ brancheS.find( x => x.branch === filterBy).common ] :
                    Array.from(brancheS, x => x.common);
  const ncCols = ['NC total', 'NC remain', 'NC per item', 'NC items', 'scrap', 'RMA'];
  // due == 'fulfill', 'ship'
  const fullHead = ['SO',...statusCols,'released','active',...progCols,...ncCols];
  const brchHead = ['SO',...statusCols,'active',...progCols,...ncCols];
  
  const headersArr = branchArea ? brchHead : fullHead;
  
  return(
    <div className={`overGridScroll forceScrollStyle ${dense ? 'dense' : ''}`} tabIndex='1'>
      
      {!dense ? 
        <div className='overGridRowScrollHeader'></div>
      :
        <div className='overGridRowScroll'>
          {headersArr.map( (entry, index)=>{
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
              rowIndex={index}
              oB={entry}
              user={user}
              clientTZ={clientTZ}
              pCache={pCache}
              acCache={acCache}
              app={app}
              brancheS={brancheS}
              branchClear={branchClear}
              isDebug={isDebug}
              isNightly={isNightly}
              statusCols={statusCols}
              progCols={progCols}
              ncCols={ncCols}
              dense={dense}
              filterBy={filterBy}
              branchArea={branchArea} />
      )})}
      
    </div>
  );
};

export default BatchDetails;


const BatchDetailChunk = ({ 
  rowIndex, oB, user, clientTZ, 
  pCache, acCache, app, 
  brancheS, branchClear,
  isDebug, isNightly,
  statusCols, progCols, ncCols, 
  dense, filterBy, branchArea
})=> {
  
  const isX = oB.completed === undefined ? false : true;
  const isDone = isX ? oB.completed : oB.finishedAt !== false;
  
  const releasedToFloor = oB.releases.findIndex( 
                            x => x.type === 'floorRelease') >= 0;
  const rTFghostC = releasedToFloor ? '' : 'ghostState';
  const rTFghostT = releasedToFloor ? '' : `Not released from ${Pref.kitting}`;
  
  const ac = acCache.dataSet.find( x => x.batchID === oB._id );
  /*
  const dueDate = moment(oB.salesEnd || oB.end);
  const adaptDate = dueDate.isAfter(moment(), 'year') ?
                    "MMM Do, YYYY" : "MMM Do";
  */
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <div className={`overGridRowScroll ${rTFghostC}`} title={rTFghostT}>
      <div>
        <i><i className='label' title={Pref.salesOrder}
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      {/*<div>
        <i><i className='label'>Fulfill:<br /></i>{dueDate.format(adaptDate)}</i>
      </div>*/}
      
      <BatchTopStatus
        rowIndex={rowIndex}
        batchID={oB._id}
        dueDate={oB.salesEnd || oB.end}
        clientTZ={clientTZ}
        app={app}
        isDebug={isDebug}
        isNightly={isNightly}
        statusCols={statusCols}
        dense={dense} />
    
      {!branchArea ?
        <ReleasedCheck
          batchID={oB._id}
          batchNum={oB.batch}
          isX={isX}
          isDone={isDone}
          releasedToFloor={releasedToFloor}
          releases={oB.releases}
          app={app}
          dense={dense}
          isRO={isRO}
          isDebug={isDebug} />
      : null}
    
      <div>
        <TideActivitySquare 
          batchID={oB._id} 
          acData={ac}
          app={app} />
      </div>
      
      <BranchProgress
        batchID={oB._id}
        progCols={progCols}
        app={app}
        filterBy={filterBy}
        branchArea={branchArea}
        isDebug={isDebug} />
        
      <NonConCounts
        batchID={oB._id}
        releasedToFloor={releasedToFloor}
        app={app}
        ncCols={ncCols}
        isDebug={isDebug} />
      
      {isDebug && <div><b>{oB.batch}</b></div> }
        
    </div>
  );
};