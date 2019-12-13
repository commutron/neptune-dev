import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import { StatLine } from '/client/components/uUi/NumLine.jsx';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import ScrapTableAll from '/client/components/tables/ScrapTableAll.jsx';

const ScrapPanel = (props)=> {
  
  const [ scraps, scrapsSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('scrapItems', (error, reply)=> {
      error && console.log(error);
      scrapsSet( reply );
    });
  }, []);
    
  if(!scraps) {
    return(
      <CalcSpin />
    );
  }
  
  const sortList = scraps.sort((s1, s2)=> {
                    if (s1.scEntry.time < s2.scEntry.time) { return -1 }
                    if (s1.scEntry.time > s2.scEntry.time) { return 1 }
                    return 0;
                  });
                  
  const rankList = _.countBy(sortList, x => x.group);
  const max = _.max(rankList);
  const most = Object.entries(rankList)
                .map( x => x[1] === max && x[0])
                  .filter( x => x !== false);
  const mostClean = most.length > 1 ? most.join(' & ') : most[0];
  
  const thisYear = scraps.filter( x => moment(x.scEntry.time).isSame(new Date(), 'year'));
  const rankListY = _.countBy(thisYear, x => x.group);
  const maxY = _.max(rankListY);
  const mostY = Object.entries(rankList)
                .map( x => x[1] === max && x[0])
                  .filter( x => x !== false);
  const mostCleanY = most.length > 1 ? most.join(' & ') : most[0];
                      
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        
        <div className='vbreak comfort'>
          
          <div className='medBig maxW30'>
            <StatLine
              num={mostClean}
              name={`${most.length > 1 ? 'have' : 'has'} the most of all time with `}
              postNum={max}
              postText={most.length > 1 ? Pref.scraps +' each' : Pref.scraps}
              color='redT up'
              big={true} />
            
            <StatLine
              num={mostCleanY}
              name={`${mostY.length > 1 ? 'have' : 'has'} the most this year with `}
              postNum={maxY}
              postText={mostY.length > 1 ? Pref.scraps +' each' : Pref.scraps}
              color='redT up'
              big={true} />
          </div>
          
          <div className='centreRow middle'>
            
            <TrendLine 
              title={`${Pref.scrap} items over last 12 months`}
              statType='scrapItem'
              cycleCount={12}
              cycleBracket='month'
              lineColor='rgb(231, 76, 60)' />
          
            <NumStatRing
              total={scraps.length}
              nums={[ scraps.length, 0 ]}
              name='Total'
              title={`Total ${Pref.scrap} items\nof all time`}
              colour='redBi'
              maxSize='chart15Contain'
            />
          </div>
        </div>
        
        <ScrapTableAll scrapData={sortList} />
      
      </div>
    </div>
  );
};

export default ScrapPanel;