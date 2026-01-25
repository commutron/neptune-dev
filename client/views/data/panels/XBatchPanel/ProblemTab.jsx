import React from 'react';
import Pref from '/client/global/pref.js';

import NonConRate from '/client/components/charts/NonCon/NonConRate';
import { 
  TotalNonCon,
  HasNonCon, 
  NonConPer, 
  IsResNonCon, 
  IsSkipNonCon, 
  LeftFxNonCon, 
  ReadyInNonCon, 
  LeftInNonCon
} from '/client/components/bigUi/NonConMiniTops';
import { 
  TotalShortfall,
  HasShortfall,
  RefCount,
  PartsShort,
  // LeftToResolve,
  ShortDec, ShortPass, ShortWait, ShortRes
} from '/client/components/bigUi/ShortfallMiniTops';
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
  const nonConArrayClean = nonConArray.filter( n => !n.trash && !(n.inspect && !n.fix) );
  
  return(
    <div className='space'>
      <div className='balance gapsC'>
        <div className='vmarginhalf centreSelf centreText'>
          <p className='small cap'>{Pref.nonCons}</p>
          {seriesData ?
            <div className='gapsC balance'>
              <span>
                <TotalNonCon noncons={nonConArrayClean} />
                <HasNonCon noncons={nonConArrayClean} items={srsItems} />
                <NonConPer noncons={nonConArrayClean} items={srsItems} />
              </span>  
              <span>  
                <IsSkipNonCon noncons={nonConArrayClean} />
                <LeftFxNonCon noncons={nonConArrayClean} />
                <ReadyInNonCon noncons={nonConArrayClean} />
                <LeftInNonCon noncons={nonConArrayClean} />
                <IsResNonCon noncons={nonConArrayClean} />
              </span>
              
            </div>
          : <h4>Not Tracking {Pref.nonCons}</h4>}
        </div>
        
        <div className='vmarginhalf centreText'>
          <p className='small cap'>{Pref.shortfalls}</p>
          {seriesData ?
            <div className='gapsC balance'>  
              <span>
                <TotalShortfall shortfalls={srsShorts} />
                <HasShortfall shortfalls={srsShorts} items={srsItems} />
                <PartsShort shortfalls={srsShorts} />
                <RefCount shortfalls={srsShorts} />
                {/*<LeftToResolve shortfalls={srsShorts} />*/}
              </span>
              <span>
                <ShortDec shortfalls={srsShorts} />
                <ShortPass shortfalls={srsShorts} />
                <ShortWait shortfalls={srsShorts} />
                <ShortRes shortfalls={srsShorts} />
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