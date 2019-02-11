import moment from 'moment';
import timezone from 'moment-timezone';

Meteor.methods({
  
  activeToday(clientTZ) {
    const now = moment().tz(clientTZ);
    const isNow = (t)=>{ return ( moment(t).isSame(now, 'day') ) };
    
    //const plainStart = now.clone().startOf(range);
    //const sRange = plainStart.format();
    
    //const plainEnd = now.clone().endOf(range);
    //const eRange = plainEnd.format();
    
    const b = BatchDB.find({orgKey: Meteor.user().orgKey}).fetch();
  }
 
 
 
 
 

  
  
  
});