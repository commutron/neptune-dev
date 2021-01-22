import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import MiniBar from '/client/components/charts/MiniScales/MiniBar.jsx';

import '/client/components/river/waterfall/style.css';

const WaterfallTimeline = ({ wfCounts, waterfall, quantity, app })=> {

  const waterfallS = waterfall.sort((w1, w2)=> 
          !w1.position ? -1 : !w2.position ? -1 :
          w1.position > w2.position ? 1 : w1.position < w2.position ? -1 : 0 );
    
  return(
    <div className='wide'>
      {waterfallS.map( (entry)=>{
        const countObj = wfCounts.find( w => w.key === entry.wfKey );
        const count = countObj ? countObj.count : 0;
        const type = countObj ? countObj.type : false;
        
        let borderColor = 'borderBlue';
        let barColor = 'proBlue';
      	if(type === 'inspect'){
      		borderColor = 'borderGreen';
      		barColor = 'proGreen';
        }else if(type === 'checkpoint'){
      		borderColor = 'borderWhite';
      		barColor = 'proWhite';
        }else if(type === 'test'){
      		borderColor = 'borderTeal';
      		barColor = 'proTeal';
        }else if(type === 'finish'){
      		borderColor = 'borderPurple';
      		barColor = 'proPurple';
        }else{
          null }
        
        return( 
          <details key={entry.wfKey} className={'waterfallHistory ' + borderColor}>
            <summary className={borderColor}>
              <MiniBar
                key={entry.wfKey}
                title={`${entry.gate} - ${entry.type}`}
                count={count}
                total={quantity}
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
      )})}
    </div> 
  );
};

export default WaterfallTimeline;