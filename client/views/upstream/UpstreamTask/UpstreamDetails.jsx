import React, { useEffect } from 'react';
import Pref from '/client/global/pref.js';

import BatchTopStatus from '/client/views/overview/columns/BatchTopStatus';
import KittingChecks from './KittingChecks';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import PrintJump from '/client/components/smallUi/PrintJump';
import ProJump from '/client/components/smallUi/ProJump';

import Grabber from '/client/utility/Grabber.js';

const UpstreamDetails = ({
  oB, hB, traceDT,
  app, brancheS,
  isAuth,
  holdShow, holdshowSet,
  focusBy, tagBy
})=> {
  
  useEffect(() => {
    Grabber('.overGridScroll');
  }, []);
  
  const branchClear = brancheS.filter( b => b.reqClearance === true );
  
  const statusCols = ['due','remaining workdays','items quantity','flow set','docs'];
  
  const branchClearCols = Array.from(branchClear, x => x.common );
  const kitCols = ['Series','Quote Set', ...branchClearCols, Pref.baseSerialPart+'s', 'released'];
  
  // due == 'fulfill', 'ship'
  const kitHead = ['sales order','active',...statusCols,...kitCols,'print','production'];
  
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <div 
      className='overGridScroll forceScrollStyle'
      tabIndex='1'
    >

      <div className='overGridRowScroll'>
        {kitHead.map( (entry, index)=>{
          return(
            <div key={entry+index}>
              <i className='cap ovColhead'>{entry}</i>
            </div>
      )})}
      </div>
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <UpstreamDetailChunk
              key={`${entry.batchID}live${index}`}
              oB={entry}
              tBatch={tBatch}
              app={app}
              branchClear={branchClear}
              isAuth={isAuth}
              isRO={isRO}
              kitCols={kitCols}
              focusBy={focusBy}
              tagBy={tagBy}
            />
      )})}
      
      {hB.length === 0 ? null : !holdShow || oB.length === 0 ?
        <button className='overGridRowScrollHeader labels grayFade'
          onClick={()=>holdshowSet(!holdShow)}
        ></button>
        :
        <button className='overGridRowScroll labels grayFade'
          onClick={()=>holdshowSet(!holdShow)}
        >
          {kitHead.map( (entry, index)=>{
            return(
              <div key={entry+index} className='cap ovColhead'>{entry}</div>
        )})}
        </button> 
      }
      
      {holdShow &&
        hB.map( (entry, index)=>{
          const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <UpstreamDetailChunk
              key={`${entry.batchID}hold${index}`}
              oB={entry}
              tBatch={tBatch}
              app={app}
              branchClear={branchClear}
              isAuth={isAuth}
              isRO={isRO}
              kitCols={kitCols}
              focusBy={focusBy}
              tagBy={tagBy}
            />
      )})}
      
    </div>
  );
};

export default UpstreamDetails;


const UpstreamDetailChunk = ({ 
  oB, tBatch,
  branchClear,
  isAuth, isRO,
  kitCols, 
  focusBy, tagBy
})=> {
  
  const isDone = oB.completed;
  
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags && tBatch.tags.includes(tagBy) ? '' : 'hide' : '';
  
  const releasedToFloor = oB.releases.findIndex( x => x.type === 'floorRelease') >= 0;
  
  return(
    <div className={`overGridRowScroll ${highG} ${highT}`}>
      <div title={Pref.salesOrder}>
        <i><i className='label' 
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      
      <TideActivitySquare 
        batchID={oB._id} 
        acData={tBatch}
      />
      
      <BatchTopStatus
        batchID={oB._id}
        tBatch={tBatch}
      />
      
      <KittingChecks
        batchID={oB._id}
        batchNum={oB.batch}
        tBatch={tBatch}
        isDone={isDone}
        releasedToFloor={releasedToFloor}
        releases={oB.releases}
        branchClear={branchClear}
        kitCols={kitCols}
        isAuth={isAuth}
        isRO={isRO} 
      />
    
      <PrintJump
        batchNum={oB.batch}
        tBatch={tBatch}
        title='Print Label'
      />
      
      <ProJump batchNum={oB.batch} allRO={isRO} />
        
    </div>
  );
};