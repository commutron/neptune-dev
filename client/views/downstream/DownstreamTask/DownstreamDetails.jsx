import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import { min2hr } from '/client/utility/Convert';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

import BatchTopStatus from '../../overview/columns/BatchTopStatus.jsx';
import { TideActivitySquare } from '/client/components/tide/TideActivity';

const DownstreamDetails = ({
  oB,
  bCache, pCache, acCache,
  user, app, brancheS,
  isDebug, isNightly,
  dense
})=> {
  
  console.log(oB);
  
          
          
  return(
    <Fragment>
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          return(
            <DownstreamChunk
              ck={entry}
              bCache={bCache}
              acCache={acCache}
              app={app}
              user={user}
            />
              // brancheS={brancheS}
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


const DownstreamChunk = ({ck, bCache, acCache, app, user, dense })=> {

  const moreInfo = bCache ? bCache.find( x => x.batch === ck.batch) : false;
  const what = !moreInfo ? 'unavailable' : `${moreInfo.isWhat}`;// ${moreInfo.more}`;
  
  const isDone = ck.completedAt ? true : false;
  
  const q2t = ck.quote2tide;
  const q2tStatus = !q2t ? 'Time Not Tracked' :
          q2t > 0 ? 
            `${min2hr(q2t)} hours remain` :
            'Over-Quote, remaining time unknown';
  
  const ac = acCache.find( x => x.batchID === ck.batchID );
  
  //const releasedToFloor = oB.releases.findIndex( 
    //                      x => x.type === 'floorRelease') >= 0;
  
  
  function goPro(location) {
    Session.set('now', location);
    FlowRouter.go('production');
  }
    
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  
  return(
    <div>
      <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      <div>{what.length <= 75 ? what : what.substring(0, 75) + '...'}</div>
      
      {!isDone ?
        <div title={`${q2t} minutes`} className='fade'> -> {q2tStatus}</div>
      : <div className='fade'> -> {Pref.batch} is {Pref.isDone}</div> }
      
      <div>
        <TideActivitySquare 
          batchID={ck.batchID} 
          acData={ac}
          app={app} />
      </div>
      
      <div>
  			<a
          title={`View ${ck.batch} in production`}
          className='transparent'
          onClick={()=>goPro(ck.batch)}
          disabled={isRO}>
          <label className='navIcon actionIconWrap taskLink'>
            <i className='fas fa-paper-plane' data-fa-transform='left-1 down-2 shrink-3'></i>
          </label>
          {!dense && <i className='label infoSquareLabel whiteT'>Production</i>}
        </a>
      </div>
      
      
    </div>
  );
};

 {/*
      <div>
        <i><i className='label' title={Pref.salesOrder}
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      
      
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
      
      
  