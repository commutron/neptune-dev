import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';

// import { checkTimeBudget } from './tideMethods.js';
// import { whatIsBatch, whatIsBatchX } from './searchOps.js';

import { avgOfArray } from '/server/calcOps';
import Config from '/server/hardConfig.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});

  
function toRelDiff(bSalesStart, bReleases) {
  
  const floorRelease = bReleases.find( x => x.type === 'floorRelease');
  const flrRelTime = floorRelease && floorRelease.time;
  
  const gapSale2Rel = !flrRelTime ? null :
    moment(flrRelTime).workingDiff(bSalesStart, 'days');

  return gapSale2Rel;
}

function toStrtDiff(bSalesStart, bTide) {

  const tideBegin = bTide && bTide.length > 0 ? bTide[0] : null;
  const beginTime = tideBegin ? tideBegin.startTime : null;
  
  const gapSale2Start = !beginTime ? null :
    moment(beginTime).workingDiff(bSalesStart, 'days');
  
  return gapSale2Start;
}

function toEndDiff(bSalesStart, bSalesEnd) {
  const gapSale2End = moment(bSalesEnd).workingDiff(bSalesStart, 'days');
  return gapSale2End;
}

function toCompDiff(bSalesStart, bComplete) {
  const gapSale2Complete = moment(bComplete).workingDiff(bSalesStart, 'days');
  return gapSale2Complete;
}

  
function sortCC(accessKey) {
  
  return new Promise(function(resolve) {
  
    const groups = GroupDB.find({ orgKey: accessKey }).fetch();
    let gdur = [];
    for( let group of groups ) {
      const widgets = WidgetDB.find({
        orgKey: accessKey,
        groupId: group._id
      }).fetch();
    
      let wdur = [];
      for( let widget of widgets ) {
        let relAvg = [];
        let stAvg = [];
        let endAvg = [];
        let compAvg = [];
                
        const compB = BatchDB.find({widgetId: widget._id, live: false});
        for( let b of compB ) {
          relAvg.push( toRelDiff(b.start, b.releases) );
          stAvg.push( toStrtDiff(b.start, b.tide) );
          endAvg.push( toEndDiff(b.start, b.end) );
          compAvg.push( toCompDiff(b.start, b.finishedAt) );
        }
        
        const compX = XBatchDB.find({widgetId: widget._id, completed: true}).fetch();
        for( let x of compX ) {
          relAvg.push( toRelDiff(x.salesStart, x.releases) );
          //stAvg.push( toStrtDiff(x.salesStart, x.tide) );
          endAvg.push( toEndDiff(x.salesStart, x.salesEnd) );
          compAvg.push( toCompDiff(x.salesStart, x.completedAt) );
        }
      
        const testTheTime = [
          widget.widget,
          avgOfArray( relAvg ),
          avgOfArray( stAvg ),
          avgOfArray( endAvg ),
          avgOfArray( compAvg )
        ];
        wdur.push(testTheTime);  
      }
      
      gdur.push({
        group: group.alias,
        durrArray: wdur
      });
    }
    resolve(gdur);
  });
}





Meteor.methods({
  
  reportOnTurnAround() {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    
    async function collect() {
      try {
        result = await sortCC(accessKey);
        const resultString = JSON.stringify(result);
        return resultString;
      }catch (err) {
        throw new Meteor.Error(err);
      }
    }
    
    return collect();
  }


});