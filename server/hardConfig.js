import { Meteor } from 'meteor/meteor';

//// Preferences singleton class \\\\

let instance = null;

class Config {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    this.clientTZ = "America/Regina";
    
    this.allowedSupers = 2;
    
    this.workingHours = {
      0: null,
      1: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      2: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      3: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      4: ['07:00:00', '11:45:00', '12:30:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
    };
    
    this.maxShift = 10;
    this.dropShipBffr = 5;
    
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
    
    this.regexSN = RegExp(/^(\d{8,10})$|^(\d{6}\-\d{7})$/);
    this.regex810 = RegExp(/^(\d{8,10})$/);
    this.regexNS = RegExp(/^(\d{6}\-\d{7})$/);
    
    this.seriesLimit = 5000;
    this.unitLimit = 1000;
  }
}

export default (new Config);
