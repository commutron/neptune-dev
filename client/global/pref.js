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
    this.trackFirst = 'first-off';
    this.trackLast =  'pack';
    this.good = 'good';
    this.ng = 'ng';
    this.builder = 'operator';
    this.inspector = 'inspection';
    this.autoI = 'aoi';
    this.method = 'method';
    this.proChange = 'process changes';
    this.outIssue = 'Outstanding Issues';
    this.gComm = 'general comments';
    // bad tracking
    this.fixFlow = 'stream';
    this.fixStep = 'rock';
    this.nonCon = 'non conformance';
    this.nonConRef = 'designation';
    this.nonConType = 'type';
    this.nonConCat = 'category';
    this.skip = 'skip';
    // escaped nonCons
    this.escape = 'escaped';
    // scrap
    this.scrap = 'scrap';
    // rma
    this.rma = 'rma';// ???
    this.rmaProcess = 'cascade'; // ???
    // blocker tracking
    this.block = 'blocker';
    this.solve = 'solve';
    // non tracked, ancillary processes
    this.ancillary = 'indirect';

  }
}

export default (new Pref);
