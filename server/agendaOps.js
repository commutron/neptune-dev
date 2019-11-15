import moment from 'moment';
//import timezone from 'moment-timezone';
//import business from 'moment-business';
import 'moment-business-time-ship';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['07:00:00', '16:30:00'],
      2: ['07:00:00', '16:30:00'],
      3: ['07:00:00', '16:30:00'],
      4: ['07:00:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
  },// including lunch breaks!
  shippinghours: {
      0: null,
      1: null,
      2: ['11:30:00', '11:30:00'],
      3: null,
      4: ['11:30:00', '11:30:00'],
      5: null,
      6: null
  }
  
  // holidays: [
  //       '2015-05-04'
  //   ]
});


Meteor.methods({
  
  // const app = AppDB.findOne({orgKey: Meteor.user().orgKey});
  //   const nonWorkDays = app.nonWorkDays;
  //   if( Array.isArray(nonWorkDays) ) {  
  //     moment.updateLocale('en', {
  //       holidays: nonWorkDays
  //     });
  //   }
  
  
  
  

  
});