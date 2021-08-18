import { Meteor } from 'meteor/meteor';

let instance = null;

class Config {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    this.clientTZ = "America/Regina"; // correct all server time to local timezone
    
    this.loginExpire = 0.54; // in days, auto logout after experation
    this. minUsernameChar = 4;
    this.allowedSupers = 2; // max users that may hold a 'super' role
    
    this.maxShift = 10; // max number of consecutive hours 
    this.shipSoon = 2.5; // days away from its ship day, when its priority gets a boost. 
    this.shipAhead = 0; // hours to buffer ahead of shipAim
    this.dropShipBffr = 5; // number of hours late is allowed
                          // compensating for out of hours hand delivery
    
    this.seriesLimit = 5000; // max items in a series
    this.unitLimit = 1000; // max units per item
    
    this.freche = 12; // in hours, time limit for refreshed on-demand caches
    this.avgSpan = 1000; // in days, how far back to count for statistics
    
    // Relationship between % of completed and % of tide time 
    // is expressed as a Quadratic Regression Equation
    this.qregA = 80.6898916;
    this.qregB = 0.26632669;
    this.qregC = -0.0007738926;
    
    this.regexSN = RegExp(/^(\d{8,10})$|^(\d{6}\-\d{7})$/);
    this.regex810 = RegExp(/^(\d{8,10})$/);
    this.regexNS = RegExp(/^(\d{6}\-\d{7})$/);
    this.regexEmail = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }
}

export default (new Config);