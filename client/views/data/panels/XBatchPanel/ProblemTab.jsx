import React from 'react';
import Pref from '/client/global/pref.js';

import NonConRate from '/client/components/charts/NonCon/NonConRate';
import { HasNonCon } from '/client/components/bigUi/NonConMiniTops';
import { NonConPer } from '/client/components/bigUi/NonConMiniTops';
import { LeftFxNonCon } from '/client/components/bigUi/NonConMiniTops';
import { LeftInNonCon } from '/client/components/bigUi/NonConMiniTops';
import NonConStatusPie from '/client/components/charts/NonCon/NonConStatusPie';
import { HasShortfall } from '/client/components/bigUi/ShortfallMiniTops';
import { RefCount } from '/client/components/bigUi/ShortfallMiniTops';
import { PartsShort } from '/client/components/bigUi/ShortfallMiniTops';
import { LeftToResolve } from '/client/components/bigUi/ShortfallMiniTops';
import ShortfallStatusPie from '/client/components/charts/Blockers/ShortfallStatusPie';
import TabsLite from '/client/components/smallUi/Tabs/TabsLite';
import NonConBubble from '/client/components/charts/NonCon/NonConBubble';
import NonConBar from '/client/components/charts/NonCon/NonConBar';
import NonConBarRefs from '/client/components/charts/NonCon/NonConBarRefs';
import ShortScatter from '/client/components/charts/ShortScatter';

const ProblemTab = ({
  batch, seriesData,
  app, ncTypesCombo, brancheS,
  isDebug
})=>	{
  
  const srsItems = seriesData.items || [];
  const srsNonCon = seriesData.nonCon || [];
  const srsShorts = seriesData.shortfall || [];
  
  const flatTypeList = Array.from(ncTypesCombo, x => 
	  typeof x === 'string' ? x : x.typeText
	);
	
  const nonConArray = srsNonCon || [];
  const nonConArrayClean = nonConArray.filter( x => !x.trash );
  
  return(
    <div className='space'>
      <div className='balance'>
        <div className='vmarginhalf centreSelf centreText'>
          <p className='small cap'>{Pref.nonCons}</p>
          {seriesData ?
            <div className='gapsC rowWrap'>  
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
        
        
        <div className='vmarginhalf centreText'>
          <p className='small cap'>{Pref.shortfalls}</p>
          {seriesData ?
            <div className='gapsC rowWrap'>  
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
      </div>
      
      <div className='vmargin'>
      {nonConArrayClean.length > 0 || srsShorts.length > 0 ?
        <TabsLite 
          tabs={ [ 
            <i className="fas fa-braille fa-lg fa-fw"></i>,
            <i className="fas fa-chart-bar fa-lg fa-fw"></i>,
            <i className="fas fa-chess-board fa-lg fa-fw"></i>,
            <i className="fas fa-chart-line fa-lg fa-fw"></i>,
            <i className="fas fa-exclamation-triangle fa-fw"></i>,
          ] }
          names={[ 
            'Type Bubbles', 
            'Type Bars', 
            'Referance Bars', 
            'Recorded Rate', 
            Pref.shortfall + ' Scatter'
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