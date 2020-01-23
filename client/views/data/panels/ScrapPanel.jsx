import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/uUi/Spin.jsx';
import TimeWindower from '/client/components/bigUi/TimeWindower/TimeWindower.jsx';
import { StatLine } from '/client/components/uUi/NumLine.jsx';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import ScrapTableAll from '/client/components/tables/ScrapTableAll.jsx';

import { timeRanges } from '/client/components/utilities/CycleCalc';

function countScrap(collected, rangeStart, rangeEnd) {
  
  let scCount = collected.filter( x =>
    moment(x.scEntry.time).isBetween(rangeStart, rangeEnd)
  ).length;
  
  return scCount;
}

const ScrapPanel = ({ batchData, app })=> {
  
  const sessionSticky = 'scrapOverview';
  const ss = Session.get(sessionSticky) || '2,week';
  const selection = ss.split(',');
  
  const [ scraps, scrapsSet ] = useState(false);
  const [ cycleCount, cycleCountSet ] = useState( Math.abs(selection[0]) || 2);
  const [ cycleBracket, cycleBracketSet ] = useState( selection[1] || 'week');
  
  const [ workingList, workingListSet ] = useState([]);
  const [ workingRate, workingRateSet ] = useState([ {x:1,y:0} ]);
  
  useEffect( ()=> {
    Meteor.call('scrapItems', (error, reply)=> {
      error && console.log(error);
      scrapsSet( reply );
    });
  }, []);
  
  useEffect( ()=>{
    const loopBack = moment().subtract(cycleCount, cycleBracket); 
    const rangeStart = loopBack.clone().startOf(cycleBracket);
    
    if(scraps) {
      const chunk = scraps.filter( x => moment(x.scEntry.time)
                                          .isAfter(rangeStart) );

      const sortList = chunk.sort((s1, s2)=> {
                    if (s1.scEntry.time < s2.scEntry.time) { return 1 }
                    if (s1.scEntry.time > s2.scEntry.time) { return -1 }
                    return 0;
                  });
    
      workingListSet(sortList);
    }
                    
  }, [scraps, cycleCount, cycleBracket]);
  
  useEffect( ()=>{
    if(scraps) {
      const xy = timeRanges(workingList, countScrap, cycleCount, cycleBracket);
      workingRateSet(xy);
    }
  }, [workingList]);
  
  if(!scraps) {
    return(
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
  
  const zeroState = workingList.length === 0 ? true : false;
  
  const rankList = _.countBy(workingList, x => x.group);
  const max = _.max(rankList);
  const most = Object.entries(rankList)
                .map( x => x[1] === max && x[0])
                  .filter( x => x !== false);
  const mostClean = most.length > 1 ? most.join(' & ') : 
                    most[0];
  
  const rankListW = _.countBy(workingList, x => x.widget);
  const maxW = _.max(rankListW);
  const mostW = Object.entries(rankListW)
                .map( x => x[1] === maxW && x[0])
                  .filter( x => x !== false);
  const mostCleanW = mostW.length > 1 ? mostW.join(' & ') : 
                     mostW[0];
                      
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        
        <div className='comfort'>
          <details className='footnotes'>
            <summary>Method Details</summary>
            <p className='footnote capFL'>
              {Pref.items} collected are all {Pref.scrapped} {Pref.items} since records began;
              <em> unless</em> the {Pref.scrap} was canceled.
            </p>
            <p className='footnote'>
              Table is sorted by the time the {Pref.item} was {Pref.scrapped}.
            </p>
          </details>
          
          <TimeWindower 
            app={app} 
            changeCount={(e)=>cycleCountSet(e)}
            changeBracket={(e)=>cycleBracketSet(e)}
            stickyValue={cycleCount+','+cycleBracket}
            sessionSticky={sessionSticky} />
              
        </div>
        
        <div className='comfort vbreak'>
          
          {!zeroState ?
            <div className='medBig maxW50'>
              <StatLine
                num={mostClean}
                name={`${most.length > 1 ? 'have' : 'has'} the most with `}
                postNum={max}
                postText={most.length > 1 ? Pref.scraps +' each' : Pref.scraps}
                color='redT up'
                big={true} />
              
              <StatLine
                num={mostCleanW}
                name={`${mostW.length > 1 ? 'are' : 'is'} the most with `}
                postNum={maxW}
                postText={mostW.length > 1 ? Pref.scraps +' each' : Pref.scraps}
                color='redT up'
                big={true} />
            </div>
          : <div></div>}
          
          <div className='centreRow middle'>
            
            <TrendLine 
              title={`${Pref.scrapped} ${Pref.items} over last ${cycleCount} ${cycleBracket}s`}
              localXY={workingRate}
              cycleCount={cycleCount}
              cycleBracket={cycleBracket}
              lineColor='rgb(231, 76, 60)' />
          
            <NumStatRing
              total={workingList.length}
              nums={[ 0, workingList.length, 0 ]}
              name={`Total ${Pref.scrap} ${Pref.items}`}
              title={`Total ${Pref.scrap} ${Pref.items}\nof all time`}
              colour='redTri'
              maxSize='chart15Contain'
              noGap={true}
            />
          </div>
        </div>
        
        <ScrapTableAll scrapData={workingList} />
      
      </div>
    </div>
  );
};

export default ScrapPanel;