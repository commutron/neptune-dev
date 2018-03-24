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
    this.instruct = 'instructions';
    this.docs = 'pisces';
    this.helpDocs = 'help';
    this.timeClock = 'time clock';
    this.user = 'employees';
    // terminology
    this.admin = 'org admin';
	  this.batch = 'work order';//order
	  this.btch = 'w'; // batch shortcut
	  this.item = 'board';//board
	  this.itm = 'b'; // item shortcut
	  this.itemSerial = 'barcode';
    this.group = 'customer';//customer
    this.grp = 'c'; // group shortcut
    this.widget = 'product';//product
    this.wdgt = 'p'; // widget shortcut
    this.version = 'version';// version, variation, rev
    this.vrsn = 'v'; // version shorcut
    this.live = 'live'; // live / active in context of a product
    this.unit = 'unit';// how many in a panel/set
    this.panel = 'set of tracked items';
    this.panelCode = 'panel serial';
    this.inspect = 'inspect';
    this.test = 'tester';
    this.create = 'creator';
    this.start = 'start';
    this.end = 'fulfill';
    this.tag = 'flag';
    this.comp = 'part';
    // build tracking
    this.flow = 'process flow';
    this.buildFlow = 'main process flow';
    this.buildFlowAlt = 'alt process flow';
    this.buildStep = 'build process';
    this.trackFirst = 'first-off';
    this.trackLast =  'finish';
    this.good = 'accept';
    this.ng = 'ng';
    this.builder = 'builder';
    this.inspector = 'inspection';
    this.autoI = 'aoi';
    this.method = 'method';
    this.proChange = 'process changes';
    this.outIssue = 'outstanding issues';
    this.gComm = 'general comments';
    this.nest = 'nest';
    // bad tracking
    this.fixFlow = 'repair process';
    this.fixStep = 'repair step';
    this.nonCon = 'nonCon';
    this.nonConRef = 'reference';
    this.nonConType = 'defect';
    this.repair = 'repair';
    this.reject = 'reject';
    this.skip = 'skip';
    this.skipDescribe = 'Ship With Defect';
    this.snooze = 'snooze';
    this.snoozeDescribe = 'Resolve Later';
    // escaped nonCons
    this.escape = 'escaped';
    // scrap
    this.scrap = 'scrap';
    this.scrp = 's'; // scrap shortcut
    // rma
    this.rma = 'RMA';
    this.rmaProcess = 'RMA process';
    // blocker tracking
    this.block = 'alert';
    this.blck = 'a'; // blocker shortcut
    this.solve = 'solve';
    // non tracked, ancillary processes
    this.ancillary = 'indirect';

  }
}

export default (new Pref);
