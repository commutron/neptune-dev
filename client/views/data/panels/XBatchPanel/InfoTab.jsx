import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import { min2hr, toCap } from '/client/utility/Convert.js';

import TagsModule, { HoldFlag } from '/client/components/bigUi/TagsModule';
import ModelInline from '/client/layouts/Models/ModelInline';

import ReleaseAction from '/client/components/bigUi/ReleasesModule';
import BlockForm from '/client/components/forms/BlockForm';
import BlockList from '/client/components/bigUi/BlockList';

import AlterFulfill from '/client/components/forms/Batch/AlterFulfill';

import PrioritySquareData from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import PerformanceData from '/client/components/smallUi/StatusBlocks/PerformanceStatus';
import TideActivityData from '/client/components/tide/TideActivity';
import BatchXStatus from '/client/components/forms/Batch/BatchXStatus';

import StepsProgressX from '/client/components/bigUi/StepsProgress/StepsProgressX';

const InfoTab = ({
  b, hasSeries, widgetData, radioactive, user, isDebug,
  released, done, allFlow, allFall, nowater,
  flowCounts, fallCounts, rapidsData, riverTitle, srange,
  app, brancheS
}) =>	{
  
  const end = !b.completed ? moment() : moment(b.completedAt);
  
  const endDay = moment(b.salesEnd);
  
  const shipDue =  b.finShipDue ? moment(b.finShipDue) :
                    endDay.isShipDay() ?
                      endDay.clone().endOf('day').lastShippingTime() :
                      endDay.clone().lastShippingTime();
  
  const ontime = !b.completed ? null : shipDue.isSameOrAfter(b.completedAt);
  
  const rOpen = rapidsData && rapidsData.some( r => r.live === true );
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  
  return(
    <div className='cardify oneTwoThreeContainer'>
      <span className='oneThirdContent'>
      
      <div className='centreText'>
        <h3 className='leftText'>Status</h3>      
        
        <div className='balance'>
          {b.live &&
            <div className='statusBlock'>
              <PrioritySquareData
                batchID={b._id}
                app={app}
                dbDay={b.salesEnd}
                isDone={done}
                isDebug={isDebug} />
            </div>
          }
          {!b.lock &&
            <div className='statusBlock'>
              <TideActivityData
                batchID={b._id}
                app={app} />
            </div>
          }
          <div className='statusBlock'>
            <PerformanceData batchID={b._id} />
          </div>
        </div>
        
        <div className='cap middle'>
          <p>Ship Due: <b>{shipDue.format("MMMM Do, YYYY")}</b></p>
          <AlterFulfill
            batchId={b._id}
            createdAt={b.createdAt}
            end={b.salesEnd}
            app={app}
            lock={(b.completed === true && !isDebug ) || b.lock ? Pref.isDone : false}
            canDo={Roles.userIsInRole(Meteor.userId(), ['edit', 'sales'])}
            noText={true}
            lgIcon={true}
            isDebug={isDebug} />
        </div>
        
        {ontime === null ? null :
          <div className='centreText'><em>Shipped {ontime ? 'On Time' : 'Late'}</em></div>}
        
        
        {!b.completed && !released ?
        <ModelInline 
          title={Pref.release} 
          color='green' 
          border='borderGreen'
          icon='fa-solid fa-flag'
        >
          <ReleaseAction 
            id={b._id} 
            rType='floorRelease'
            actionText={Pref.release}
            contextText={`to ${Pref.floor}`}
          />
        </ModelInline>
        :null}
        
        <BatchXStatus 
          batchData={b} 
          allFlow={allFlow}
          allFall={allFall}
          nowater={nowater}
          rapid={rOpen}
        />
      </div>
      
      <div className='minHeight cap'>
        <TagsModule
          action={Pref.xBatch}
          id={b._id}
          tags={b.tags}
          hold={b.hold}
          tagOps={app.tagOption}
          canRun={canRun}
        />
        
        {radioactive &&
          <div 
            className='centreRow medBig max250 vmarginhalf' 
            title={`${toCap(Pref.widget)} ${Pref.radio.toUpperCase()}`}
          >
            <n-faX><i className='fas fa-burst fa-fw fa-lg darkOrangeT'></i></n-faX>
            <i>{radioactive}</i>
          </div>
        }
        
        {b.hold &&
          <HoldFlag
            id={b._id}
            canRun={canRun}
          />
        }
      </div>
        
      <SalesSegment 
        b={b}
        flowCounts={flowCounts}
        srange={srange}
        end={end}
        shipDue={shipDue} />
    
    </span>
    
    <span className='twoThirdsContent rowWrap w100 minHeight'>
      
        <div className='flxGrow'>
          <StepsProgressX
            b={b}
            widgetData={widgetData}
            hasSeries={hasSeries}
            flowCounts={flowCounts}
            fallCounts={fallCounts}
            rapidsData={rapidsData}
            riverTitle={riverTitle}
            brancheS={brancheS}
            truncate={false}
            canRun={canRun} />
        </div>
            
        <div className='flxGrow startSelf'>
          <h3>Notes</h3>
          
          <BlockForm
            id={b._id}
            edit={false}
            doneLock={b.lock}
            noText={true}
            lgIcon={true}
            canRun={canRun} />
            
          <BlockList 
            id={b._id} 
            data={b.blocks} 
            doneLock={b.lock} 
            truncate={false}
            canRun={canRun} />
        </div>
     
    </span>

    </div>
  );
};

export default InfoTab;

const SalesSegment = ({ b, srange, flowCounts, end, shipDue })=> {
  
  const qtB = b.quoteTimeBudget && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  const qtHours = min2hr(qtB);
  
  const timeElapse = end.workingDiff(b.salesStart, 'days', true);
  const timeElapseClean = timeElapse > -1 && timeElapse < 1 ? 
          timeElapse.toPrecision(1) : Math.round(timeElapse);
  
  const remain = shipDue.workingDiff(moment(), 'days', true);
  const remainClean = remain > -1 && remain < 1 ? 
          remain.toPrecision(1) : Math.round(remain);

  const cmplt = b.completed ? end.format("MMMM Do, YYYY h:mm A") : null;       
  
  return(
    <div className='readlines'>
      <h3>Sales Order</h3>
      
      <p className='cap'>{Pref.salesOrder}: <n-num>{b.salesOrder || 'not available'}</n-num></p>
      
      <p>Total Batch Quantity: <n-num>{b.quantity}</n-num></p>
      
      <p>Serialized Items: <n-num>{flowCounts.liveItems}</n-num></p>
      
      {flowCounts.liveUnits > 0 ?
        <p>Serialized Units: <n-num>{flowCounts.liveUnits}</n-num></p>
      : null}
      
      {srange && <p>Serial Range: <n-num>{srange}</n-num></p>}
      
      <p>Scrapped Items: <n-num className='redT'>{flowCounts.scrapCount || 0}</n-num></p>
      
      <p>Time Budget: <n-num>{qtHours} hours</n-num></p>
      
      <p className='cap'>{Pref.start}: <n-num>{moment(b.salesStart).format("MMMM Do, YYYY")}</n-num></p>
      
      <p className='cap'>{Pref.end}: <n-num>{moment(b.salesEnd).format("MMMM Do, YYYY")}</n-num></p>
          
      <p>{cmplt !== null ? 'Total Time:' : 'Elapsed:'} <n-num>{timeElapseClean} workdays</n-num></p>
      
      {cmplt !== null && <p>Complete: <n-num>{cmplt}</n-num></p> }
      
      {cmplt !== null ? null : 
        <p>Ship Due in: 
          <n-num className={remainClean < 0 ? 'yellowT' : ''}> {remainClean} workdays</n-num>
        </p> }
  
    </div>
  );
};