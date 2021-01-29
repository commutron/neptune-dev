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
import TabsLite from '/client/components/bigUi/Tabs/TabsLite.jsx';
import NonConBubble from '/client/components/charts/NonCon/NonConBubble.jsx';
import NonConBar from '/client/components/charts/NonCon/NonConBar.jsx';
import NonConBarRefs from '/client/components/charts/NonCon/NonConBarRefs.jsx';

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
          <div className='wide balance topLine'>  
            <HasNonCon noncons={srsNonCon} items={srsItems} />
            <NonConPer noncons={srsNonCon} items={srsItems} />
            <LeftFxNonCon noncons={srsNonCon} />
            <LeftInNonCon noncons={srsNonCon} />
            
            <NonConStatusPie nonCons={nonConArrayClean} />
          </div>
        : <h4>Not Tracking {Pref.nonCons}</h4>}
      </div>
      
      
      <div className='avTwoContent centreText'>
        <p className='small'>Shortfalls</p>
        {srsShorts ?
          <div className='wide balance topLine'>  
            <HasShortfall shortfalls={srsShorts} items={srsItems} />
            <PartsShort shortfalls={srsShorts} />
            <RefCount shortfalls={srsShorts} />
            <LeftToResolve shortfalls={srsShorts} />
            
            <ShortfallStatusPie shortfalls={srsShorts} />
          </div>
        : <h4>Not Tracking {Pref.shortfalls}</h4>}
      </div>
      
      <div className='avThreeContent'>
        {nonConArrayClean.length > 0 ?
          <TabsLite 
            tabs={ [ 
              <i className="fas fa-braille fa-lg fa-fw"></i>,
              <i className="fas fa-chart-bar fa-lg fa-fw"></i>,
              <i className="fas fa-chess-board fa-lg fa-fw"></i>,
              <i className="fas fa-chart-area fa-lg fa-fw"></i>
            ] }
            names={[ 
              'type bubbles', 'type bars', 'referance bars', 'recorded rate'
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
            
          </TabsLite>
        :
          <div className='centreText fade'>
            <i className='fas fa-smile-beam fa-3x'></i>
            <p className='big cap'>no {Pref.nonCons}</p>
          </div>}
      </div>
    </div>
  );
};

export default ProblemTab;