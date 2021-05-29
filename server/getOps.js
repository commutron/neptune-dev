
Meteor.methods({

  fetchWeekAvg(accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;

    Meteor.call('fetchWeekAvgTime', privateKey);
    Meteor.call('fetchWeekAvgSerial', privateKey);
    Meteor.call('updateAvgTimeShare', privateKey);
    return true;
  },
  
  getAvgDayCache() {
    const smplresult = (name)=> {
      const cache = CacheDB.findOne({ orgKey: Meteor.user().orgKey, dataName: name });
      const numbr = cache ? cache.dataNum : 0;
      const trend = cache ? cache.dataTrend : 'flat';
      return [ numbr, trend ];
    };
    
    return {
      avgTime : smplresult('avgDayTime'),
      avgItem : smplresult('avgDayItemFin'),
      avgShar : smplresult('avgTimeShare')
    };
  },
  
});