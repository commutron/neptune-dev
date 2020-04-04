import { Meteor } from 'meteor/meteor';

//// Preferences singleton class \\\\

let instance = null;

class Config {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    this.allowedSupers = 2;
    
  }
}

export default (new Config);
