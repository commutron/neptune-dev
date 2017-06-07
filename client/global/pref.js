import { Meteor } from 'meteor/meteor';

//// Preferences singleton class \\\\

let instance = null;

class Pref {
  constructor() {
    if(!instance){
      instance = this;
    }

    this.prefName = 'default';
    // app navigation
    this.post = 'record';
    this.close = 'X';
    this.office = 'office';
    this.floor = 'floor';
    this.instruct = 'wiki';
    this.timeClock = 'time clock';
    // terminology
    this.admin = 'org admin';
	  this.batch = 'batch';//order
	  this.item = 'item';//board
    this.group = 'group';//customer
    this.widget = 'widget';//product
    this.version = 'version';// version, variation, rev
    this.live = 'live'; // live / active in context of a product
    this.unit = 'panel';// how many in a panel/set
    this.inspect = 'inspector';
    this.test = 'tester';
    this.create = 'creator';
    this.start = 'start';
    this.end = 'end goal';
    // build tracking
    this.flow = 'flow';
    this.buildFlow = 'river';
    this.buildFlowAlt = 'alt river';
    this.buildStep = 'stone';
    //this.trackProcess = 'route';// remove
    //this.trackStep = 'route step';// remove
    this.trackFirst = 'first-off';
    this.trackLast =  'pack';
    this.builder = 'operator';
    this.inspector = 'inspector';
    this.method = 'method';
    //this.material = 'material';
    this.partTool = 'part assembly'; // going away
    this.joinTool = 'soldering'; // going away
    //this.work = 'function';
    // bad tracking
    this.fixFlow = 'stream';
    this.fixStep = 'rock';
    this.nonCon = 'non conformance';
    this.nonConRef = 'designation';
    this.nonConType = 'type';
    this.nonConCat = 'category';
    this.skip = 'skip';
    // scrap
    this.scrap = 'scrap';
    // rma
    this.rma = 'rma';// ???
    this.rmaProcess = 'cascade'; // ???
    // missing tracking
    this.shortPart = 'part shortage';
    this.missingPart = 'part shortage';
    this.gotPart = 'received';
    this.subPart = 'substitute';
    
    // non tracked, ancillary processes
    this.ancillary = 'indirect';

  }
}

export default (new Pref);
