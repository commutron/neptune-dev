import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import LeapRow from '/client/components/tinyUi/LeapRow.jsx';


const VariantList = ({ variantData, widgetData, app })=>	{
                
  let v = variantData.sort((v1, v2)=> {
          if (v1.variant < v2.variant) { return 1 }
          if (v1.variant > v2.variant) { return -1 }
          return 0;
        });
  
  return(
    <div className='space'>
      {v.length < 1 ? <p>no {Pref.variants} created</p> : null}
      {v.map( (entry, index)=> {
        let ac = entry.live ? 'activeMark vmarginhalf' : 'vmarginhalf';
        return(
          <VariantIndexCard 
            key={entry.versionKey} 
            widget={widgetData.widget} 
            vTitle={entry.variant}
            vDate={entry.createdAt}
            barStyle={ac} />
      )})}
    </div>
  ); 
};

export default VariantList;

const VariantIndexCard = ({ widget, vTitle, vDate, barStyle })=> {

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
  
  const cTime = moment(vDate).calendar();
      
  return(
    <LeapRow
      title={vTitle}
      cTwo={`created: ${cTime}`}
      cThree=''
      cFour=''
      cFive=''
      cSix=''
      sty={barStyle}
      address={'/data/widget?request=' + widget + '&specify=' + vTitle}
    />
  );
};
