import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';

// import { checkTimeBudget } from './tideMethods.js';
// import { whatIsBatch, whatIsBatchX } from './searchOps.js';

import Config from '/server/hardConfig.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

function distTime(widget, bReleases, bSalesStart, bSalesEnd, bComplete, bTide) {
  
  /*const localEnd = moment.tz(bSalesEnd, clientTZ);
  const shipDue = localEnd.isShipDay() ?
                    localEnd.clone().nextShippingTime().format() :
                    localEnd.clone().lastShippingTime().format();
  const didEnd = moment(bComplete).tz(clientTZ).format();
  const gapSale2Due = moment(shipDue).workingDiff(bSalesStart, 'minutes');*/

  const floorRelease = bReleases.find( x => x.type === 'floorRelease');
  const flrRelTime = floorRelease && floorRelease.time;
  
  const gapSale2Rel = !flrRelTime ? null :
    moment(flrRelTime).workingDiff(bSalesStart, 'minutes');


  const tideBegin = bTide && bTide.length > 0 ? bTide[0] : null;
  const beginTime = tideBegin ? tideBegin.startTime : null;
  
  const gapSale2Start = !beginTime ? null :
    moment(beginTime).workingDiff(bSalesStart, 'minutes');
  
  
  const gapSale2End = moment(bSalesEnd).workingDiff(bSalesStart, 'minutes');
  
  const gapSale2Complete = moment(bComplete).workingDiff(bSalesStart, 'minutes');
  
    /*
    const tideDone = bTide && bTide.length > 0 ? bTide[bTide.length-1] : null;
    const doneTime = tideDone ? tideDone.stopTime : null;
    
    const gapBegin2Done = beginTime && doneTime ?
                            moment(doneTime).workingDiff(beginTime, 'minutes')
                          : null;
    */
    /*
    const quoteTotal = !qtB || qtB.length === 0 ? null :
                          Math.round( qtB[0].timeAsMinutes );
    */                      
    const timeObj = [
      widget,
      moment.duration(gapSale2Rel, 'minutes').asDays(), 
      moment.duration(gapSale2Start, 'minutes').asDays(),
      moment.duration(gapSale2End, 'minutes').asDays(),
      moment.duration(gapSale2Complete, 'minutes').asDays()
    ];
    
    return timeObj;
  }


function sortCC(accessKey) {
  
  const groups = GroupDB.find(
    { orgKey: Meteor.user().orgKey },
    { sort: { group: 1 } }
  ).fetch();
  let gdur = [];
  for( let group of groups ) {
    const widgets = WidgetDB.find(
      {
        orgKey: accessKey,
        groupId: group._id
      },
      { sort: { widget: 1 } }
    ).fetch();
    
    let wdur = [];
    for( let widget of widgets ) {
      
      const compB = BatchDB.find({widgetId: widget._id, live: false});
      for( let b of compB ) {
        const testTheTime = distTime(
          widget.widget,
          b.releases, b.start, b.end, b.finishedAt, b.tide
        );
        wdur.push(testTheTime);
      }
      const compX = XBatchDB.find({widgetId: widget._id, completed: true}).fetch();
      for( let x of compX ) {
        const testTheTime = distTime(
          widget.widget,
          x.releases, x.salesStart, x.salesEnd, x.completedAt, []
        );
        wdur.push(testTheTime);
      }
      
    }
    
    gdur.push({
      group: group.alias,
      durrArray: wdur
    });
    
  }
  
  return gdur;
}





Meteor.methods({
  
  reportOnTurnAround() {
    const accessKey = Meteor.user().orgKey;
    const result = sortCC(accessKey);
    return JSON.stringify(result);
  }


});