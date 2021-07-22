const smplresult = (name, accessKey)=> {
  const cache = CacheDB.findOne({ orgKey: accessKey, dataName: name });
  const numbr = cache ? cache.dataNum : 0;
  const trend = cache ? cache.dataTrend : 'flat';
  return [ numbr, trend ];
};
    
Meteor.methods({

  fetchWeekAvg(accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;

    Meteor.call('fetchWeekAvgTime', privateKey);
    Meteor.call('fetchWeekAvgSerial', privateKey);
    return true;
  },
  
  // getAvgDayCache() {
  //   const accessKey = Meteor.user().orgKey;
  //   return {
  //     avgTime : smplresult('avgDayTime', accessKey),
  //     avgItem : smplresult('avgDayItemFin', accessKey),
  //   };
  // },
  
  getAvgDayFin() {
    return smplresult('avgDayItemFin', Meteor.user().orgKey);
  },
  
  updateAllWidgetAvg(accessKey) {

    const widgets = WidgetDB.find({},{fields:{'_id':1}}).fetch();

    for(let w of widgets) {
      Meteor.call('nonConBatchTrend', w._id);
      Meteor.call('countMultiBatchTideToQuote', w._id);
      Meteor.call('oneWidgetTurnAround', w._id, accessKey);
    }
    return true;
  }
  
  
});