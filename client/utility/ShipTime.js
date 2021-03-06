import moment from 'moment';
import 'moment-business-time';

export const workingHours = {
  0: null,
  1: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
  2: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
  3: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
  4: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
  5: ['07:00:00', '12:00:00'],
  6: null
};

export const shippingHours = {
  0: null,
  1: null,
  2: ['11:30:00', '13:30:00'],
  3: null,
  4: ['11:30:00', '17:00:00'],
  5: null,
  6: null
};
    
moment.updateLocale('en', {
  workinghours: workingHours,
  shippinghours: shippingHours
});

// Use as import at top:
// import '/client/components/utilities/ShipTime.js';

// This is somwhat flawed 
// as it needs to be in sync with the server