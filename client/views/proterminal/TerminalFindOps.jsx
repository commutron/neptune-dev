import React from 'react';
import Pref from '/client/global/pref.js';

import TerminalWrap from '/client/layouts/TerminalLayout';

import XDoProCard from './cards/XDoProCard';
import PartialCard from './cards/PartialCard';


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
  
  
// Item
	if( Pref.regexSN.test(orb) ) {
    if(hotxSeries) {
      let item = itemData(hotxSeries.items, orb);
      let widget = linkedWidget(hotxSeries.widgetId);
      let variant= variantDataByKey(hotxSeries.versionKey);
      let group = linkedGroup(hotxSeries.groupId);
      Session.set('nowInstruct', variant.instruct);
      return (
        <TerminalWrap
          batchData={hotxBatch}
          seriesData={hotxSeries}
          rapidsData={hotxRapids}
          itemData={item}
          itemSerial={item.serial}
          widgetData={widget}
          radioactive={variant.radioactive}
          user={user}
          users={activeUsers}
          app={app}
          action='xItemBuild'
        >
          <XDoProCard
            batchData={hotxBatch}
            seriesData={hotxSeries}
            rapidsData={hotxRapids}
            itemData={item}
            widgetData={widget}
            groupData={group}
            user={user}
            users={activeUsers}
            app={app} />
        </TerminalWrap>
      );
    }
  }
  
  if(!isNaN(orb) && orb.length >= 5) {
    Session.set('nowBatch', orb);
    return(
      <TerminalWrap app={app}>
        <div className='centre wide space'>
          <PartialCard orb={orb} />
        </div>
      </TerminalWrap>
    );
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