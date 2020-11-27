import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import BatchTopStatus from '../../overview/columns/BatchTopStatus.jsx';
import KittingChecks from './KittingChecks';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import PrintLink from '/client/components/smallUi/PrintLink.jsx';
import ProJump from '/client/components/smallUi/ProJump';

const UpstreamDetails = ({
  oB, traceDT,
  user, app, brancheS,
  isDebug, isNightly,
  dense, focusBy
})=> {
  
  const branchClear = brancheS.filter( b => b.reqClearance === true );
  
  const statusCols = ['due','remaining workdays','items quantity','flow set'];
  
  const branchClearCols = Array.from(branchClear, x => x.common );
  const kitCols = [...branchClearCols, Pref.baseSerialPart+'s', 'released'];
  
  // due == 'fulfill', 'ship'
  const kitHead = ['sales order','active',...statusCols,...kitCols,'print','production'];
  
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
          const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <UpstreamDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={tBatch}
              user={user}
              app={app}
              brancheS={brancheS}
              branchClear={branchClear}
              isDebug={isDebug}
              isNightly={isNightly}
              statusCols={statusCols}
              kitCols={kitCols}
              dense={dense}
              focusBy={focusBy} />
      )})}
      
    </div>
  );
};

export default UpstreamDetails;


const UpstreamDetailChunk = ({ 
  rowIndex, oB, tBatch, user,
  app, 
  brancheS, branchClear,
  isDebug, isNightly,
  statusCols, kitCols, 
  dense, focusBy
})=> {
  
  const isX = oB.completed === undefined ? false : true;
  const isDone = isX ? oB.completed : oB.finishedAt !== false;
  
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  const releasedToFloor = oB.releases.findIndex( 
                            x => x.type === 'floorRelease') >= 0;
  
  return(
    <div className={`overGridRowScroll ${highG}`}>
      <div>
        <i><i className='label' title={Pref.salesOrder}
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      
      <div>
        <TideActivitySquare 
          batchID={oB._id} 
          acData={tBatch}
          app={app} />
      </div>
      
      <BatchTopStatus
        rowIndex={rowIndex}
        batchID={oB._id}
        tBatch={tBatch}
        app={app}
        isDebug={isDebug}
        isNightly={isNightly}
        statusCols={statusCols}
        dense={dense} />
      
      <KittingChecks
        batchID={oB._id}
        batchNum={oB.batch}
        tBatch={tBatch}
        isX={isX}
        isDone={isDone}
        releasedToFloor={releasedToFloor}
        releases={oB.releases}
        app={app}
        branchClear={branchClear}
        kitCols={kitCols}
        dense={dense}
        isDebug={isDebug} />
    
      <div>
        <PrintLink
          batchNum={oB.batch}
          title='Print Label'
          iText={!dense}
        />
      </div>
      
      <ProJump batchNum={oB.batch} dense={dense} />
        
    </div>
  );
};