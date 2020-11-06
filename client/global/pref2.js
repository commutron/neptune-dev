const Pref2 = JSON.stringify({
  InitialAppSetup : false,
    
  neptuneVersion : '2.8.0',
  neptuneIs : 'Neptune Process Tracking',

    prefName : 'default',
    
    // Roles
    auths : [
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
    ],
    areas : [
      'sales',
      'kitting'
    ],
    
    // config
    userTimePublic : true,
    aliasMax : 128,
    aliasMin : 16,
    
    // app navigation
    post : 'record',
    close : 'X',
    office : 'office',
    floor : 'floor',
    instruct : 'instructions',
    docs : 'Pisces',
    helpDocs : 'help',
    timeClock : 'Fishbowl',
    user : 'employees',
    // terminology
    admin : 'org admin',
	  batch : 'work order',//order
	  Batch : 'Work Order',//Order
	  batches : 'work orders',
	  btch : 'w', // batch shortcut
	  item : 'board',//board
	  Item : 'Board',//Board
	  items : 'boards',
	  itm : 'b', // item shortcut
	  itemSerial : 'barcode',
	  serialType : 'qrcode',
    group : 'customer',//customer
    Group : 'Customer',//Customer
    groups : 'customers',//customer
    grp : 'c', // group shortcut
    widget : 'product',//product
    Widget : 'Product',//Product
    widgets : 'products',//product
    wdgt : 'p', // widget shortcut
    variant : 'variant',// variant, variation
    variants : 'variants',// variants, variations
    version : 'version',// version, revision
    vrsn : 'v', // version shorcut
    live : 'live', // live / active in context of a product
    notlive : 'not live',
    npi : 'npi',
    npiFull : 'new product intro',
    unit : 'unit',// how many in a panel/set
    panel : 'set of tracked items',
    panelCode : 'panel serial',
    inspect : 'inspect',
    test : 'tester',
    create : 'creator',
    salesOrder : 'sales order',
    SO : 'SO',
    start : 'start date',
    end : 'fulfill date',
    timeBudget : 'time budget',
    tag : 'flag',
    
    upstream : 'upstream',
    kit : 'kit',
    kitting : 'kitting',
    baseSerialPart : 'PCB',
    comp : 'part',
    release : 'release',
    released : 'released',
    
    downstream : 'downstream',
    ship : 'ship',
    // build tracking
    branch : 'branch',
    branches : 'branches',
    
    phase : 'phase',
    phases : 'phases',
    
    flow : 'process flow',
    buildFlow : 'main process flow',
    buildFlowAlt : 'alt process flow',
    
    engaged : 'active',
    engagedNot : 'not active',
    buildStep : 'build process',
    trackFirst : 'first-off',
    trackLast :  'finish',
    isDone : 'complete',
    good : 'accept',
    ng : 'ng',
    builder : 'builder',
    inspector : 'inspection',
    autoI : 'aoi',
    method : 'method',
    proChange : 'process changes',
    outIssue : 'outstanding issues',
    gComm : 'general comments',
    nest : 'nest',
    stoneislocked : `locked. \n unable to proceed`,
    outOfFlow : 'out of flow',
    // bad tracking
    fixFlow : 'repair process',
    fixStep : 'repair step',
    nonCon : 'nonCon',
    nonCons : 'nonconformaces',
    nonConRef : 'reference',
    nonConType : 'defect',
    repair : 'repair',
    reject : 're-attempt repair',
    skip : 'skip',
    skipDescribe : 'Ship With Defect',
    snooze : 'snooze',
    snoozeDescribe : 'Resolve Later',
    // escaped nonCons
    "escape" : 'escaped',
    // scrap
    scrap : 'scrap',
    Scrap : 'Scrap',
    scraps : 'scraps',
    scrapped : 'scrapped',
    // rma
    rma : 'RMA',
    rmaProcess : 'RMA process',
    // blocker tracking
    block : 'alert',
    blck : 'a', // blocker shortcut
    solve : 'solve',
    // non tracked, ancillary processes
    ancillary : 'indirect',
    // shortage tracking
    omit : 'omit', // wide
    omitted : 'omitted',
    shortfall : 'shortfall', // narrow
    shortfalls : 'shortfalls',
    // shortage states
      shortagePending : "part is missing, awaiting answer",
      doOmit : "finish and ship without part",
      doNotOmit : "stop, request part",
      shortageWaiting : "waiting for the part",
      notResolved : "part available",
      isResolved : "part is no longer missing",
    // simpleBatch and counters
    xBatch : 'batch+',
    xBatchs : 'batches+',
    counter : 'counter',
    count : 'tick',
    counts : 'ticks',
    
    //global time
    tide : 'start-stop',
    statisticalStartHour : 6, // 6am
    statisticalEndHour : 20, // 8pm
    stepUndoWindow : 1000*30,
    timeAfterGrace : 48, // keep the tideControl unlocked for how many hours

  });

export default (JSON.parse(Pref2));
  