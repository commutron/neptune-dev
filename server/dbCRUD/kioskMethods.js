import moment from 'moment';
import timezone from 'moment-timezone';
import Config from '/server/hardConfig.js';


Meteor.methods({
 
	kallInfo(orb) {
    // console.log(orb);
    
    if(typeof orb === 'string' && Config.regexSN.test(orb) ) {
      return XSeriesDB.findOne({'items.serial': orb},{fields:{'_id':1}}) ? true : false;
    }else{
      return false;
    }
  },
  
    
});