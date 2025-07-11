import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin';
import TimeWindower from '/client/components/bigUi/TimeWindower/TimeWindower';
import { FocusSelect, FilterSelect } from '/client/components/smallUi/ToolBarTools';

import { StatLine } from '/client/components/tinyUi/NumLine';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';
import TrendLine from '/client/components/charts/Trends/TrendLine';
import FailAllTable from '/client/components/tables/FailAllTable';

import { timeRanges } from '/client/utility/CycleCalc';


const TestFailPanel = ({ app })=> {
  
  const [ fails, failsSet ] = useState(false);
  const [ cycleCount, cycleCountSet ] = useState(2);
  const [ cycleBracket, cycleBracketSet ] = useState('week');
  
  const [ groupState, groupSet ] = useState(false);
  const [ widgetState, widgetSet ] = useState(false);
  const [ entryState, entrySet ] = useState(false);
  
  const [ workingList, workingListSet ] = useState([]);
  
  
  useEffect( ()=> {
    Meteor.call('testFailItems', (error, reply)=> {
      error && console.log(error);
      failsSet( reply );
    });
  }, []);
  
  useEffect( ()=>{
    const loopBack = moment().subtract(cycleCount, cycleBracket); 
    const rangeStart = loopBack.clone().startOf(cycleBracket);
    
    if(Array.isArray(fails)) {
      const byGroup = !groupState || groupState === 'false' ? fails :
                fails.filter( r => r.group.toUpperCase() === groupState );
      
      const byWidget = !widgetState || widgetState === 'false' ? byGroup :
                byGroup.filter( r => r.widget.toUpperCase() === widgetState );
      
      const chunk = byWidget.filter( x => x.tfEntries.some( y =>
                                        moment(y.time).isAfter(rangeStart) ) );
      
      workingListSet(chunk);
    }
                    
  }, [fails, cycleCount, cycleBracket, groupState, widgetState]);
  
  function changeGroup(val) {
    groupSet(val);
    widgetSet(false);
  }
  
  if(!fails) {
    return(
      <div className='centreBox'>
        <Spin />
      </div>
    );
  }
  
  const zeroState = workingList.length === 0 ? true : false;
  
  const gList = _.uniq( Array.from(fails, r => r.group.toUpperCase() ) ).sort();
  const wList = _.uniq( Array.from(fails, r => 
                    r.group.toUpperCase() === groupState && r.widget.toUpperCase()
                ) ).filter(f=>f).sort();
  
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        
        <div className='comfort stickInPlace'>
          
          <span className='rowWrap gapsC'>
            <FocusSelect
              gList={gList}
              focusState={groupState}
              changeFunc={(e)=>changeGroup(e.target.value)}
            />
            <FilterSelect
              unqID='fltrTYPE'
              title={`Filter ${Pref.widgets}`}
              selectList={wList}
              selectState={widgetState}
              falsey={`All ${Pref.widgets}`}
              changeFunc={(e)=>widgetSet(e.target.value)}
            />
          
            <TimeWindower 
              app={app} 
              changeCount={(e)=>cycleCountSet(e)}
              changeBracket={(e)=>cycleBracketSet(e)}
              stickyValue={cycleCount+','+cycleBracket}
              sessionSticky={false} />
              
            <label className='liteTool blackT beside'>
              <input
                type='checkbox'
                className='minHeight'
                defaultChecked={entryState}
                onChange={()=>entrySet(!entryState)} 
              /><i>Show Entries</i></label>
          </span>
            
        </div>
          
        <div className='comfort vbreak'>
          
          {zeroState ? <div></div> :
            <FailTops workingList={workingList} />}
          
          <FailCharts
            workingList={workingList}
            cycleCount={cycleCount} 
            cycleBracket={cycleBracket} />
        </div>
       
        <FailAllTable 
          failData={workingList}
          gList={gList}
          showEntries={entryState} />
        
        <FailDetail />
          
      </div>
    </div>
  );
};

export default TestFailPanel;

const FailTops = ({ workingList })=> {
  
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
        name={`${most.length > 1 ? 'have' : 'has'} the most with `}
        postNum={max}
        postText={most.length > 1 ? Pref.items +' each' : Pref.items}
        color='redT up'
        big={true} />
      <StatLine
        num={mostCleanW}
        name={`${mostW.length > 1 ? 'are' : 'is'} the most with `}
        postNum={maxW}
        postText={mostW.length > 1 ? Pref.items +' each' : Pref.items}
        color='redT up'
        big={true} />
    </div>
  );
};

const FailCharts = ({ workingList, cycleCount, cycleBracket })=> {
  
  const countFail = (collected, rangeStart, rangeEnd)=> {
    return collected.filter( x =>
      x.tfEntries.some( y =>
        moment(y.time).isBetween(rangeStart, rangeEnd) 
      ) === true
    ).length;
  };
  
  const [ workingRate, workingRateSet ] = useState([ {x:1,y:0} ]);
  
  useEffect( ()=>{
    const xy = timeRanges(workingList, countFail, cycleCount, cycleBracket);
    workingRateSet(xy);
  }, [workingList, cycleCount, cycleBracket]);
  
  return(
    <div className='centreRow beside'>
      <TrendLine 
        title={`failed ${Pref.items} items over last ${cycleCount} ${cycleBracket}s`}
        localXY={workingRate}
        cycleCount={cycleCount}
        cycleBracket={cycleBracket}
        lineColor='rgb(192, 57, 43)' />
    
      <NumStatBox
        number={workingList.length}
        name={`Failed ${Pref.items}`}
        title={`Failed ${Pref.items}`}
        borderColour="var(--pomegranate)"
      />
    </div>
  );
};

const FailDetail = ()=> (
  <details className='footnotes'>
    <summary>Method Details</summary>
    <p className='footnote'>
      Top stats are based on currently collected {Pref.items} only.
    </p>
    <p className='footnote'>
      Rate Chart is based on selected time period.
    </p>
  </details>  
);