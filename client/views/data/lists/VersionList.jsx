import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import LeapRow from '/client/components/tinyUi/LeapRow.jsx';

const VersionList = ({ versionData, widgetData, app })=>	{
                
  let v = versionData.sort((v1, v2)=> {
          if (v1.version < v2.version) { return 1 }
          if (v1.version > v2.version) { return -1 }
          return 0;
        });
  
  return (
    <AnimateWrap type='cardTrans'>
      <div className='space'>
        {v.length < 1 ? <p>no {Pref.version}s created</p> : null}
        {v.map( (entry, index)=> {
          let ac = entry.live ? 'activeMark vmarginhalf' : 'vmarginhalf';
          return(
            <VersionIndexCard 
              key={entry.versionKey} 
              widget={widgetData.widget} 
              version={entry} 
              barStyle={ac} />
        )})}
      </div>
    </AnimateWrap>
  ); 
};

export default VersionList;

const VersionIndexCard = ({ widget, version, barStyle })=> {

  /*
  totalI(mData) {
    let items = Array.from(mData.batchInfo, x => x.items);
    let quantities = Array.from(mData.batchInfoX, x => x.quantity);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    return total + totalX;
  }
  */
  
  /*
  avgNC(mData) {
    let items = Array.from(mData.batchInfo, x => x.items);
    let quantities = Array.from(mData.batchInfoX, x => x.quantity);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    
    let ncs = Array.from(mData.batchInfo, x => x.nonCons);
    let ncsX = Array.from(mData.batchInfoX, x => x.nonCons);
    
    let allNCs = ncs.length > 0 ? ncs.reduce((x,y)=>x+y) : 0;
    let allNCsX = ncsX.length > 0 ? ncsX.reduce((x,y)=>x+y) : 0;
    
    let perI = (allNCs / ( total > 0 ? total : 1));
    let perIX = (allNCsX / ( totalX > 0 ? totalX : 1) );
    const perItem = ( perI + perIX ).toFixed(1);
    
    let perW = (allNCs / (ncs.length > 0 ? ncs.length : 1) );
    let perWX = (allNCsX / (ncsX.length > 0 ? ncsX.length : 1) );
    const perWOrder = ( perW + perWX ).toFixed(1);
    
    return { perItem, perWOrder };
  }
  */
  
  const cTime = moment(version.createdAt).calendar();
      
  return(
    <LeapRow
      title={version.version}
      cTwo={`created: ${cTime}`}
      cThree=''
      cFour=''
      cFive=''
      cSix=''
      sty={barStyle}
      address={'/data/widget?request=' + widget + '&specify=' + version.version}
    />
  );
};