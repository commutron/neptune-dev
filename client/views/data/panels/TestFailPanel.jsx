import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/uUi/Spin.jsx';
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
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
  
  const sortList = fails.sort((s1, s2)=> {
                    if (s1.batch < s2.batch) { return 1 }
                    if (s1.batch > s2.batch) { return -1 }
                    return 0;
                  });
                  
  const rankList = _.countBy(fails, x => x.group);
  const max = _.max(rankList);
  const most = Object.entries(rankList)
                .map( x => x[1] === max && x[0])
                  .filter( x => x !== false);
  const mostClean = most.length > 1 ? most.join(' & ') : most[0];
  
  const rankListW = _.countBy(fails, x => x.widget);
  const maxW = _.max(rankListW);
  const mostW = Object.entries(rankListW)
                .map( x => x[1] === maxW && x[0])
                  .filter( x => x !== false);
  const mostCleanW = mostW.length > 1 ? mostW.join(' & ') : mostW[0];
  
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        <div className='comfort'>
          
          <div className='medBig maxW50'>
            <StatLine
              num={mostClean}
              name={`${most.length > 1 ? 'have' : 'has'} the most with `}
              postNum={max}
              postText={most.length > 1 ? Pref.items +' each' : Pref.items}
              color='darkRedT up'
              big={true} />
            <StatLine
              num={mostCleanW}
              name={`${mostW.length > 1 ? 'are' : 'is'} the most with `}
              postNum={maxW}
              postText={mostW.length > 1 ? Pref.items +' each' : Pref.items}
              color='darkRedT up'
              big={true} />
          </div>
          
          <div className='centreRow middle'>
            
            {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
             Roles.userIsInRole(Meteor.userId(), 'admin') ?
              <TrendLine 
                title='failed items over last 12 weeks'
                statType='failItem'
                cycleCount={12}
                cycleBracket='week'
                lineColor='rgb(192, 57, 43)' />
            : <div>Rate Chart WIP</div>}
          
            <NumStatRing
              total={fails.length}
              nums={[ fails.length, 0, 0 ]}
              name={`Current Failing ${Pref.items}`}
              title={`Current Failing ${Pref.items}`}
              colour='redTri'
              maxSize='chart15Contain'
              noGap={true}
            />
          </div>
        </div>
        
        <div className='vbreak'>
          <details className='footnotes'>
            <summary>Method Details</summary>
            <p className='footnote capFL'>
              {Pref.items} collected are those with failed tests that have 
              <em> neither</em> been passed after nor been scrapped.
            </p>
            <p className='footnote'>
              Top stats are based on currently collected {Pref.items} only.
            </p>
            <p className='footnote'>
              Table is sorted first by {Pref.batch} number, high to low;
              second by serial number, low to high.
            </p>
          </details>
        </div>
          
        
        <TestFailTableAll failData={sortList} />

      </div>
    </div>
  );
};

export default TestFailPanel;