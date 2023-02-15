//// Preferences singleton class \\\\

let instance = null;

class Pref {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    this.InitialAppSetup = false;
    
    this.neptuneVersion = '3.15.0';
    this.neptuneIs = 'Neptune Process Tracking';

    this.prefName = 'default';
    
    // Roles
    this.auths = [
      'debug',
      'readOnly',
      'nightly',
      'peopleSuper',
      'equipSuper',
      'qa',
      'remove',
      'create',
      'edit',
      'run',
      'test',
      'verify',
      'inspect',
      'active'
    ];
    this.areas = [
      'sales',
      'kitting',
      'multitask_time'
    ];
    
    // Config
    this.userTimePublic = true;
    this.allowedSupers = 2; // max people supers (also in hardConfig)
    this.blurOut = 5; // minutes in background before DDP disconnects
    this.tooManyMin = 600; // minutes, warning duration
    this.groupMax = 128;
    this.aliasMax = 16;
    this.interMax = 1; // Also in server hardConfig
    this.downDayMax = 24; // max ship days in downstream
    this.pagingSize = 25;
    this.idleMinutes = 0; // minus idle time from timeInDay calculation
    this.breakMin = 15; // fixed break minutes
    this.noiseUpdate = 15; // over-stream update interval
    this.noiseChill = 30; // over-stream update slower interval for read-only users
    this.statisticalStartHour = 6; // 6am
    this.statisticalEndHour = 20; // 8pm
    this.avgSpan = 1000; // Also in server hardConfig
    this.yrsSpan = 3; // Also in server hardConfig
    this.stepUndoWindow = 1000*30; // remember to match ".spinRe"
    this.completeGrace = 24; // allow complete undo for lower permission for how many hours
    this.timeAfterGrace = 48; // hours, keep the tideControl unlocked, Also in server hardConfig
    this.seriesLimit = 10000; // max items in a series, Also in server hardConfig
    this.unitLimit = 1000; // max units per item, Also in server hardConfig
    this.clusterMin = 2; // noncon sets
    
    this.regex5 = RegExp(/^(\d{5})$/); // batch number
    
    this.regexSN = RegExp(/^(\d{8,10})$|^(\d{6}\-\d{7})$/);
	  this.regex810 = RegExp(/^(\d{8,10})$/);
    this.regexNS = RegExp(/^(\d{6}\-\d{7})$/);
    
    this.usrCut = RegExp(/\.|\-|\_/g); // nice-ify usernames
    
    this.listCut = RegExp(/(\s*\,\s*|\,|\ +)/g); // cut up noncon refs
    
    // app navigation
    this.post = 'record';
    this.close = 'CLOSE';
    this.office = 'office';
    this.instruct = 'instructions';
    this.docs = 'Pisces';
    this.helpDocs = 'help';
    this.timeClock = 'Timeclock';
    this.user = 'employees';
    
    // terminology
    this.admin = 'org admin';
    this.norole = 'insufficient permissions';
    
    // simpleBatch and counters
    this.xBatch = 'work order';
    this.XBatch = 'Work Order';
    this.xBatchs = 'work orders';
    this.XBatchs = 'Work Orders';
    
	  this.item = 'item';
	  this.Item = 'Item';
	  this.items = 'items';
	  
	  this.series = 'series';
	  this.itemSerial = 'serial';
	  this.serialIcon = 'qrcode';
    
    this.rapidEx = 'extend';
    this.rapidExd = 'extended';
    this.rapidExn = 'extension';
    this.rapidExs = 'extensions';
    
    this.radioactive = 'nonconformace report';
    this.radio = 'ncr';
    this.hold = 'hold';
    this.isHold = 'on hold';
    
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
    this.hibernatate = 'archive';
    this.hibernatated = 'archived';
    
    this.unit = 'unit';// how many in a panel/set
    this.panel = 'set of items';
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
    this.baseSerialPart = 'Barcoding / PCB';
    this.comp = 'part';
    this.release = 'release';
    this.released = 'released';
    this.floor = 'production';
    
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
    this.consume = 'consumables';
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
    
    // scrap
    this.scrap = 'scrap';
    this.Scrap = 'Scrap';
    this.scraps = 'scraps';
    this.scrapped = 'scrapped';
    // blocker tracking
    this.block = 'caution';
    this.solve = 'solution';
    // non tracked, ancillary processes
    this.ancillary = 'indirect';
    // shortage tracking
    this.shortfall = 'shortage';
    this.shortfalls = 'shortages';
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
    this.engagedNot = 'idle';
    
    // PM
    this.maintain = 'maintenance';
    this.premaintain = 'preventive maintenance';
    this.fixmaintain = 'repair maintenance';
    this.equip = 'equipment';
    this.steward = 'assignee';
    this.eqhib = 'Disconnected';
    this.estop = 'breakdown';
    this.eqissue = 'issues';
    
    // Replies
    this.autoreply = [
      "👍 Yes", "👎 No", "👌 Okay",
      "💙 Thank You", "⏱ On My Way"
    ];
  }
}

export default (new Pref);