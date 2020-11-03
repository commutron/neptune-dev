import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import BatchTopStatus from '../../overview/columns/BatchTopStatus.jsx';
import KittingChecks from './KittingChecks';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import PrintLink from '/client/components/smallUi/PrintLink.jsx';
import ProJump from '/client/components/smallUi/ProJump';

const UpstreamDetails = ({
  oB,
  bCache, pCache, acCache,
  user, app, brancheS,
  isDebug, isNightly,
  dense, focusBy
})=> {
  
  const branchClear = brancheS.filter( b => b.reqClearance === true );
  
  const statusCols = ['due','remaining workdays','items quantity','serial flow'];
  
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
          return(
            <UpstreamDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              user={user}
              bCache={bCache}
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
              focusBy={focusBy} />
      )})}
      
    </div>
  );
};

export default UpstreamDetails;


const UpstreamDetailChunk = ({ 
  rowIndex, oB, user,
  bCache, pCache, acCache, app, 
  brancheS, branchClear,
  isDebug, isNightly,
  statusCols, kitCols, 
  dense, focusBy
})=> {
  
  const isX = oB.completed === undefined ? false : true;
  const isDone = isX ? oB.completed : oB.finishedAt !== false;
  
  const bInfo = focusBy && bCache ? bCache.dataSet.find( x => x.batch === oB.batch) : false;
  const highG = bInfo ? bInfo.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  const releasedToFloor = oB.releases.findIndex( 
                            x => x.type === 'floorRelease') >= 0;
  
  const ac = acCache.dataSet.find( x => x.batchID === oB._id );
    
  return(
    <div className={`overGridRowScroll ${highG}`}>
      <div>
        <i><i className='label' title={Pref.salesOrder}
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      
      <div>
        <TideActivitySquare 
          batchID={oB._id} 
          acData={ac}
          app={app} />
      </div>
      
      <BatchTopStatus
        rowIndex={rowIndex}
        batchID={oB._id}
        dueDate={oB.salesEnd || oB.end}
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
        pCache={pCache}
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