import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import BatchTopStatus from '../../overview/columns/BatchTopStatus.jsx';
import KittingChecks from '../../overview/columns/KittingChecks.jsx';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import PrintLink from '/client/components/smallUi/PrintLink.jsx';

const UpstreamDetails = ({
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
  
  // due == 'fulfill', 'ship'
  const kitHead = ['SO',...statusCols, ...kitCols,'active','print','production','watch'];
  
  return(
    <div className={`overGridScroll forceScrollStyle ${dense ? 'dense' : ''}`} tabIndex='1'>
      
      {!dense ? 
        <div className='overGridRowScrollHeader'></div>
      :
        <div className='overGridRowScroll'>
          {kitHead.map( (entry, index)=>{
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
            <UpstreamDetailChunk
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
              dense={dense}
              filterBy={filterBy}
              kittingArea={kittingArea}
              releasedArea={releasedArea}
              branchArea={branchArea} />
      )})}
      
    </div>
  );
};

export default UpstreamDetails;


const UpstreamDetailChunk = ({ 
  rowIndex, oB, user, clientTZ, 
  pCache, acCache, app, 
  brancheS, branchClear,
  isDebug, isNightly,
  statusCols, kitCols, 
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
  
  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('production');
  }
    
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
    
      <div>
        <TideActivitySquare 
          batchID={oB._id} 
          acData={ac}
          app={app} />
      </div>
      
      <div>
        <PrintLink
          batchNum={oB.batch}
          title='Print Label'
          iText={!dense}
        />
      </div>
      
    
      <div>
  			<button
          title={`View ${oB.batch} in production`}
          className='transparent'
          onClick={()=>goPro(oB.batch)}
          disabled={isRO}>
          <label className='navIcon actionIconWrap taskLink'>
            <i className='fas fa-paper-plane' data-fa-transform='left-1 down-2 shrink-1'></i>
          </label>
          {!dense && <i className='label infoSquareLabel whiteT'>Production</i>}
        </button>
      </div>
      
      <div>
        <WatchButton 
          list={user.watchlist}
          type='batch'
          keyword={oB.batch}
          unique={`watch=${oB.batch}`}
          iconOnly={true} />
      </div>
        
    </div>
  );
};