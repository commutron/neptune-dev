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

  return(
    <div className='vFrameContainer space'>
      <div className='avOneContent min300 centreSelf'>
        <div className='wide centreRow'>  
          <TodayNonCon noncons={b.nonCon} />
          <LeftFxNonCon noncons={b.nonCon} />
          <LeftInNonCon noncons={b.nonCon} />
        </div>
        
        <NonConStatusPie nonCons={b.nonCon} />
        
        <div className='wide centreRow'>
          <HasNonCon noncons={b.nonCon} items={b.items} />
          <NonConPer noncons={b.nonCon} items={b.items} />
          <MostNonCon noncons={b.nonCon} app={a} />
        </div>
      </div>
      <div className='avTwoContent'>
      
        <NonConRate 
          batches={[b.batch]}
          title='NonCon Rate'
          lineColor='rgb(231, 76, 60)' />
          
      </div>
      <div className='avThreeContent'>
      
        <NonConBar
          ncOp={ncOptions}
          flow={riverFlow}
          flowAlt={riverAltFlow}
          nonCons={b.nonCon}
          app={a} />
        
        <br />
        
        {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
          <NonConBubble
            ncOp={ncOptions}
            flow={riverFlow}
            flowAlt={riverAltFlow}
            nonCons={b.nonCon}
            app={a} />
        }
        
        <br />
        
        <NonConBarRefs
          ncOp={ncOptions}
          flow={riverFlow}
          flowAlt={riverAltFlow}
          nonCons={b.nonCon}
          app={a} />
          
      </div>
    </div>
    
  );
};

export default NCTab;