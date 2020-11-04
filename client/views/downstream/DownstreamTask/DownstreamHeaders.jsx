import React, { Fragment } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const DownstreamHeaders = ({
  oB, indexKey,
  bCache, pCache, acCache,
  user, app, brancheS,
  isDebug, isNightly,
  focusBy, dense
})=> {

  
  return(
    <Fragment>
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          return(
            <DownstreamFixedChunk
              ck={entry}
              key={indexKey+'c'+index}
              bCache={bCache}
              pCache={pCache}
              acCache={acCache}
              app={app}
              user={user}
              isDebug={isDebug}
              focusBy={focusBy}
              dense={dense}
            />
      )})}
      
    </Fragment>
  );
};

export default DownstreamHeaders;


const DownstreamFixedChunk = ({
  ck,
  bCache, pCache, acCache, 
  app, user, isDebug, focusBy, dense 
})=> {
  
  const isDone = ck.completedAt ? true : false;
  const pt = pCache.find( x => x.batchID === ck.batchID );
  
  const bInfo = bCache ? bCache.find( x => x.batch === ck.batch) : false;
  const what = !bInfo ? 'unavailable' : bInfo.isWhat.join(' ');
  const highG = bInfo && focusBy ? bInfo.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  isDebug && console.log(ck.batch+'='+ck.batchID);
  
  return(
    <div className={`downRowFixed ${highG}`}>
      <PrioritySquare
        batchID={ck.batchID}
        ptData={pt}
        isDone={isDone}
        app={app}
        isDebug={isDebug}
        showLess={true}
      />
      <div><ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} /></div>
      <div>{what.length <= 75 ? what : what.substring(0, 75) + '...'}</div>
    </div>
  );
};