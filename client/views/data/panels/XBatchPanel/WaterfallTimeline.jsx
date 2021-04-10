import React from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import MiniBar from '/client/components/charts/MiniScales/MiniBar.jsx';
import { countWaterfall } from '/client/utility/Arrays';

import '/client/components/riverX/waterfall/style.css';

const WaterfallTimeline = ({ wfCounts, waterfall, quantity, rapidsData, app })=> {

  const waterfallS = waterfall.sort((w1, w2)=> 
          !w1.position ? -1 : !w2.position ? -1 :
          w1.position > w2.position ? 1 : w1.position < w2.position ? -1 : 0 );
  
  return(
    <div className='wide'>
      
      {waterfall.length === 0 && !rapidsData ?
        <div className='centreText fade'>
          <i className='fas fa-stopwatch fa-3x'></i>
          <p className='big'>No Counters</p>
        </div>
      : null}
      
      {waterfallS.map( (entry)=> {
        const countObj = wfCounts.find( w => w.wfKey === entry.wfKey );
        return(
          <FallsHistory
            key={entry.wfKey}
            entry={entry}
            count={countObj ? countObj.count : 0}
            quantity={quantity}
          />
      )})}
      
      {rapidsData && rapidsData.map( (entry, index)=> {
        return(
          <div key={index}>
            <h4>{entry.rapid}</h4>
            {entry.cascade.length === 0 ?
              <p className='medBig grayT'>No Counters</p>
              :
              entry.cascade.map( (cas)=> {
                const count = countWaterfall(cas.counts);
                return(
                  <FallsHistory
                    key={cas.wfKey}
                    entry={cas}
                    count={count}
                    quantity={entry.quantity}
                  />
            )})}
          </div>
      )})}
    </div> 
  );
};

export default WaterfallTimeline;

const FallsHistory = ({ entry, count, quantity })=> {

  const type = entry.type || false;
  const topNum = entry.action === 'slider' ? 'percent' : quantity;
  
  let borderColor = 'borderBlue';
  let barColor = 'proBlue';
	if(type === 'inspect'){
		borderColor = 'borderGreen';
		barColor = 'proGreen';
  }else if(type === 'checkpoint'){
		borderColor = 'borderGray';
		barColor = 'proGray';
  }else if(type === 'test'){
		borderColor = 'borderTeal';
		barColor = 'proTeal';
  }else if(type === 'finish'){
		borderColor = 'borderPurple';
		barColor = 'proPurple';
  }else{
    null }
        
  return( 
    <details className={'waterfallHistory ' + borderColor}>
      <summary className={borderColor}>
        <MiniBar
          key={entry.wfKey}
          title={`${entry.gate} - ${entry.type}`}
          count={count}
          total={topNum}
          barColor={barColor} />
      </summary>
      <dl className='waterfallTimeline'>
      {entry.counts.map( (dt, index)=>{
        const tickColor = dt.tick === 0 ? 'whiteT small numFont' : dt.tick === 1 ? 'greenT' : 'redT';
        const tickSymbol = dt.tick === 0 ? dt.meta === 'start' ?  '\u25B6' : '\u2BC0' :
                            dt.tick === 1 ? '+' : '\u2212';
        return(
          <dd key={index}>
            <b className={tickColor}>{tickSymbol}</b>
            {moment(dt.time).format('YYYY ddd MMM DD hh:mm:ss.SS A')}, <UserNice id={dt.who} />
          </dd>
      )})}
      </dl>
    </details>
  );
};