
Meteor.methods({

  fetchWeekAvg(accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;

    Meteor.call('fetchWeekAvgTime', privateKey);
    Meteor.call('fetchWeekAvgSerial', privateKey);
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