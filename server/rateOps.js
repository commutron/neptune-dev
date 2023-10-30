import moment from 'moment';
import timezone from 'moment-timezone';

import Config from '/server/hardConfig.js';

import { flattenHistory, countMulti, countWaterfall } from './utility';
import { percentOf } from './calcOps';

Meteor.methods({

    /////////////////////////////////////////////////////////
   // Layered History Rate ////////////////////////////////
  ////////////////////////////////////////////////////////
  layeredHistoryRate(batchId, seriesId, start, end, riverFlow) {
    this.unblock();
    const b = XBatchDB.findOne({_id: batchId},{fields:{'quantity':1,'waterfall':1}});
    const srs = XSeriesDB.findOne({_id: seriesId},{fields:{'items':1}});

    let now = moment().tz(Config.clientTZ);

    const endDay = end === true ? 
      moment(end).endOf('day').add(2, 'd') : 
      now.clone().endOf('day').add(1, 'd');
    const startDay = moment(start).tz(Config.clientTZ).startOf('day');
    const howManyDays = endDay.diff(startDay, 'day');
    
    function historyPings(history, totalItems, flowKey, day) {
      const pings = history.filter( 
                      y => y.key === flowKey && y.good === true &&
                       moment(y.time).isSameOrBefore(day)
                    ).length;
      const remain = percentOf( totalItems, ( totalItems - pings ) );
      return remain;
    }
    function fallPings(fall, totalQ, day) {
      const pings = fall.counts.filter( y => moment(y.time).isSameOrBefore(day) );
      const pingcount = countWaterfall(pings);
      if(fall.action === 'slider') {
        const remain = 100 - pingcount;
        return remain;
      }else{
        const remain = percentOf( totalQ, ( totalQ - pingcount ) );
        return remain;
      }
    }
    
    function loopDays(historyFlat, totalItems, startDay, howManyDays, flowKey, waterfall, totalQ) {
      let historyRemainOverTime = [];
      
      for(let i = 0; i < howManyDays; i++) {
        const day = startDay.clone().add(i, 'day');
        
        if(day.isWorkingDay()) {
          const historyRemain = historyPings(historyFlat, totalItems, flowKey, day);
          historyRemainOverTime.push({
            x: new Date( day.format() ),
            y: historyRemain,
          });

          if(historyRemain === 0) { break }
        }
      }
      return historyRemainOverTime;
    }
    function loopFallDays(waterfall, totalQ, startDay, howManyDays) {
      let fallRemainOverTime = [];
      
      for(let i = 0; i < howManyDays; i++) {
        const day = startDay.clone().add(i, 'day');
        
        if(day.isWorkingDay()) {
          const fallRemain = fallPings(waterfall, totalQ, day);
          fallRemainOverTime.push({
            x: new Date( day.format() ),
            y: fallRemain,
          });
          if(fallRemain === 0) { break }
        }
      }
      return fallRemainOverTime;
    }
    
    let burnSeries = [];
    
    if(srs) {
      const flowKeys = Array.from( 
              riverFlow.filter( x => x.type !== 'first'), x => x.key );
  
      const items = srs.items.filter( x => !x.scrapped );
      const totalItems = items.length;
    
      const historyFlat = flattenHistory(items);
      
      for(let flowKey of flowKeys) {
        const dayCounts = loopDays(historyFlat, totalItems, startDay, howManyDays, flowKey);
        burnSeries.push({
          name: flowKey,
          data: dayCounts
        });
      }
    }

    for(let fall of b.waterfall) {
      const dayCounts = loopFallDays(fall, b.quantity, startDay, howManyDays);
      burnSeries.push({
        name: fall.gate,
        data: dayCounts
      });
    }
      
    return burnSeries;
  },
  
   ///////////////////////////
  // nonCon Rate ////////////
  //////////////////////////
  nonConRateLoop(batches) {
    // loop for Batch "recorded rate" chart
    const allNC = Array.from( batches, x => {
      const bDT = XSeriesDB.findOne({batch: x},{fields:{'nonCon':1}});
      if(bDT) { return bDT.nonCon }            
    }).filter(f=>f);
    
    function oneRate(theseNC) {
      // ploting the ncs as flagged (not how they're resolved)
      function recordedNC(noncons, qDay) {
        let relevant = noncons.filter(
                        x => moment(x.time)
                          .isSameOrBefore(qDay, 'day') );
        let ncPack = {
          'x': new Date(qDay),
          'y': countMulti(relevant)
        };
        return ncPack;
      }
      
      const begin = moment(theseNC[0].time);
      const end = moment(theseNC[theseNC.length - 1].time);
      const range = end.diff(begin, 'day') + 2;
      
      let nonconSet = [];
      for(let i = 0; i < range; i++) {
        let qDay = begin.clone().add(i, 'day').format();
        
        let ncCount = recordedNC(theseNC, qDay);
        nonconSet.push(ncCount);
      }
      return nonconSet;
    }
    
    nonconCollection = [];
    for(let nc of allNC) {
      if(nc.length > 0) {
        let rateLoop = oneRate(nc);
        nonconCollection.push(rateLoop);
      }else{null}
    }
    
    return nonconCollection;
  },
  
  
});