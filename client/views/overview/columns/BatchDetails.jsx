import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import BatchTopStatus from './BatchTopStatus.jsx';
import KittingChecks from './KittingChecks.jsx';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import BranchProgress from './BranchProgress.jsx';
import NonConCounts from './NonConCounts.jsx';

const BatchDetails = ({
  oB,
  bCache, pCache, acCache,
  user, clientTZ, app, brancheS,
  isDebug, isNightly,
  dense, filterBy, 
  kittingArea, releasedArea, branchArea
})=> {
  
  const branchClear = brancheS.filter( b => b.reqClearance === true );
  
  const statusCols = ['due', 'remaining workdays', 'priority rank', 'items quantity'];
  
  const configClearCols = Array.from(Pref.clearencesArray, x => x.context );
  const branchClearCols = Array.from(branchClear, x => x.common );
  const kitCols = [...branchClearCols,...configClearCols, 'flow', 'released'];
  
  const progCols = branchArea ?
                    [ brancheS.find( x => x.branch === filterBy).common ] :
                    Array.from(brancheS, x => x.common);
  const ncCols = ['NC total', 'NC remain', 'NC per item', 'NC items', 'scrap', 'RMA'];
  // due == 'fulfill', 'ship'
  const fullHead = ['SO',...statusCols,...kitCols,'active',...progCols,...ncCols,'watch'];
  const kitHead = ['SO',...statusCols, ...kitCols,'active','watch'];
  const relHead = ['SO',...statusCols,'active',...progCols,...ncCols,'watch'];
  
  const headersArr = kittingArea ? kitHead : 
                     releasedArea || branchArea ? relHead :
                     fullHead;
  
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
              kitCols={kitCols}
              progCols={progCols}
              ncCols={ncCols}
              dense={dense}
              filterBy={filterBy}
              kittingArea={kittingArea}
              releasedArea={releasedArea}
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
  statusCols, kitCols, progCols, ncCols, 
  dense, filterBy,
  kittingArea, releasedArea, branchArea
})=> {
  
  const isX = oB.completed === undefined ? false : true;
  const isDone = isX ? oB.completed : oB.finishedAt !== false;
  
  const releasedToFloor = oB.releases.findIndex( 
                            x => x.type === 'floorRelease') >= 0;
  
  const ac = acCache.dataSet.find( x => x.batchID === oB._id );
  /*
  const dueDate = moment(oB.salesEnd || oB.end);
  const adaptDate = dueDate.isAfter(moment(), 'year') ?
                    "MMM Do, YYYY" : "MMM Do";
  */
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <div className='overGridRowScroll'>
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
        pCache={pCache}
        app={app}
        isDebug={isDebug}
        isNightly={isNightly}
        statusCols={statusCols}
        dense={dense} />
    
    {!releasedArea && !branchArea ?
      <KittingChecks
        batchID={oB._id}
        batchNum={oB.batch}
        isX={isX}
        isDone={isDone}
        releasedToFloor={releasedToFloor}
        releases={oB.releases}
        clientTZ={clientTZ}
        pCache={pCache}
        app={app}
        branchClear={branchClear}
        kitCols={kitCols}
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
      
    {!kittingArea &&
      <Fragment>
        <BranchProgress
          batchID={oB._id}
          releasedToFloor={releasedToFloor}
          progCols={progCols}
          clientTZ={clientTZ}
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
      </Fragment>
    }
    
      <div>
        <WatchButton 
          list={user.watchlist}
          type='batch'
          keyword={oB.batch}
          unique={`watch=${oB.batch}`}
          iconOnly={true} />
      </div>
      
      {isDebug && <div><b>{oB.batch}</b></div> }
        
    </div>
  );
};