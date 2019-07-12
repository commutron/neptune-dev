import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import MiniBar from '/client/components/charts/MiniScales/MiniBar.jsx';

const WaterfallTimeline = ({ waterfalls, quantity, app })=> (
  <div className='wide'>
    {waterfalls.map( (entry)=>{
      let count = entry.counts.length > 0 ?
      Array.from(entry.counts, x => x.tick).reduce((x,y)=> x + y) :
      0;
      
      const type = app.countOption.find( x => x.key === entry.wfKey ).type;
      let borderColor = 'borderBlue';
      let barColor = 'proBlue';
      //// Style the Stone Accordingly \\\\
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
              title={entry.gate}
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

export default WaterfallTimeline;