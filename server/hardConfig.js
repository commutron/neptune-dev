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
    this.shipSoon = 2.5; // days away from its ship day, when its priority gets a boost. 
    this.dropShipBffr = 5; // number of hours late is allowed
                          // compensating for out of hours hand delivery
    
    this.seriesLimit = 5000; // max items in a series
    this.unitLimit = 1000; // max units per item
    
    this.avgSpan = 10000; // in days, how far back to count for statistic averages
    
    // Relationship between % of completed and % of tide time 
    // is expressed as a Quadratic Regression Equation
    this.qregA = 80.6898916;
    this.qregB = 0.26632669;
    this.qregC = -0.0007738926;
    
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