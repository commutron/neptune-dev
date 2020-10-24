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
//import StepsProgress from '/client/components/bigUi/StepsProgress/StepsProgress.jsx';

const InfoTab = ({
  a, b, user, isDebug,
  done,
  //progCounts, riverTitle, riverAltTitle,
}) =>	{

  const nonWorkDays = a.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
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

  const cmplt = b.complete ? end.format("MMMM Do, YYYY h:mm A") : null;
  
  
  return(
    <div className='containerE space'>
      <div className='oneEcontent min200'>

        <div className='vmarginhalf centreText line2x'>
            
            { b.live &&
              <div className='centreRow balance'>
                <div className='statusBlock'>
                  <PrioritySquareData
                    batchID={b._id}
                    app={a}
                    dbDay={b.salesEnd}
                    isDebug={isDebug} />
                </div>
                <div className='statusBlock'>
                  <TideActivityData
                    batchID={b._id}
                    app={a} />
                </div>
              </div>
            }
            <BatchXStatus batchData={b} />
          
        </div>
          
        <fieldset className='noteCard'>
          <legend className='cap'>Sales</legend>
          
          <p className='cap'>{Pref.salesOrder}: {b.salesOrder || 'not available'}</p>
          
          <p>Time Budget: {qtHours} hours</p>
          
        </fieldset>
        
        <fieldset className='noteCard'>
          <legend>Time Range</legend>
          
          <p className='cap'>{Pref.start}: {moment(b.salesStart).format("MMMM Do, YYYY")}</p>
          
          <div className='cap'>{Pref.end}: {moment(b.salesEnd).format("MMMM Do, YYYY")}
            <AlterFulfill
              batchId={b._id}
              isX={true}
              end={b.salesEnd}
              app={a}
              lock={b.complete}
              isDebug={isDebug} />
          </div>
          
          {cmplt !== null ?
            <p>Finished: {cmplt}</p>
          :
            <p>Ship Date: {shipTime.format("MMMM Do, YYYY")}</p>
          }
          
          <p>{cmplt !== null ? 'Total Time:' : 'Elapsed:'} {timeElapseClean}</p>
          
          {cmplt !== null ? null : 
            <p>Time Remaining: 
              <i className={remainClean < 0 ? 'yellowT' : ''}> {remainClean}</i> workdays
            </p> }
        
        </fieldset>
        
        
        

      </div>
      
      <div className='twoEcontent'>
      
        <TagsModule
          action='xBatch'
          id={b._id}
          tags={b.tags}
          tagOps={a.tagOption} />
          
        <NoteLine 
          action='xBatch'
          id={b._id}
          entry={b.notes} />
        <BlockList id={b._id} data={b.blocks} xBatch={true} lock={done} expand={true} />
          
            
        
        
      </div>
              
      <div className='threeEcontent'>
        
        {!released &&
          <ReleaseAction 
            id={b._id} 
            rType='floorRelease'
            actionText='release'
            contextText='to the floor'
            isX={true} />
        }
        
      </div>
        
      

    </div>
  );
};

export default InfoTab;