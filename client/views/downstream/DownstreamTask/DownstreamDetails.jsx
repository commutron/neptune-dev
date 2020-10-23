import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import { min2hr } from '/client/utility/Convert';

import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

import BatchTopStatus from '../../overview/columns/BatchTopStatus.jsx';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import PrintLink from '/client/components/smallUi/PrintLink.jsx';

const DownstreamDetails = ({
  oB,
  bCache, pCache, acCache,
  user, app, brancheS,
  isDebug, isNightly,
  dense
})=> {
  
  const statusCols = ['due','remaining workdays','priority rank','items quantity','serial flow','active'];
  
  console.log(oB);
  
  // due == 'fulfill', 'ship'
  const kitHead = ['SO',...statusCols,'print','production','watch'];
  
          
          
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
            <DownstreamChunk
              ck={entry}
              bCache={bCache}
              app={app}
            />
              // brancheS={brancheS}
              // branchClear={branchClear}
              // isDebug={isDebug}
              // isNightly={isNightly}
              // statusCols={statusCols}
              // dense={dense} />
      )})}
      
    </div>
  );
};

export default DownstreamDetails;

const DownstreamChunk = ({ck, bCache })=> {

  const moreInfo = bCache ? bCache.find( x => x.batch === ck.batch) : false;
  const what = !moreInfo ? 'unavailable' : `${moreInfo.isWhat}`;// ${moreInfo.more}`;
  
  const isDone = ck.completedAt ? true : false;
  
  const q2t = ck.quote2tide;
  const q2tStatus = !q2t ? 'Time Not Tracked' :
          q2t > 0 ? 
            `${min2hr(q2t)} hours remain` :
            'Over-Quote, remaining time unknown';
  
  return(
    <Fragment>
      <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      <div>{what.length <= 75 ? what : what.substring(0, 75) + '...'}</div>
      
      {!isDone ?
        <div title={`${q2t} minutes`} className='fade'> -> {q2tStatus}</div>
      : <div className='fade'> -> {Pref.batch} is {Pref.isDone}</div> }
      
    </Fragment>
  );
};





const DownstreamDetailChunk = ({ 
  rowIndex, oB, user,
  pCache, acCache, app, 
  brancheS, branchClear,
  isDebug, isNightly,
  statusCols,
  dense
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
        pCache={pCache}
        app={app}
        isDebug={isDebug}
        isNightly={isNightly}
        statusCols={statusCols}
        dense={dense} />
    
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
  			<a
          title={`View ${oB.batch} in production`}
          className='transparent'
          onClick={()=>goPro(oB.batch)}
          disabled={isRO}>
          <label className='navIcon actionIconWrap taskLink'>
            <i className='fas fa-paper-plane' data-fa-transform='left-1 down-2 shrink-3'></i>
          </label>
          {!dense && <i className='label infoSquareLabel whiteT'>Production</i>}
        </a>
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