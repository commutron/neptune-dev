import React from 'react';
// import moment from 'moment';
// import business from 'moment-business';
// import Pref from '/client/global/pref.js';

import NonConOverview from '/client/components/charts/NonConOverview.jsx';
import NonConRate from '/client/components/charts/NonConRate.jsx';
import { HasNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { NonConPer } from '/client/components/bigUi/NonConMiniTops.jsx';
import { MostNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { TodayNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftFxNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import { LeftInNonCon } from '/client/components/bigUi/NonConMiniTops.jsx';
import NonConPie from '/client/components/charts/NonConPie.jsx';
import NonConBubble from '/client/components/charts/NonConBubble.jsx';
import NonConScatter from '/client/components/charts/NonConScatter.jsx';
import NonConPolar from '/client/components/charts/NonConPolar.jsx';

const NCTab = ({
  a, b,
  riverFlow, riverAltFlow,
}) =>	{

  return(
    <div className='vFrameContainer space'>
      <div className='avOneContent min300 centreSelf'>
        <div className='wide centreRow'>
          <HasNonCon noncons={b.nonCon} items={b.items} />
          <NonConPer noncons={b.nonCon} items={b.items} />
          <MostNonCon noncons={b.nonCon} app={a} />
          <TodayNonCon noncons={b.nonCon} />
          <LeftFxNonCon noncons={b.nonCon} />
          <LeftInNonCon noncons={b.nonCon} />
        </div>
        <NonConPie nonCons={b.nonCon} />
      </div>
      <div className='avTwoContent'>
        <p className='wide centreText'>NonCon Rate</p>
        <NonConRate batches={[b.batch]} />
      </div>
      <div className='avThreeContent'>
        <NonConOverview
          ncOp={a.nonConOption}
          flow={riverFlow}
          flowAlt={riverAltFlow}
          nonCons={b.nonCon}
          app={a} />
          
        <p></p>
        
        {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
          <NonConBubble
            ncOp={a.nonConOption}
            flow={riverFlow}
            flowAlt={riverAltFlow}
            nonCons={b.nonCon}
            app={a} />
        }
        
        <br />
        
        {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
          <NonConScatter
            ncOp={a.nonConOption}
            flow={riverFlow}
            flowAlt={riverAltFlow}
            nonCons={b.nonCon}
            app={a} />
        }
        
        <br />
        
        {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
          <NonConPolar
            ncOp={a.nonConOption}
            flow={riverFlow}
            flowAlt={riverAltFlow}
            nonCons={b.nonCon}
            app={a} />
        }
      </div>
    </div>
    
  );
};

export default NCTab;