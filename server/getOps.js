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
    Meteor.call('updateAvgTimeShare', privateKey);
    return true;
  },
  
  getAvgDayCache() {
    const accessKey = Meteor.user().orgKey;
    return {
      avgTime : smplresult('avgDayTime', accessKey),
      avgItem : smplresult('avgDayItemFin', accessKey),
      avgShar : smplresult('avgTimeShare', accessKey)
    };
  },
  
  getAvgDayFin() {
    return smplresult('avgDayItemFin', Meteor.user().orgKey);
  },
  
  updateAllWidgetAvg() {

    const widgets = WidgetDB.find({},{fields:{'_id':1}}).fetch();
    
    // async function runLoop(widgets) {
      for(let w of widgets) {
        Meteor.call('countMultiBatchTideToQuote', w._id);
        Meteor.call('oneWidgetTurnAround', w._id);
      }
      return true;
    // }
    // runLoop(widgets);
  }
  
  
});