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
	  this.batch = 'work order';//order
	  this.item = 'board';//board
    this.group = 'customer';//customer
    this.widget = 'product';//product
    this.version = 'version';// version, variation, rev
    this.live = 'live'; // live / active in context of a product
    this.unit = 'panel units';// how many in a panel/set
    this.panel = 'set of tracked items';
    this.panelCode = 'panel serial';
    this.inspect = 'inspector';
    this.test = 'tester';
    this.create = 'creator';
    this.start = 'start';
    this.end = 'fulfillment';
    // build tracking
    this.flow = 'process flow';
    this.buildFlow = 'main progress flow';
    this.buildFlowAlt = 'alt process flow';
    this.buildStep = 'build process';
    this.trackFirst = 'first-off';
    this.trackLast =  'pack';
    this.good = 'accept';
    this.ng = 'ng';
    this.builder = 'builder';
    this.inspector = 'inspection';
    this.autoI = 'aoi';
    this.method = 'method';
    this.proChange = 'process changes';
    this.outIssue = 'outstanding issues';
    this.gComm = 'general comments';
    // bad tracking
    this.fixFlow = 'repair process';
    this.fixStep = 'repair step';
    this.nonCon = 'non conformance';
    this.nonConRef = 'referance';
    this.nonConType = 'defect';
    this.skip = 'skip';
    // escaped nonCons
    this.escape = 'escaped nonCons';
    // scrap
    this.scrap = 'scrap';
    // rma
    this.rma = 'return material action';// ???
    this.rmaProcess = 'rma process'; // ???
    // blocker tracking
    this.block = 'blocker';
    this.solve = 'solve';
    // non tracked, ancillary processes
    this.ancillary = 'indirect';

  }
}

export default (new Pref);
