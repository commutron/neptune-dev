import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import Config from '/server/hardConfig.js';
import { batchTideTime } from './tideGlobalMethods.js';
import { countWaterfall, countMulti } from './utility';

moment.updateLocale('en', {
  workinghours: Config.workingHours,
  shippinghours: Config.shippingHours
});


function countItemsWith(accessKey, rangeStart, rangeEnd, historyType) {
  
  let itemCount = 0;
  
  XSeriesDB.find({
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

  widgetTops(wID) {
    const widget = WidgetDB.findOne({ _id: wID });
    const ncRate = widget.ncRate || null;
    const rate = ncRate ? ncRate.rate : 0;
    
    const variants = VariantDB.find({widgetId: wID}).fetch().length;
    
    const batchesX = XBatchDB.find({orgKey: Meteor.user().orgKey, widgetId: wID}).fetch();
    const batchInfoX = Array.from(batchesX, x => { return { 
      quantity: x.quantity,
    }});
    
    return [ variants, batchInfoX, rate ];
  },
  
  nonConSelfCount(nonConCol) {
    if(!Array.isArray(nonConCol)) {
      return [];
    }else{
      const nonConClean = nonConCol.filter( x => !x.trash );
      const types = _.uniq( Array.from(nonConClean, x => x.type) );
      
      let typeCounts = [];
      for( let t of types) {
        const ncCount = countMulti( nonConClean.filter( n => n.type === t ) );
        typeCounts.push({
          type: t,
          count: ncCount
        });
      }
      return typeCounts;
    }
  },
  
  shortfallSelfCount(shortfallCol) {
    if(!Array.isArray(shortfallCol)) {
      return [];
    }else{
      const pnums = _.uniq( Array.from(shortfallCol, x => x.partNum) );
      
      let pnCounts = [];
      for( let pn of pnums) {
        const shOf = shortfallCol.filter( s => s.partNum === pn );
        let shCount = 0;
        for(let sh of shOf) {
          shCount += ( sh.refs.length * (sh.multi || 1) );
        }
        pnCounts.push({
          partNum: pn,
          count: shCount
        });
      }
      return pnCounts;
    }
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
      const wfstep = `${wf.wfKey}<|>${wf.gate}<|>${wf.type}`;
      const wfCount = countWaterfall(wf.counts);
      
      keyArr.push({
        keystep: wfstep,
        count: wfCount
      });
    }
    return keyArr;
  }

});