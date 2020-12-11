import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { batchTideTime } from './tideGlobalMethods.js';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});


function countItemsWith(accessKey, rangeStart, rangeEnd, historyType) {
  
  let itemCount = 0;
  
  BatchDB.find({
    orgKey: accessKey, 
    items: { $elemMatch: { createdAt: {
      $lte: new Date(rangeEnd) 
    }}}
  }).forEach( gf => {
    const theseItems = gf.items.filter( x =>
      x.history.find( y =>
        moment(y.time).isBetween(rangeStart, rangeEnd) &&
        y.type === historyType && y.good === true )
    );
    itemCount = itemCount + theseItems.length;
  });
  return itemCount;
}

export const itemsWithPromise = (accessKey, rangeStart, rangeEnd, historyType)=> {
  return new Promise(function(resolve) {
    const fetch = countItemsWith(accessKey, rangeStart, rangeEnd, historyType);
    resolve(fetch);
  });
};


export const totalTideTimePromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve) {
    let totalCount = 0;
    const rSdate = new Date(rangeStart);
    const rEdate = new Date(rangeEnd);
    
    BatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: rEdate
      },
      tide: { $elemMatch: { startTime: {
        $gte: rSdate,
        $lte: rEdate
      }}}
    }).forEach( gf => {
      const windowedTide = gf.tide.filter( x =>
        moment(x.startTime).isBetween(rangeStart, rangeEnd)
      );
      const tcount = batchTideTime(windowedTide);
      totalCount += tcount;
    });
    XBatchDB.find({
      orgKey: accessKey,
      createdAt: { 
        $lte: rEdate
      },
      tide: { $elemMatch: { startTime: {
        $gte: rSdate,
        $lte: rEdate
      }}}
    }).forEach( gfx => {
      const windowedTide = gfx.tide.filter( x =>
        moment(x.startTime).isBetween(rangeStart, rangeEnd)
      );
      const tcount = batchTideTime(windowedTide);
      totalCount += tcount;
    });
    
    resolve(totalCount);
  });
};


Meteor.methods({

  topViewStats(u, g, w, b, a) {
    const usrC = u ? Meteor.users.find({orgKey: Meteor.user().orgKey}).fetch().length : 0;
    const grpC = g ? GroupDB.find({orgKey: Meteor.user().orgKey}).fetch().length : 0;
    const wdgtC = w ? WidgetDB.find({orgKey: Meteor.user().orgKey}).fetch().length : 0;
    const btch = b ? BatchDB.find({orgKey: Meteor.user().orgKey}).fetch() : [];
    const btchC = b ? btch.length : 0;
    const btchLv = a ? btch.filter( x => x.finishedAt === false ).length : 0;
    return {
      usrC, grpC, wdgtC, btchC, btchLv
    };
  },
  
  widgetTops(wID) {
    const variants = VariantDB.find({widgetId: wID}).fetch().length;
    const batches = BatchDB.find({orgKey: Meteor.user().orgKey, widgetId: wID}).fetch();
    const batchesX = XBatchDB.find({orgKey: Meteor.user().orgKey, widgetId: wID}).fetch();
    const batchInfo = Array.from(batches, x => { return { 
      items: x.items.length,
    }});
    const batchInfoX = Array.from(batchesX, x => { return { 
      quantity: x.quantity,
    }});
    return { batchInfo, batchInfoX, variants };
  },
  
  nonConSelfCount(nonConCol) {
    const nonConClean = nonConCol.filter( x => !x.trash );
    const typeObj = _.countBy(nonConClean, x => x.type);
    // const typeObjClean = _.omit(typeObj, (value, key, object)=> {
    //   return key == false;
    // });
    const itr = Object.entries(typeObj);
    const typeArr = Array.from(itr, (arr)=> { return {type: arr[0], count: arr[1]} } );
    return typeArr;
  },
  
  shortfallSelfCount(shortfallCol) {
    const pnums = _.uniq( Array.from(shortfallCol, x => x.partNum) );
    
    let pnCounts = [];
    for( let pn of pnums) {
      const shOf = shortfallCol.filter( s => s.partNum === pn );
      let shCount = 0;
      for(let sh of shOf) {
        shCount += sh.refs.length;
      }
      pnCounts.push({
        partNum: pn,
        count: shCount
      });
    }
    return pnCounts;
  },
  
  riverStepSelfCount(itemsCol) {
    const itemHistory = Array.from( itemsCol, x => 
              x.history.filter( y => 
                y.type !== 'first' && y.type !== 'scrap' && y.good === true) );
    
    const itemHkeys = Array.from( itemHistory, x => x.map( s => 
                                      `${s.key}<|>${s.step}<|>${s.type}` ) );
    
    const keysFlat = [].concat(...itemHkeys);
    const keyObj = _.countBy(keysFlat, x => x);
    const itr = Object.entries(keyObj);

    const keyArr = Array.from(itr, (a)=> ( {keystep: a[0], count: a[1]} ) );
    return keyArr;
  },
  
  waterfallSelfCount(waterfallCol) {
    let keyArr = [];
    for(let wf of waterfallCol) {
      const wfstep = `${wf.key}<|>${wf.gate}<|>${wf.type}`;
      const wfCount = wf.counts.length === 0 ? 0 :
                        Array.from(wf.counts, x => x.tick).reduce((x,y)=> x + y);
      keyArr.push({
        keystep: wfstep,
        count: wfCount
      });
    }
    return keyArr;
  }



});