import { Meteor } from 'meteor/meteor';

let instance = null;

class Config {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    this.clientTZ = "America/Regina"; // correct all server time to local timezone
    
    this.allowedSupers = 2; // max users that may hold a 'super' role
    
    this.maxShift = 10; // max number of consecutive hours 
    this.dropShipBffr = 5; // number of hours late is allowed
                          // compensating for out of hours hand delivery
    
    this.seriesLimit = 5000; // max items in a series
    this.unitLimit = 1000; // max units per item
    
    this.regexSN = RegExp(/^(\d{8,10})$|^(\d{6}\-\d{7})$/);
    this.regex810 = RegExp(/^(\d{8,10})$/);
    this.regexNS = RegExp(/^(\d{6}\-\d{7})$/);
    
    this.workingHours = {
      0: null,
      1: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      2: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      3: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      4: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
    };
    
    // treated as a ship deadline
    this.shippingHours = {
      0: null,
      1: null,
      2: ['11:30:00', '13:30:00'],
      3: null,
      4: ['11:30:00', '17:00:00'],
      5: null,
      6: null
    };
    
  }
}

export default (new Config);