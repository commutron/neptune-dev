import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import { ReleaseNote } from '/client/components/bigUi/ReleasesModule.jsx';
import NoteLine from '/client/components/smallUi/NoteLine.jsx';
import BlockList from '/client/components/bigUi/BlockList.jsx';
import { AlterFulfill } from '/client/components/forms/BatchAlter.jsx';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['07:00:00', '16:30:00'],
      2: ['07:00:00', '16:30:00'],
      3: ['07:00:00', '16:30:00'],
      4: ['07:00:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
  },// including lunch breaks!
  shippinghours: { 0: null, 1: null,
    2: ['11:00:00', '11:30:00'], 3: null, 4: ['11:00:00', '11:30:00'],
  5: null, 6: null }
});

const GeneralChunk = ({
  a, b, 
  done, expand
}) =>	{
  
  const qtB = b.quoteTimeBudget && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  const qtHours = moment.duration(qtB, "minutes").asHours().toFixed(2, 10);
  
  const end = b.finishedAt !== false ? moment(b.finishedAt) : moment();
  const timeElapse = moment.duration(end.diff(b.start)).asWeeks().toFixed(1);
  const timeasweeks = timeElapse.split('.');
  const timeweeks = timeasweeks[0];
  const timedays = moment.duration(timeasweeks[1] * 0.1, 'weeks').asDays().toFixed(0);
  const elapseNice = timeweeks + ' week' + 
                      (timeweeks == 1 ? ', ' : 's, ') + 
                        timedays + ' day' +
                          (timedays == 1 ? '' : 's');
  const remain = business.weekDays( moment(), moment(b.end) );             
  const fnsh = b.finishedAt ? end.format("MMMM Do, YYYY h:mm A") : null;

  const endDay = moment(b.end);
  const shipTime = endDay.isShipDay() ? 
    endDay.nextShippingTime() : endDay.lastShippingTime();
        
  let released = b.floorRelease === undefined ? undefined : 
                  b.floorRelease === false ? false :
                  typeof b.floorRelease === 'object';
                    
  const itemsOrder = b.items.sort( (x,y)=> x.serial - y.serial);

  return(
    <div>

      <TagsModule
        id={b._id}
        tags={b.tags}
        vKey={false}
        tagOps={a.tagOption} />
      
      <fieldset className='noteCard'>
        <legend className='cap'>Sales</legend>
        
        <p className='cap'>{Pref.salesOrder}: {b.salesOrder || 'not available'}</p>
        
        <p>Time Budget: {qtHours} hours</p>
        
      </fieldset>
      
      <fieldset className='noteCard'>
        <legend>Time Range</legend>
        
        <p className='cap'>{Pref.start}: {moment(b.start).format("MMMM Do, YYYY")}</p>
        
        <div className='cap'>{Pref.end}: {moment(b.end).format("MMMM Do, YYYY")}
          <AlterFulfill
            batchId={b._id}
            end={b.end}
            app={a}
            lock={b.finishedAt !== false} />
        </div>
        
        {fnsh !== null ?
          <p>Finished: {fnsh}</p>
        :
          <p>Ship Date: {shipTime.format("MMMM Do, YYYY")}</p>
        }
        
        <p>{fnsh !== null ? 'Total Time:' : 'Elapsed:'} {elapseNice}</p>
        
        {fnsh !== null ? null : 
          <p>Time Remaining: 
            <i className={remain < 0 ? 'yellowT' : ''}> {remain}</i> weekdays
          </p> }
      
      </fieldset>
      
      {b.items.length > 0 &&
        <fieldset className='noteCard'>
          <legend>Serial Range</legend>
          <p className='numFont'>{itemsOrder[0].serial} - {itemsOrder[itemsOrder.length-1].serial}</p>
        </fieldset>}
      
      {released === undefined ? null :
        released === true &&
          <ReleaseNote id={b._id} release={b.floorRelease} />
      }
      
      <NoteLine entry={b.notes} id={b._id} widgetKey={false}  />
      <BlockList id={b._id} data={b.blocks} lock={done} expand={expand} />

    </div>
  );
};

export default GeneralChunk;