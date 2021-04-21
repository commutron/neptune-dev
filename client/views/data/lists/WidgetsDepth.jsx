import React, { useState, useEffect, Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import DumbFilter from '/client/components/tinyUi/DumbFilter.jsx';
import LeapLine from '/client/components/tinyUi/LeapLine';
import NumStat from '/client/components/tinyUi/NumStat.jsx';

const WidgetsDepth = ({ groupAlias, widgetData, active })=> {
  
  const [ textString, textStringSet ] = useState( '' );
  
  function setTextFilter(rule) {
    textStringSet( rule.toLowerCase() );
  }
  
  const w = widgetData.sort((w1, w2)=>
              w1.widget < w2.widget ? -1  : w1.widget > w2.widget ? 1 : 0 );
  
  let showList = w.filter( 
    tx => tx.widget.toLowerCase().includes(textString) === true ||
          tx.describe.toLowerCase().includes(textString) === true);

  return(
    <Fragment>
      <DumbFilter
        size='medBig'
        onTxtChange={(e)=>setTextFilter(e)}
        labelText='Filter searches id and description, not case-sensitve.' />
      
      <div className='wide vspacehalf max1000'>
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
      
    </Fragment>
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
  
  function totalI(mData) {
    let quantities = Array.from(mData, x => x.quantity);
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    return totalX;
  }
  
  if(!moreData) {
    return( <em>. . .</em> );
  }
    
  let totalBatches = moreData[1].length;
  let totalItems = totalI(moreData[1]);
    
  return(
    <LeapLine
      title={data.widget.toUpperCase()}
      cTwo={data.describe}
      cThree={
        <span className='centreRow'>
          <NumStat
            num={moreData[0]}
            name={Pref.variants}
            title={`total ${Pref.variants}`}
            color='blueT'
            size='medBig' />
          <NumStat
            num={totalBatches}
            name={Pref.batches}
            title={'all ' + Pref.batches + ' & Batch+'}
            color='blueT'
            size='medBig' />
          <NumStat
            num={totalItems}
            name={Pref.items}
            title={'serialized items of all ' + Pref.batch + 'es'}
            color='blueT'
            size='medBig' />
        </span>
      }
      sty={barStyle}
      // address={'/data/widget?request=' + data.widget}
      address={'/data/widget?request=' + data._id}
    />
  );
};