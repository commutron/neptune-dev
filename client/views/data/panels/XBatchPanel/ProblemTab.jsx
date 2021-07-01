import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import NonConRate from '/client/components/charts/NonCon/NonConRate.jsx';
import { HasNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { NonConPer } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftFxNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftInNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import NonConStatusPie from '/client/components/charts/NonCon/NonConStatusPie.jsx';
import { HasShortfall } from '/client/components/bigUi/ShortfallMiniTops.jsx';
import { RefCount } from '/client/components/bigUi/ShortfallMiniTops.jsx';
import { PartsShort } from '/client/components/bigUi/ShortfallMiniTops.jsx';
import { LeftToResolve } from '/client/components/bigUi/ShortfallMiniTops.jsx';
import ShortfallStatusPie from '/client/components/charts/Blockers/ShortfallStatusPie.jsx';
import TabsLite from '/client/components/smallUi/Tabs/TabsLite.jsx';
import NonConBubble from '/client/components/charts/NonCon/NonConBubble.jsx';
import NonConBar from '/client/components/charts/NonCon/NonConBar.jsx';
import NonConBarRefs from '/client/components/charts/NonCon/NonConBarRefs.jsx';
import ShortScatter from '/client/components/charts/ShortScatter';

const ProblemTab = ({
  batch, seriesData,
  app, ncTypesCombo, brancheS,
  isDebug
})=>	{
  
  const srsItems = seriesData.items;
  const srsNonCon = seriesData.nonCon;
  const srsShorts = seriesData.shortfall;
  
  const flatTypeList = Array.from(ncTypesCombo, x => 
	  typeof x === 'string' ? x : x.typeText
	);
	
  const nonConArray = srsNonCon || [];
  const nonConArrayClean = nonConArray.filter( x => !x.trash );
  
  return(
    <div className='vFrameContainer space'>
      <div className='avOneContent centreSelf centreText'>
        <p className='small'>NonCons</p>
        {srsNonCon ?
          <div className='wide autoGrid topLine'>  
            <NonConStatusPie nonCons={nonConArrayClean} />
            <span>
              <HasNonCon noncons={srsNonCon} items={srsItems} />
              <NonConPer noncons={srsNonCon} items={srsItems} />
              <LeftFxNonCon noncons={srsNonCon} />
              <LeftInNonCon noncons={srsNonCon} />
            </span>
          </div>
        : <h4>Not Tracking {Pref.nonCons}</h4>}
      </div>
      
      
      <div className='avTwoContent centreText'>
        <p className='small'>Shortfalls</p>
        {srsShorts ?
          <div className='wide autoGrid topLine'>  
            <ShortfallStatusPie shortfalls={srsShorts} />
            <span>
              <HasShortfall shortfalls={srsShorts} items={srsItems} />
              <PartsShort shortfalls={srsShorts} />
              <RefCount shortfalls={srsShorts} />
              <LeftToResolve shortfalls={srsShorts} />
            </span>
          </div>
        : <h4>Not Tracking {Pref.shortfalls}</h4>}
      </div>
      
      <div className='avThreeContent vmargin'>
        {nonConArrayClean.length > 0 ?
          <TabsLite 
            tabs={ [ 
              <i className="fas fa-braille fa-lg fa-fw"></i>,
              <i className="fas fa-chart-bar fa-lg fa-fw"></i>,
              <i className="fas fa-chess-board fa-lg fa-fw"></i>,
              <i className="fas fa-chart-area fa-lg fa-fw"></i>,
              <i className="fas fa-th fa-lg fa-fw"></i>,
            ] }
            names={[ 
              'Type Bubbles', 
              'Type Bars', 
              'Referance Bars', 
              'Recorded Rate', 
              'Shortfall Scatter'
            ]}>
           
            <NonConBubble
              ncOp={flatTypeList}
              nonCons={nonConArrayClean}
              app={app}
              isDebug={isDebug} />
              
            <NonConBar
              ncOp={flatTypeList}
              nonCons={nonConArrayClean}
              app={app}
              isDebug={isDebug} />
          
            <NonConBarRefs
              ncOp={flatTypeList}
              nonCons={nonConArrayClean}
              app={app}
              isDebug={isDebug} />
           
            <NonConRate 
              batches={[batch]}
              title='NonCon Rate'
              lineColor='rgb(231, 76, 60)' />
            
            <ShortScatter
              shortfalls={srsShorts}
              app={app}
              isDebug={isDebug} />
          </TabsLite>
        :
          <div className='centreText fade'>
            <p className='cap'>no data to chart</p>
          </div>}
      </div>
    </div>
  );
};

export default ProblemTab;