import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import { min2hr } from '/client/utility/Convert';

import BatchTopStatus from '../../overview/columns/BatchTopStatus.jsx';
import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import ReleasedCheck from '../../overview/columns/ReleasedCheck.jsx';
import BranchProgress from '../../overview/columns/BranchProgress.jsx';
import NonConCounts from '../../overview/columns/NonConCounts.jsx';


const DownstreamDetails = ({
  oB, indexKey,
  bCache, pCache, acCache,
  user, app, brancheS,
  isDebug, isNightly,
  dense
})=> {
          
          
  return(
    <Fragment>
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          return(
            <DownstreamScrollChunk
              ck={entry}
              key={indexKey+'c'+index}
              bCache={bCache}
              pCache={pCache}
              acCache={acCache}
              app={app}
              user={user}
              isDebug={isDebug}
              brancheS={brancheS}
            />
              // branchClear={branchClear}
              // isDebug={isDebug}
              // isNightly={isNightly}
              // statusCols={statusCols}
              // dense={dense} />
      )})}
      
    </Fragment>
  );
};

export default DownstreamDetails;


const DownstreamScrollChunk = ({
  ck,
  bCache, pCache, acCache, 
  app, user, brancheS, isDebug, dense 
})=> {

  const isDone = ck.completedAt ? true : false;
  
  const q2t = ck.quote2tide;
  const q2tStatus = !q2t ? 'Time Not Tracked' :
          q2t > 0 ? 
            `${min2hr(q2t)} hours remain` :
            'remaining time unknown';
  
  const ac = acCache.find( x => x.batchID === ck.batchID );
  
  //const releasedToFloor = oB.releases.findIndex( 
    //                      x => x.type === 'floorRelease') >= 0;
  const releasedToFloor = false;
  
  const progCols = Array.from(brancheS, x => x.common);
  const ncCols = ['NC total', 'NC remain', 'NC per item', 'NC items', 'scrap', 'RMA'];
  
  
  
  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('production');
  }
    
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  
  return(
    <div className='downRowScroll'>
      
      <div>
        <i><i className='label' title={Pref.salesOrder}
          >{Pref.SO}:<br /></i>{ck.salesOrder}</i>
      </div>
      
      {!isDone ?
        <div title={`${q2t} minutes`}>{q2tStatus}</div>
      : <div>{Pref.batch} is {Pref.isDone}</div> }
      
      <ReleasedCheck
        batchID={ck.batchID}
        batchNum={ck.batch}
        isX={false}
        isDone={isDone}
        releasedToFloor={releasedToFloor}
        releases={ck.releases || []}
        app={app}
        dense={dense}
        isRO={isRO}
        isDebug={isDebug} />
          
      <div>
        <TideActivitySquare 
          batchID={ck.batchID} 
          acData={ac}
          app={app} />
      </div>
      
      
      <BranchProgress
        batchID={ck.batchID}
        progCols={progCols}
        app={app}
        filterBy={false}
        branchArea={false}
        isDebug={isDebug} />
        
      <NonConCounts
        batchID={ck.batchID}
        releasedToFloor={releasedToFloor}
        force={true}
        app={app}
        ncCols={ncCols}
        isDebug={isDebug} />
        
        
        
      <div>
  			<a
          title={`View ${ck.batch} in production`}
          className='transparent'
          onClick={()=>goPro(ck.batch)}
          disabled={isRO}>
          <label className='navIcon actionIconWrap taskLink'>
            <i className='fas fa-paper-plane' data-fa-transform='left-1 down-2 shrink-3'></i>
          </label><br />
          {!dense && <i className='label infoSquareLabel whiteT'>Production</i>}
        </a>
      </div>
      
      
    </div>
  );
};

 {/*
      
      
      
      <BatchTopStatus
        rowIndex={rowIndex}
        batchID={oB._id}
        dueDate={oB.salesEnd || oB.end}
        pCache={pCache}
        app={app}
        isDebug={isDebug}
        isNightly={isNightly}
        statusCols={statusCols}
        dense={dense} />
    */}
      
      
  