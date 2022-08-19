import React from 'react';
import Pref from '/client/global/pref.js';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const BatchHeaderChunk = ({ 
  id, batch, releases, isDone, topRapid, 
  tBatch, app, 
  rowclss, nameLth, focusBy, tagBy, stormy,
  isDebug
})=> {
  
  const whaT = !tBatch ? 'unavailable' : tBatch.isWhat.join(' ');
  const desc = !tBatch ?  'unavailable' : tBatch.describe;
  
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags && tBatch.tags.includes(tagBy) ? '' : 'hide' : '';
  
  const releasedToFloor = !releases ? '' :
          releases.findIndex( x => 
            x.type === 'floorRelease') >= 0 ? '' : 'ghostState';
  
  let storm = !stormy ? '' :
        stormy === 0 && tBatch.stormy[0] !== true ||
        stormy === 1 && tBatch.stormy[1] !== true ||
        stormy === 2 && tBatch.stormy[2] !== true ? 'clearall' : '';
  
  isDebug && console.log(batch+'='+id);
  
  return(
    <div className={`${rowclss} ${releasedToFloor} ${highG} ${highT} ${storm}`}>
      <PrioritySquare
        batchID={id}
        ptData={tBatch}
        isDone={isDone}
        oRapid={tBatch ? tBatch.oRapid : null}
        app={app}
        isDebug={isDebug}
        showLess={true}
      />
      <div>
        <ExploreLinkBlock 
          type='batch' 
          keyword={batch} 
          altName={topRapid ? tBatch.oRapid : false}
          wrap={false} 
          rad={tBatch ? tBatch.rad : null}
        />
      </div>
      <div title={desc}
        >{whaT.length <= (nameLth || 75) ? whaT : whaT.substring(0, 65) + '...'}</div>
    </div>
  );
};

export default BatchHeaderChunk;


export const ServeHeaderChunk = ({ 
  sv, app, 
  rowclss, nameLth,
  isDebug
})=> {
  
  isDebug && console.log(sv);
  
  return(
    <div className={rowclss}>
      <PrioritySquare
        app={app}
        showLess={true}
        altNumber='🛠'
      />
      <div>
        <ExploreLinkBlock type='equip' keyword={sv.equip} />
      </div>
      <div className='cap'>{
        sv.title.length <= (nameLth || 75) ? 
        sv.title : 
        sv.title.substring(0, 65) + '...'
      } {Pref.maintain}</div>
    </div>
  );
};