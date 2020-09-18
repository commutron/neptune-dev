// import moment from 'moment';
// import 'moment-business-time';

// import { checkTimeBudget } from './tideMethods.js';
// import { whatIsBatch, whatIsBatchX } from './searchOps.js';

// import Config from '/server/hardConfig.js';

// moment.updateLocale('en', {
//   workinghours: Config.workingHours,
//   shippinghours: Config.shippingHours
// });



function sortCC(accessKey) {
  const completeCache = CacheDB.findOne({ 
    orgKey: accessKey, 
    dataName:'completeBatch'
  }).dataSet;
  
  const groups = GroupDB.find({orgKey: Meteor.user().orgKey}).fetch();
  
  let gdur = [];
  for( let group of groups ) {
    const widgets = WidgetDB.find({
      orgKey: accessKey,
      groupId: group._id
    }).fetch();
    // console.log(widgets.length);
    
    let wdur = [];
    for( let widget of widgets ) {
      const compd = completeCache.filter( y => y.widgetID === widget._id);
      // console.log(completeCache.length);
      
      for( let c of compd ) {
        if(c.testTheTime) {
          wdur.push(c.testTheTime.gapBegin2Done);
        }
      }
    }
    
    gdur.push({
      group: group.alias,
      durrArray: wdur
    });
    
  }
  
  return gdur;

  





}





Meteor.methods({
  
  reportOnTurnAround() {
    const accessKey = Meteor.user().orgKey;
    const result = sortCC(accessKey);
    return result;
  }


});