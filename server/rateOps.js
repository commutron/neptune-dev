import moment from 'moment';
import timezone from 'moment-timezone';
// import 'moment-business-time';

import Config from '/server/hardConfig.js';

import { flattenHistory } from './utility';

Meteor.methods({

    /////////////////////////////////////////////////////////////////////////
   // Layered History Rate
  ////////////////////////////////////////////////////////////////////////////
  layeredHistoryRate(seriesId, start, end, riverFlow) {
    const srs = XSeriesDB.findOne({_id: seriesId});

    let now = moment().tz(Config.clientTZ);
    
    const endDay = end == true ? 
      moment(end).endOf('day').add(2, 'd') : 
      now.clone().endOf('day').add(1, 'd');
    const startDay = moment(start).tz(Config.clientTZ).endOf('day');
    const howManyDays = endDay.diff(startDay, 'day');
    
    function historyPings(history, totalItems, flowKey, day) {
      const pings = history.filter( 
                      y => y.key === flowKey && y.good === true &&
                       moment(y.time).isSameOrBefore(day)
                    ).length;
      const remain = totalItems - pings;
      return remain;
    }
    
    function loopDays(historyFlat, totalItems, startDay, howManyDays, flowKey) {
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
      
    if(srs) {
      const flowKeys = Array.from( 
                        riverFlow.filter( x => x.type !== 'first'), 
                          x => x.key );
  
      const items = srs.items.filter( x => !x.scrapped );

      const totalItems = items.length;
    
      const historyFlat = flattenHistory(items);
      
      let flowSeries = [];
      for(let flowKey of flowKeys) {
        const dayCounts = loopDays(historyFlat, totalItems, startDay, howManyDays, flowKey);
        flowSeries.push({
          name: flowKey,
          data: dayCounts
        });
      }
      
      return flowSeries;
    }else{
      return [];
    }
  },
  
  
   ///////////////////////////////////////////////////////////////////////////
  // nonCon Rate
  ////////////////////////////////////////////////////////////////////////////
  nonConRateLoop(batches) {

    const allNC = Array.from( batches, x => {
      const bDT = XSeriesDB.findOne({batch: x}) ||
                  BatchDB.findOne({batch: x});
      if(bDT) { return bDT.nonCon }            
    }).filter(f=>f);
    
    function oneRate(theseNC) {
      
      function recordedNC(noncons, qDay) {
        let relevant = noncons.filter(
                        x => moment(x.time)
                          .isSameOrBefore(qDay, 'day') );
        let ncPack = {
          'x': new Date(qDay),
          'y': relevant.length
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