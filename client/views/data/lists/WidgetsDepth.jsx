import React, { useState, useEffect, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import LeapLine from '/client/components/tinyUi/LeapLine';
import NumStat from '/client/components/tinyUi/NumStat';
import { flexSort } from '/client/utility/Arrays.js';

const WidgetsDepth = ({ filterString, clearfilter,widgetData, state })=> {
  
  let textList = !filterString ? widgetData : widgetData.filter( 
    tx => tx.widget.toLowerCase().includes(filterString) === true ||
          tx.describe.toLowerCase().includes(filterString) === true);
  
  let statList = !state ? textList : state == 1 ? 
                  textList.filter( rd => rd.vopen ) :
                  textList.filter( rd => !rd.vopen );
  
  const showList = flexSort(statList, 'widget');
  
  return(
    <div className='wide vspacehalf max1000'>
      <div className='leapHead stick'>
        <div></div>
        <div></div>
        <div className='cap'>
          {/*}<span>{Pref.variants}</span>*/}
          <span>{Pref.xBatchs}</span>
          <span>Qty</span>
          <span>NC</span>
        </div>
      </div>
      {widgetData.length < 1 ? 
        <p className='centreText'>no {Pref.widget}s created</p>
      :
        showList.length < 1 ? 
          <div>
            <p className='centreText'>No Match Found</p>
            <p className='centreText'>
              <button 
                onClick={()=>clearfilter()}
                className='smallAction textAction'
              >Show All</button>
            </p>
          </div>
      :
        showList.map( (entry)=> {
        let ac = entry.blive ? 'activeMark' : '';
          return(
            <WidgetIndexCard 
              key={entry._id} 
              data={entry} 
              barStyle={ac}
            />
        )})}
    </div>
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
  
  if(!moreData) {
    return null;
  }
    
  return(
    <LeapLine
      title={data.widget.toUpperCase()}
      cTwo={data.describe}
      cThree={
        <Fragment>
          {/*<NumStat
            num={moreData[0]}
            title={`Total ${Pref.variants}`}
            color='blueT'
            size='medBig'
          />*/}
          <NumStat
            num={moreData[1]}
            title={`Total ${Pref.xBatchs}`}
            color='blueT'
            size='medBig'
          />
          <NumStat
            num={moreData[2]}
            title={`Total quantities of all ${Pref.xBatchs}`}
            color='blueT'
            size='medBig'
          />
          <NumStat
            num={data.ncRate?.rate || 0}
            title={`Average ${Pref.nonCon} rate`}
            color='redT'
            size='medBig'
          />
        </Fragment>
      }
      sty={barStyle}
      address={'/data/widget?request=' + data._id}
    />
  );
};