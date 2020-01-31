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
  a, b,
  riverFlow, riverAltFlow,
  ncListKeys
}) =>	{
  
  const ncTypesComboFlat = ()=> {
    const asignedNCLists = a.nonConTypeLists.filter( 
      x => ncListKeys.find( y => y === x.key ) ? true : false );
    const ncTypesCombo = Array.from(asignedNCLists, x => x.typeList);
  	const ncTCF = [].concat(...ncTypesCombo,...a.nonConOption);
  	
  	const flatTypeList = Array.from(ncTCF, x => 
  	  typeof x === 'string' ? x : x.typeText
  	);
      
    return flatTypeList;
  };
  const ncOptions = ncTypesComboFlat();
  
  const nonConArray = b.nonCon || [];
  const nonConArrayClean = nonConArray.filter( x => !x.trash );

  return(
    <div className='vFrameContainer space'>
      <div className='avOneContent centreSelf'>
        <p className='centreText small'>NonCons</p>
        <div className='wide balance topLine'>  
          <HasNonCon noncons={b.nonCon} items={b.items} />
          <NonConPer noncons={b.nonCon} items={b.items} />
          <LeftFxNonCon noncons={b.nonCon} />
          <LeftInNonCon noncons={b.nonCon} />
          
          <NonConStatusPie nonCons={nonConArrayClean} />
        </div>
        
      </div>
      <div className='avTwoContent'>
        <p className='centreText small'>Shortfalls</p>
        <div className='wide balance topLine'>  
          <HasShortfall shortfalls={b.shortfall} items={b.items} />
          <PartsShort shortfalls={b.shortfall} />
          <RefCount shortfalls={b.shortfall} />
          <LeftToResolve shortfalls={b.shortfall} />
          
          <ShortfallStatusPie shortfalls={b.shortfall} />
        </div>
          
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
              ncOp={ncOptions}
              nonCons={nonConArrayClean}
              app={a} />
              
            <NonConBar
              ncOp={ncOptions}
              nonCons={nonConArrayClean}
              app={a} />
          
            <NonConBarRefs
              ncOp={ncOptions}
              flow={riverFlow}
              flowAlt={riverAltFlow}
              nonCons={nonConArrayClean}
              app={a} />
           
            <NonConRate 
              batches={[b.batch]}
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