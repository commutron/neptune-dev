import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/uUi/Spin.jsx';
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
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
  
  const sortList = scraps.sort((s1, s2)=> {
                    if (s1.scEntry.time < s2.scEntry.time) { return 1 }
                    if (s1.scEntry.time > s2.scEntry.time) { return -1 }
                    return 0;
                  });
                  
  const rankList = _.countBy(scraps, x => x.group);
  const max = _.max(rankList);
  const most = Object.entries(rankList)
                .map( x => x[1] === max && x[0])
                  .filter( x => x !== false);
  const mostClean = most.length > 1 ? most.join(' & ') : most[0];
  
  const rankListW = _.countBy(scraps, x => x.widget);
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
              postText={most.length > 1 ? Pref.scraps +' each' : Pref.scraps}
              color='redT up'
              big={true} />
            
            <StatLine
              num={mostCleanW}
              name={`${mostW.length > 1 ? 'are' : 'is'} most with `}
              postNum={maxW}
              postText={mostW.length > 1 ? Pref.scraps +' each' : Pref.scraps}
              color='redT up'
              big={true} />
          </div>
          
          <div className='centreRow middle'>
            
            <TrendLine 
              title={`${Pref.scrapped} items over last 12 months`}
              statType='scrapItem'
              cycleCount={12}
              cycleBracket='month'
              lineColor='rgb(231, 76, 60)' />
          
            <NumStatRing
              total={scraps.length}
              nums={[ 0, scraps.length, 0 ]}
              name={`Total ${Pref.scrap} ${Pref.items}`}
              title={`Total ${Pref.scrap} ${Pref.items}\nof all time`}
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
              {Pref.items} collected are all {Pref.scrapped} {Pref.items} since records began;
              <em> unless</em> the {Pref.scrap} was canceled.
            </p>
            <p className='footnote'>
              Table is sorted by the time the {Pref.item} was {Pref.scrapped}.
            </p>
          </details>
        </div>
        
        <ScrapTableAll scrapData={sortList} />
      
      </div>
    </div>
  );
};

export default ScrapPanel;