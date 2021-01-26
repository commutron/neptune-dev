import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert.js';

import TagsModule from '/client/components/bigUi/TagsModule.jsx';

import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';

import { AlterFulfill } from '/client/components/forms/Batch/BatchAlter.jsx';

import PrioritySquareData from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import TideActivityData from '/client/components/tide/TideActivity';
import BatchXStatus from '/client/components/forms/Batch/BatchXStatus.jsx';

//import BatchFinish from '/client/components/forms/Batch/BatchFinish.jsx';
import StepsProgressX from '/client/components/bigUi/StepsProgress/StepsProgressX';

const InfoTab = ({
  app, b, user, isDebug,
  done, flowCounts, fallCounts, riverTitle, brancheS
}) =>	{

  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', { holidays: nonWorkDays });
  }
  
  const released = b.releases.findIndex( x => x.type === 'floorRelease') >= 0;

  const qtB = b.quoteTimeBudget && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  const qtHours = min2hr(qtB);
  
  const end = !b.completed ? moment() : moment(b.completedAt);
  
  const timeElapse = end.workingDiff(b.salesStart, 'days', true);
  const timeElapseClean = timeElapse > -1 && timeElapse < 1 ? 
          timeElapse.toPrecision(1) : Math.round(timeElapse);

  const endDay = moment(b.salesEnd);
  const shipTime = endDay.isShipDay() ? 
    endDay.nextShippingTime() : endDay.lastShippingTime();
  
  const remain = shipTime.workingDiff(moment(), 'days', true);
  const remainClean = remain > -1 && remain < 1 ? 
          remain.toPrecision(1) : Math.round(remain);

  const cmplt = b.completed ? end.format("MMMM Do, YYYY h:mm A") : null;
  
  
  return(
    <div className='autoFlex space'>
      
      <div className='vmarginhalf centreText line2x'>
        <h3>Status</h3>      
        { b.live &&
          <div className='centreRow balance'>
            <div className='statusBlock'>
              <PrioritySquareData
                batchID={b._id}
                app={app}
                dbDay={b.salesEnd}
                isDone={done}
                isDebug={isDebug} />
            </div>
            <div className='statusBlock'>
              <TideActivityData
                batchID={b._id}
                app={app} />
            </div>
          </div>
        }
        <BatchXStatus batchData={b} />
        
        <div className='cap middle'>
          <p>Ship Due: <b>{shipTime.format("MMMM Do, YYYY")}</b></p>
          <AlterFulfill
            batchId={b._id}
            isX={true}
            end={b.salesEnd}
            app={app}
            lock={b.completed === true && !isDebug}
            noText={true}
            lgIcon={true}
            isDebug={isDebug} />
        </div>
      </div>
          
      <div>
        <h3>Sales Order</h3>
        
        <p className='cap'>{Pref.salesOrder}: <b>{b.salesOrder || 'not available'}</b></p>
        
        <p>Total Batch Quantity: <b className='numfont'>{b.quantity}</b></p>
        
        <p>Serialized Items: <b className='numfont'>{flowCounts.liveItems}</b></p>
        
        <p>Serialized Units: <b className='numfont'>{flowCounts.liveUnits}</b></p>
        
        <p>Scrapped Items: <b className='numfont redT'>{flowCounts.scrapCount || null}</b></p>
        
        <p>Time Budget: <b>{qtHours} hours</b></p>
        
        <p className='cap'>{Pref.start}: <b>{moment(b.salesStart).format("MMMM Do, YYYY")}</b></p>
        
        <p className='cap'>{Pref.end}: <b>{moment(b.salesEnd).format("MMMM Do, YYYY")}</b></p>
            
        <p>{cmplt !== null ? 'Total Time:' : 'Elapsed:'} <b>{timeElapseClean} workdays</b></p>
        
        {cmplt !== null && <p>Complete: <b>{cmplt}</b></p> }
        
        {cmplt !== null ? null : 
          <p>Time Remaining: 
            <b className={remainClean < 0 ? 'yellowT' : ''}> {remainClean} workdays</b>
          </p> }
  
      </div>
    
      <div>
        <h3>General</h3>
        
        <TagsModule
          action='xBatch'
          id={b._id}
          tags={b.tags}
          tagOps={app.tagOption} />
          
        <NoteLine 
          action='xBatch'
          id={b._id}
          entry={b.notes} />
  
        <BlockList 
          id={b._id} 
          data={b.blocks} 
          xBatch={true} 
          lock={done} 
          expand={true} />
        
      </div>
              
      <div>
        {!released &&
          <ReleaseAction 
            id={b._id} 
            rType='floorRelease'
            actionText='release'
            contextText='to the floor'
            isX={true} />
        }
      </div>
      
      <div>
        <StepsProgressX
          quantity={b.quantity}
          flowCounts={flowCounts}
          fallCounts={fallCounts}
          riverTitle={riverTitle}
          brancheS={brancheS}
          truncate={false} />
      </div>

    </div>
  );
};

export default InfoTab;