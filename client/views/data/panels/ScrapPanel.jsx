import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin.jsx';

import { FocusSelect, FilterSelect } from '/client/components/smallUi/ToolBarTools';
import TimeWindower from '/client/components/bigUi/TimeWindower/TimeWindower.jsx';
import { StatLine } from '/client/components/tinyUi/NumLine.jsx';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import ScrapTableAll from '/client/components/tables/ScrapTableAll.jsx';

import PagingSelect from '/client/components/tinyUi/PagingSelect.jsx';
import { chunkArray } from '/client/utility/Convert';

import { timeRanges } from '/client/utility/CycleCalc';


const ScrapPanel = ({ batchData, app })=> {
  
  const [ scraps, scrapsSet ] = useState(false);
  const [ cycleCount, cycleCountSet ] = useState(2);
  const [ cycleBracket, cycleBracketSet ] = useState('week');
  
  const [ groupState, groupSet ] = useState(false);
  const [ typeState, typeSet ] = useState(false);
  
  const [ pageState, pageSet ] = useState(0);
  
  const [ workingList, workingListSet ] = useState([]);
  
  useEffect( ()=> {
    Meteor.call('scrapItems', (error, reply)=> {
      error && console.log(error);
      scrapsSet( reply );
    });
  }, []);
  
  useEffect( ()=>{
    const loopBack = moment().subtract(cycleCount, cycleBracket); 
    const rangeStart = loopBack.clone().startOf(cycleBracket);
    
    if(Array.isArray(scraps)) {
      const byGroup = !groupState || groupState === 'false' ? scraps :
                scraps.filter( r => r.group.toUpperCase() === groupState );
      
      const byType = !typeState || typeState === 'false' ? byGroup :
                byGroup.filter( r => r.scEntry.step === typeState );
      
      const chunk = byType.filter( x => moment(x.scEntry.time)
                                          .isAfter(rangeStart) );

      const sortList = chunk.sort((s1, s2)=> {
                    if (s1.scEntry.time < s2.scEntry.time) { return 1 }
                    if (s1.scEntry.time > s2.scEntry.time) { return -1 }
                    return 0;
                  });
      
      pageSet(0);
      workingListSet(sortList);
    }
                    
  }, [scraps, cycleCount, cycleBracket, groupState, typeState]);
  
  
  if(!scraps) {
   return(
      <div className='centreBox'>
        <Spin />
      </div>
    );
  }
  
  const zeroState = workingList.length === 0 ? true : false;
  
  const gList = _.uniq( Array.from(scraps, r => r.group.toUpperCase() ) ).sort();
  const tList = _.uniq( Array.from(scraps, r => r.scEntry.step ) ).sort();
  
  const inpieces = chunkArray(workingList, Pref.pagingSize);
  
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        
        <div className='comfort'>

          <span className='balancer gapsC'>
            <FocusSelect
              gList={gList}
              focusState={groupState}
              changeFunc={(e)=>groupSet(e.target.value)}
            />
            <FilterSelect
              unqID='fltrTYPE'
              title='Filter Step'
              selectList={tList}
              selectState={typeState}
              falsey='All Steps'
              changeFunc={(e)=>typeSet(e.target.value)}
            />
            <TimeWindower 
              app={app} 
              changeCount={(e)=>cycleCountSet(e)}
              changeBracket={(e)=>cycleBracketSet(e)}
              stickyValue={cycleCount+','+cycleBracket}
              sessionSticky={false} />
          </span>
              
        </div>
        
        <div className='comfort vbreak'>
          
          {zeroState ? <div></div> :
            <ScrapTops workingList={workingList} />}
          
          <ScrapCharts
            workingList={workingList}
            cycleCount={cycleCount}
            cycleBracket={cycleBracket} 
          />
        </div>
        
        <PagingSelect 
          multiArray={inpieces}
          isSet={pageState}
          doChange={(e)=>pageSet(e)} />
        
        <ScrapTableAll scrapData={inpieces[pageState] || []} />
        
        <PagingSelect 
          multiArray={inpieces}
          isSet={pageState}
          doChange={(e)=>pageSet(e)} />
      
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
      </div>
    </div>
  );
};

export default ScrapPanel;

const ScrapTops = ({ workingList })=> {
  
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
    <div className='medBig maxW50'>
      <StatLine
        num={mostClean}
        name={`${most.length > 1 ? 'have' : 'has'} the most ${Pref.scrapped} with `}
        postNum={max}
        postText={most.length > 1 ? Pref.scraps +' each' : Pref.scraps}
        color='redT up'
        big={true} />
      
      <StatLine
        num={mostCleanW}
        name={`${mostW.length > 1 ? 'are' : 'is'} the most ${Pref.scrapped} with `}
        postNum={maxW}
        postText={mostW.length > 1 ? Pref.scraps +' each' : Pref.scraps}
        color='redT up'
        big={true} />
    </div>
  );
};

const ScrapCharts = ({ workingList, cycleCount, cycleBracket })=> {
  
  const countScrap = (collected, rangeStart, rangeEnd)=> {
    let scCount = collected.filter( x =>
      moment(x.scEntry.time).isBetween(rangeStart, rangeEnd)
    ).length;
    return scCount;
  };

  const [ workingRate, workingRateSet ] = useState([ {x:1,y:0} ]);

  useEffect( ()=>{
    const xy = timeRanges(workingList, countScrap, cycleCount, cycleBracket);
    workingRateSet(xy);
  }, [workingList]);
  
  return(
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
  );
};