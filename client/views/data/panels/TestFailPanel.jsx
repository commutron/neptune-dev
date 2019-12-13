import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import { StatLine } from '/client/components/uUi/NumLine.jsx';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import TestFailTableAll from '/client/components/tables/TestFailTableAll.jsx';


const TestFailPanel = (props)=> {
  
  const [ fails, failsSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('testFailItems', (error, reply)=> {
      error && console.log(error);
      failsSet( reply );
    });
  }, []);
    
  if(!fails) {
    return(
      <CalcSpin />
    );
  }
  
  const sortList = fails.sort((s1, s2)=> {
                    if (s1.batch < s2.batch) { return 1 }
                    if (s1.batch > s2.batch) { return -1 }
                    return 0;
                  });
                  
  const rankList = _.countBy(sortList, x => x.group);
  const max = _.max(rankList);
  const most = Object.entries(rankList)
                .map( x => x[1] === max && x[0])
                  .filter( x => x !== false);
  const mostClean = most.length > 1 ? most.join(' & ') : most[0];
  
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        <div className='vbreak comfort'>
          
          <div className='medBig maxW30'>
            <StatLine
              num={mostClean}
              name={`${most.length > 1 ? 'have' : 'has'} the most with `}
              postNum={max}
              postText={most.length > 1 ? Pref.items +' each' : Pref.items}
              color='darkOrangeT up'
              big={true} />
          </div>
          
          <div className='centreRow middle'>
            
            <TrendLine 
              title='failed items over last 12 months'
              statType='failItem'
              cycleCount={12}
              cycleBracket='month'
              lineColor='rgb(230, 126, 34)' />
          
            <NumStatRing
              total={fails.length}
              nums={[ fails.length, 0 ]}
              name={`Current Failing ${Pref.items}`}
              title={`Current Failing ${Pref.items}`}
              colour='orangeBi'
              maxSize='chart15Contain'
            />
          </div>
        </div>
        
        <TestFailTableAll failData={sortList} />

      </div>
    </div>
  );
};

export default TestFailPanel;