import React from 'react';
import moment from 'moment';
import UserNice from '/client/components/smallUi/UserNice';
import MiniBar from '/client/components/charts/MiniScales/MiniBar';
import TickScatter from '/client/components/charts/TickScatter';
import { countWaterfall } from '/client/utility/Arrays';

import '/client/components/riverX/waterfall/style.css';

const CountTab = ({ batchData, fallData, rapidsData, app })=> {

  return(
    <div className='space autoSelf max875'>
      
      {batchData.waterfall.length === 0 && (!rapidsData || rapidsData.length === 0) ?
        <div className='centreText fade'>
          <i className='fas fa-stopwatch fa-2x'></i>
          <p className='medBig'>No Counters</p>
        </div>
      : 
        <span>
          <WaterfallTimeline
            wfCounts={fallData.fallProg}
            waterfall={batchData.waterfall}
            quantity={batchData.quantity}
            rapidsData={rapidsData}
            app={app} />

          <TickScatter
            waterfall={batchData.waterfall}
            rapidsData={rapidsData}
          />
        </span>
      }
    </div>
  );
};

export default CountTab;

const WaterfallTimeline = ({ wfCounts, waterfall, quantity, rapidsData, app })=> {

  const waterfallS = waterfall.sort((w1, w2)=> 
          !w1.position ? -1 : !w2.position ? -1 :
          w1.position > w2.position ? 1 : w1.position < w2.position ? -1 : 0 );

  return(
    <div className='wide'>
      
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
        if(entry.cascade.length > 0) {
          return(
            <div key={index}>
              <h4>{entry.rapid}</h4>
              {entry.cascade.map( (cas)=> {
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
      )}})}
    </div> 
  );
};

const FallsHistory = ({ entry, count, quantity })=> {

  const type = entry.type || false;
  const topNum = entry.action === 'slider' ? 'percent' : quantity;
  
  let borderColor = 'borderBlue';
  let barColor = 'proBlue';
	if(type === 'inspect'){
		borderColor = 'borderGreen';
		barColor = 'proGreen';
  }else if(type === 'generic'){
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
          title={`${entry.gate} - ${entry.type || null}`}
          count={count}
          total={topNum}
          barColor={barColor} />
      </summary>
      <dl className='waterfallTimeline'>
      {entry.counts.map( (dt, index)=>{
        const tickColor = dt.tick === 0 ? 'whiteT small numFont' : dt.tick > 0 ? 'greenT' : 'redT';
        const tickSymbol = dt.tick === 0 ? dt.meta === 'start' ?  '\u25B6' : '\u2BC0' :
                            dt.tick > 0 ? '+' : '\u2212';
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