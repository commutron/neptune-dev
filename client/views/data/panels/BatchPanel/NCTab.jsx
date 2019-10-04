import React from 'react';
// import moment from 'moment';
// import business from 'moment-business';
// import Pref from '/client/global/pref.js';

import NonConRate from '/client/components/charts/NonCon/NonConRate.jsx';
import { HasNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { NonConPer } from '/client/components/bigUi/NonConMiniTops.jsx';
import { MostNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { TodayNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftFxNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftInNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import NonConStatusPie from '/client/components/charts/NonCon/NonConStatusPie.jsx';
import TabsLite from '/client/components/bigUi/Tabs/TabsLite.jsx';
import NonConBubble from '/client/components/charts/NonCon/NonConBubble.jsx';
import NonConBar from '/client/components/charts/NonCon/NonConBar.jsx';
import NonConBarRefs from '/client/components/charts/NonCon/NonConBarRefs.jsx';

const NCTab = ({
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
  	  typeof x === 'string' ? x : 
  	  x.live === true && x.typeText
  	);
      
    return flatTypeList;
  };
  const ncOptions = ncTypesComboFlat();
  
  const nonConArray = b.nonCon || [];
  const nonConArrayClean = nonConArray.filter( x => !x.trash );

  return(
    <div className='oneTwoThreeContainer space'>
      <div className='oneThirdContent min300 centreSelf'>
        <div className='wide centreRow'>  
          <TodayNonCon noncons={b.nonCon} />
          <LeftFxNonCon noncons={b.nonCon} />
          <LeftInNonCon noncons={b.nonCon} />
        </div>
        
        <NonConStatusPie nonCons={nonConArrayClean} />
        
        <div className='wide centreRow'>
          <HasNonCon noncons={b.nonCon} items={b.items} />
          <NonConPer noncons={b.nonCon} items={b.items} />
          <MostNonCon noncons={b.nonCon} app={a} />
        </div>
      </div>
      <div className='twoThirdsContent'>
      
        <NonConRate 
          batches={[b.batch]}
          title='NonCon Rate'
          lineColor='rgb(231, 76, 60)' />
          
      </div>
      <div className='threeThirdsContent'>
        
        <TabsLite 
          tabs={ [ 
            <i className="fas fa-chart-bar fa-lg fa-fw"></i>,
            <i className="fas fa-braille fa-lg fa-fw"></i>,
            <i className="fas fa-chess-board fa-lg fa-fw"></i>,
          ] }
          names={[ 
            'type bars', 'type bubbles', 'referance bars' 
          ]}>
          
          <NonConBar
            ncOp={ncOptions}
            nonCons={nonConArrayClean}
            app={a} />
        
          <NonConBubble
            ncOp={ncOptions}
            nonCons={nonConArrayClean}
            app={a} />
        
          <NonConBarRefs
            ncOp={ncOptions}
            flow={riverFlow}
            flowAlt={riverAltFlow}
            nonCons={nonConArrayClean}
            app={a} />
         
        </TabsLite>
      </div>
    </div>
    
  );
};

export default NCTab;