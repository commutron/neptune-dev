
Meteor.methods({

  fetchWeekAvg(accessKey) {
    Meteor.call('fetchWeekAvgTime', accessKey);
    Meteor.call('fetchWeekAvgSerial', accessKey);
    return true;
  },
  
  getAvgDayCache() {
    const cachTim = CacheDB.findOne({orgKey: Meteor.user().orgKey, dataName: 'avgDayTime'});
    const timeTim = cachTim ? cachTim.dataNum : 0;
    const trndTim = cachTim ? cachTim.dataTrend : 'flat';
    
    const cachFin = CacheDB.findOne({orgKey: Meteor.user().orgKey, dataName: 'avgDayItemFin'});
    const timeFin = cachFin ? cachFin.dataNum : 0;
    const trndFin = cachFin ? cachFin.dataTrend : 'flat';
    
    return {
      avgTime : [ timeTim, trndTim ],
      avgItem : [ timeFin, trndFin ]
    };
  },
  
});