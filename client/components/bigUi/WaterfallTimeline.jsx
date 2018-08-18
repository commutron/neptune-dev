import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import UserName from '/client/components/uUi/UserName.jsx';
import MiniBar from '/client/components/charts/MiniBar.jsx';

const WaterfallTimeline = ({ waterfalls, quantity, app })=> (
  <div className='wide'>
    {waterfalls.map( (entry)=>{
      let count = entry.counts.length > 0 ?
      Array.from(entry.counts, x => x.tick).reduce((x,y)=> x + y) :
      0;
      
      const type = app.countOption.find( x => x.key === entry.wfKey ).type;
      let borderColor = 'borderBlue';
      //// Style the Stone Accordingly \\\\
    	if(type === 'inspect'){
    		borderColor = 'borderGreen';
      }else if(type === 'checkpoint'){
    		borderColor = 'borderWhite';
      }else if(type === 'test'){
    		borderColor = 'borderTeal';
      }else if(type === 'finish'){
    		borderColor = 'borderPurple'
      }else{
        null }
        
      return( 
        <details key={entry.wfKey} className={'waterfallHistory ' + borderColor}>
          <summary className={borderColor}>
            <MiniBar
              key={entry.wfKey}
              title={entry.gate}
              count={count}
              total={quantity} />
          </summary>
          <dl className='waterfallTimeline'>
          {entry.counts.map( (dt, index)=>{
            return(
              <dd key={index}>
                <b className={dt.tick === 1 ? 'greenT' : 'redT'}>{dt.tick === 1 ? '+' : '\u2212'}</b>
                {moment(dt.time).format('YYYY ddd MMM DD hh:mm:ss.SS A')}, <UserName id={dt.who} />
              </dd>
          )})}
          </dl>
        </details>
    )})}
  </div> 
);

export default WaterfallTimeline;