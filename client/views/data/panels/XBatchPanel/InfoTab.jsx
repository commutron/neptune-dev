import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert.js';

import TagsModule from '/client/components/bigUi/TagsModule.jsx';

import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockForm from '/client/components/forms/BlockForm.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';

import { AlterFulfill } from '/client/components/forms/Batch/BatchAlter.jsx';

import PrioritySquareData from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import TideActivityData from '/client/components/tide/TideActivity';
import BatchXStatus from '/client/components/forms/Batch/BatchXStatus.jsx';

//import BatchFinish from '/client/components/forms/Batch/BatchFinish.jsx';
import StepsProgressX from '/client/components/bigUi/StepsProgress/StepsProgressX';

const InfoTab = ({
  b, hasSeries, widgetData, user, isDebug,
  released, done, allFlow, allFall, nowater,
  flowCounts, fallCounts, riverTitle, srange,
  app, brancheS
}) =>	{

  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', { holidays: nonWorkDays });
  }
  
  const end = !b.completed ? moment() : moment(b.completedAt);
  
  const endDay = moment(b.salesEnd);
  const shipTime = endDay.isShipDay() ? 
    endDay.nextShippingTime() : endDay.lastShippingTime();
  
  const remain = shipTime.workingDiff(moment(), 'days', true);
  
  
  return(
    <div className='cardify oneTwoThreeContainer'>
      <span className='oneThirdContent'>
      
      <div className='centreText'>
        <h3 className='leftText'>Status</h3>      
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
        <BatchXStatus 
          batchData={b} 
          allFlow={allFlow}
          allFall={allFall}
          nowater={nowater} />
        
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
        
        {!b.completed && !released ?
          <ReleaseAction 
            id={b._id} 
            rType='floorRelease'
            actionText='release'
            contextText='to the floor'
            isX={true} />
        :null}  
      </div>
      
      <div className='minHeight cap'>
        <TagsModule
          action={Pref.xBatch}
          id={b._id}
          tags={b.tags}
          tagOps={app.tagOption} />
      </div>
        
        
      <SalesSegment 
        b={b}
        flowCounts={flowCounts}
        srange={srange}
        end={end}
        remain={remain} />
    
    </span>
    
    <span className='twoThirdsContent rowWrap w100 minHeight'>
      
        <div className='flxGrow'>
          <StepsProgressX
            b={b}
            widgetData={widgetData}
            hasSeries={hasSeries}
            flowCounts={flowCounts}
            fallCounts={fallCounts}
            riverTitle={riverTitle}
            brancheS={brancheS}
            truncate={false} />
        </div>
            
        <div className='flxGrow startSelf'>
          <h3>Notes</h3>
          
          <NoteLine 
            action={Pref.xBatch}
            id={b._id}
            entry={b.notes}
            plain={true}
            lgIcon={true} />
          
          <BlockForm
            id={b._id}
            edit={false}
            doneLock={b.completed}
            noText={true}
            lgIcon={true} />
            
          <BlockList 
            id={b._id} 
            data={b.blocks} 
            doneLock={done} 
            truncate={false} />
        </div>
     
    </span>

    </div>
  );
};

export default InfoTab;

const SalesSegment = ({ b, srange, flowCounts, end, remain })=> {
  
  const qtB = b.quoteTimeBudget && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  const qtHours = min2hr(qtB);
  
  const timeElapse = end.workingDiff(b.salesStart, 'days', true);
  const timeElapseClean = timeElapse > -1 && timeElapse < 1 ? 
          timeElapse.toPrecision(1) : Math.round(timeElapse);
  
  const remainClean = remain > -1 && remain < 1 ? 
          remain.toPrecision(1) : Math.round(remain);

  const cmplt = b.completed ? end.format("MMMM Do, YYYY h:mm A") : null;       
  
  return(
    <div>
      <h3>Sales Order</h3>
      
      <p className='cap'>{Pref.salesOrder}: <b>{b.salesOrder || 'not available'}</b></p>
      
      <p>Total Batch Quantity: <b className='numfont'>{b.quantity}</b></p>
      
      <p>Serialized Items: <b className='numfont'>{flowCounts.liveItems}</b></p>
      
      {flowCounts.liveUnits > 0 ?
        <p>Serialized Units: <b className='numfont'>{flowCounts.liveUnits}</b></p>
      : null}
      
      {srange && <p>Serial Range: <b className='numFont'>{srange}</b></p>}
      
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
  );
};