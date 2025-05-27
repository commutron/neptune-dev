import React from 'react';
import Pref from '/client/global/pref.js';


const TerminalFindOps = ({ 
  hotxBatch, hotxSeries, hotxRapids,
  allxBatch,
  allGroup, allWidget, allVariant,
  user, activeUsers, app,
  orb, anchor
})=> {

  
  function itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }
  
  function linkedGroup(gId) {
    return allGroup.find(x => x._id === gId);
  }
  
  function linkedWidget(wId) {
    return allWidget.find(x => x._id === wId);
  }
  
  function variantDataByKey(vKey) {
    return allVariant.find(x => x.versionKey === vKey);
  }
  
  Session.set('nowBatch', false);
	return (
	  <div>
      <div className='centre wide'>
        <p className='biggest'>process in process</p>
      </div>
    </div>
  );
};

export default TerminalFindOps;