// import { Meteor } from 'meteor/meteor';

//// Preferences singleton class \\\\

let instance = null;

class Pref {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    this.InitialAppSetup = false;
    
    this.neptuneVersion = '3.1.3';
    this.neptuneIs = 'Neptune Process Tracking';

    this.prefName = 'default';
    
    // Roles
    this.auths = [
      'debug',
      'readOnly',
      'nightly',
      'peopleSuper',
      'qa',
      'remove',
      'create',
      'edit',
      'run',
      'finish',
      'test',
      'verify', // keep
      'inspect', // keep
      'active'
    ];
    this.areas = [
      'sales',
      'kitting'
    ];
    
    // config
    this.userTimePublic = true;
    this.groupMax = 128;
    this.aliasMax = 16;
    this.downDayMax = 24;
    this.pagingSize = 25;
    
    // app navigation
    this.post = 'record';
    this.close = 'CLOSE';
    this.office = 'office';
    this.floor = 'floor';
    this.instruct = 'instructions';
    this.docs = 'Pisces';
    this.helpDocs = 'help';
    this.timeClock = 'Fishbowl';
    this.user = 'employees';
    this.usrCut = RegExp(/\.|\-|\_/g);
    // terminology
    this.admin = 'org admin';
    
    this.regex5 = RegExp(/^(\d{5})$/);
    
    // simpleBatch and counters
    this.xBatch = 'work order';
    this.XBatch = 'Work Order';
    this.xBatchs = 'work orders';
    this.XBatchs = 'Work Orders';
    
	  this.batch = 'legacy work order';//order
	  this.Batch = 'legacy Work Order';//Order
	  this.batches = 'legacy work orders';
	  this.item = 'item';
	  this.Item = 'Item';
	  this.items = 'items';
	  
	  this.series = 'series';
	  this.itemSerial = 'serial';
	  this.serialIcon = 'qrcode';
	  this.regexSN = RegExp(/^(\d{8,10})$|^(\d{6}\-\d{7})$/);
	  this.regex810 = RegExp(/^(\d{8,10})$/);
    this.regexNS = RegExp(/^(\d{6}\-\d{7})$/);
    this.seriesLimit = 5000;
    this.unitLimit = 1000;
    
    this.rapidEx = 'extend';
    this.rapidExd = 'extended';
    this.rapidExs = 'extensions';
    
    this.group = 'customer';//customer
    this.Group = 'Customer';//Customer
    this.groups = 'customers';//customer
    this.widget = 'product';//product
    this.Widget = 'Product';//Product
    this.widgets = 'products';//product
    this.variant = 'variant';// variant, variation
    this.variants = 'variants';// variants, variations
    this.version = 'version';// version, revision
    this.live = 'live'; // live / active in context of a product
    this.notlive = 'not live';
    
    this.unit = 'unit';// how many in a panel/set
    this.panel = 'set of items';
    this.panelCode = 'set serial';
    this.inspect = 'inspect';
    this.test = 'tester';
    this.create = 'creator';
    this.salesOrder = 'sales order';
    this.SO = 'SO';
    this.start = 'start date';
    this.end = 'fulfill date';
    this.timeBudget = 'time budget';
    this.tag = 'tag';
    
    this.upstream = 'upstream';
    this.kit = 'kit';
    this.kitting = 'kitting';
    this.baseSerialPart = 'PCB';
    this.comp = 'part';
    this.release = 'release';
    this.released = 'released';
    
    this.downstream = 'downstream';
    this.ship = 'ship';
    // build tracking
    this.branch = 'branch';
    this.branches = 'branches';
    
    this.flow = 'process flow';
    this.buildFlow = 'main process flow';
    this.buildFlowAlt = 'alt process flow';
    
    this.fall = 'counters';
    this.counter = 'counter';
    this.count = 'tick';
    this.counts = 'ticks';
    
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
    this.fix = 'Repair';
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
    this.listCut = RegExp(/(\s*\,\s*|\,|\ +)/g);
    this.clusterMin = 3;
    // scrap
    this.scrap = 'scrap';
    this.Scrap = 'Scrap';
    this.scraps = 'scraps';
    this.scrapped = 'scrapped';
    // rma
    this.rma = 'legacy RMA';
    this.rmaProcess = 'legacy RMA process';
    // blocker tracking
    this.block = 'caution';
    this.solve = 'solution';
    // non tracked, ancillary processes
    this.ancillary = 'indirect';
    // shortage tracking
    this.shortfall = 'shortfall';
    this.shortfalls = 'shortfalls';
      // shortage states
      this.shortagePending = "part is missing, awaiting answer";
      this.doOmit = "finish and ship without part";
      this.doNotOmit = "stop, request part";
      this.shortageWaiting = "waiting for the part";
      this.notResolved = "part available";
      this.isResolved = "part is no longer missing";
    
    //global time
    this.tide = 'start-stop';
    this.engaged = 'active';
    this.engagedNot = 'not active';
    this.statisticalStartHour = 6; // 6am
    this.statisticalEndHour = 20; // 8pm
    //this.minWorkDayStartTime
    //this.maxWorkDayEndTime
    this.stepUndoWindow = 1000*30; // remember to match ".spinRe"
    this.timeAfterGrace = 48; // keep the tideControl unlocked for how many hours

  }
}

export default (new Pref);