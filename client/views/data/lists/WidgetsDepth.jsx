import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import DumbFilter from '/client/components/tinyUi/DumbFilter.jsx';
import LeapRow from '/client/components/tinyUi/LeapRow.jsx';
import NumStat from '/client/components/uUi/NumStat.jsx';

const WidgetsDepth = ({ groupAlias, widgetData, active })=> {
  
  const [ textString, textStringSet ] = useState( '' );
  
  function setTextFilter(rule) {
    textStringSet( rule.toLowerCase() );
  }
  
  const w = widgetData.sort((w1, w2)=> {
              if (w1.widget < w2.widget) { return -1 }
              if (w1.widget > w2.widget) { return 1 }
              return 0;
            });
  
  let showList = w.filter( 
    tx => tx.widget.toLowerCase().includes(textString) === true ||
          tx.describe.toLowerCase().includes(textString) === true);

  return(
    <AnimateWrap type='cardTrans'>
      <div className='' key={1}>
        <DumbFilter
          size='big'
          onTxtChange={(e)=>setTextFilter(e)}
          labelText='Filter searches id and description, not case-sensitve.' />
        
        <div className='tableList'>
          {w.length < 1 ? <p>no {Pref.widget}s created</p> : null}
            { showList.map( (entry, index)=> {
            let ac = active.includes(entry._id) ? 'activeMark' : '';
              return(
                <WidgetIndexCard 
                  key={index} 
                  data={entry} 
                  barStyle={ac} />
            )})}
        </div>
        
      </div>
    </AnimateWrap>
  ); 
};

export default WidgetsDepth;

const WidgetIndexCard = ({ data, barStyle })=>{
  
  const [ moreData, moreSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('widgetTops', data._id, (err, reply)=>{
      err && console.log(err);
      !reply ? null : moreSet( reply );
    });
  }, []);
  
  
  function totalB(mData) {
    let batch = mData.batchInfo.length;
    let batchX = mData.batchInfoX.length;
    let total = batch + batchX;
    return total;
  }
  
  function totalI(mData) {
    let items = Array.from(mData.batchInfo, x => x.items);
    let quantities = Array.from(mData.batchInfoX, x => x.quantity);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    return total + totalX;
  }
  
  function totalNC(mData) {
    let ncs = Array.from(mData.batchInfo, x => x.nonCons);
    let ncsX = Array.from(mData.batchInfoX, x => x.nonCons);
    let allNCs = ncs.length > 0 ? ncs.reduce((x,y)=>x+y) : 0;
    let allNCsX = ncsX.length > 0 ? ncsX.reduce((x,y)=>x+y) : 0;
    const total = allNCs + allNCsX;
    return total;
  }
  
  const mData = moreData;
  
  if(!mData) {
    return(
      <CalcSpin />
    );
  }
    
  let totalBatches = totalB(mData);
  let totalItems = totalI(mData);
  let totalNonCons = totalNC(mData);
    
  return(
    <LeapRow
      title={data.widget.toUpperCase()}
      cTwo={data.describe}
      cThree={
        <NumStat
          num={totalBatches}
          name={Pref.batches}
          title={'all ' + Pref.batches + ' & Batch+'}
          color='blueT'
          size='big' />
      }
      cFour={
        <NumStat
          num={totalItems}
          name={Pref.items}
          title={'serialized items of all ' + Pref.batch + 'es'}
          color='blueT'
          size='big' />
      }
      cFive={
        <NumStat
          num={totalNonCons}
          name={'nonCons'}
          title={'total of all ' + Pref.batch + 'es'}
          color='redT'
          size='big' />
      }
      sty={barStyle}
      address={'/data/widget?request=' + data.widget}
    />
  );
};