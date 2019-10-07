import { Meteor } from 'meteor/meteor';

//// Preferences singleton class \\\\

let instance = null;

class Pref {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    this.InitialAppSetup = false;
    
    this.neptuneVersion = '1.22.1';
    this.neptuneIs = 'Neptune Process Tracking';

    this.prefName = 'default';
    
    this.roles = [
      'debug',
      'readOnly',
      'nightly',
      'peopleSuper',
      'sales',
      'qa',
      'remove',
      'create',
      'edit',
      'run',
      'finish',
      'test',
      'verify',
      'inspect',
      'active'
    ];
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
	  this.Batch = 'Work Order';//Order
	  this.batches = 'work orders';
	  this.btch = 'w'; // batch shortcut
	  this.item = 'board';//board
	  this.Item = 'Board';//Board
	  this.items = 'boards';
	  this.itm = 'b'; // item shortcut
	  this.itemSerial = 'barcode';
	  this.serialType = 'qrcode';
    this.group = 'customer';//customer
    this.Group = 'Customer';//Customer
    this.groups = 'customers';//customer
    this.grp = 'c'; // group shortcut
    this.widget = 'product';//product
    this.Widget = 'Product';//Product
    this.widgets = 'products';//product
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
    this.salesOrder = 'sales order';
    this.start = 'start date';
    this.end = 'fulfill date';
    this.timeBudget = 'time budget';
    this.tag = 'flag';
    this.comp = 'part';
    this.kit = 'kit';
    this.release = 'release';
    this.ship = 'ship';
    // build tracking
    this.flow = 'process flow';
    this.buildFlow = 'main process flow';
    this.buildFlowAlt = 'alt process flow';
    this.phase = 'department';
    this.phases = 'departments';
    this.engaged = 'engaged';
    this.engagedNot = 'dormant';
    this.buildStep = 'build process';
    this.trackFirst = 'first-off';
    this.trackLast =  'finish';
    this.isDone = 'complete';
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
    this.stoneislocked = 'locked. \n unable to proceed';
    this.outOfFlow = 'out of flow';
    // bad tracking
    this.fixFlow = 'repair process';
    this.fixStep = 'repair step';
    this.nonCon = 'nonCon';
    this.nonCons = 'nonconformaces';
    this.nonConRef = 'reference';
    this.nonConType = 'defect';
    this.repair = 'repair';
    this.reject = 're-attempt repair';
    this.skip = 'skip';
    this.skipDescribe = 'Ship With Defect';
    this.snooze = 'snooze';
    this.snoozeDescribe = 'Resolve Later';
    // escaped nonCons
    this.escape = 'escaped';
    // scrap
    this.scrap = 'scrap';
    this.Scrap = 'Scrap';
    this.scraps = 'scraps';
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
    // shortage tracking
    this.omit = 'omit'; // wide
    this.omitted = 'omitted';
    this.shortfall = 'shortfall'; // narrow
    this.shortfalls = 'shortfalls';
      // shortage states
      this.shortagePending = "part is missing, awaiting answer";
      this.doOmit = "finish and ship without part";
      this.doNotOmit = "stop, request part";
      this.shortageWaiting = "waiting for the part";
      this.notResolved = "part available";
      this.isResolved = "part is no longer missing";
    // simpleBatch and counters
    this.xBatch = 'batch+';
    this.xBatchs = 'batches+';
    this.counter = 'counter';
    this.count = 'tick';
    this.counts = 'ticks';
    
    //global time
    this.statisticalStartHour = 6; // 6am
    this.statisticalEndHour = 20; // 8pm
    //this.minWorkDayStartTime
    //this.maxWorkDayEndTime
  }
}

export default (new Pref);
