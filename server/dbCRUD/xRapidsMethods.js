import moment from 'moment';


Meteor.methods({
  
  createExRapidBasic(batchId, groupId, exBatch, 
    rapidType, issueNum, doneTarget, quant, exTime, howLink
  ) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      
      const allRapids = XRapidsDB.find({},{fields:{'rapid':1}}).fetch();
      const rapidS = allRapids.sort( (r1, r2)=>{
        const r1n = r1.rapid.substring(2);
        const r2n = r2.rapid.substring(2);
        return( r1n > r2n ? -1 : r1n < r2n ? 1 : 0 );
      });
      
      const next = !rapidS.length === 0 ? 1 : 
                    parseInt( rapidS[0].rapid.substring(2), 10) + 1;
      
      const apend = rapidType === 'modify' ? 'EM' : 'ER';
      
      if(!isNaN(next)) {
        const nextRapid = apend + next.toString().padStart(2, 0);
        
        const inHours = parseFloat( exTime );
        const inMinutes = moment.duration(inHours, 'hours').asMinutes();
        const exTimeNum = isNaN(inMinutes) ? false : Number(inMinutes);

        XRapidsDB.insert({
          orgKey: accessKey,
          rapid: nextRapid, 
          type: rapidType, // repair, refurb, mod
          extendBatch: exBatch,
          groupId: groupId,
          gadget: false,
          issueOrder: issueNum, // RMA, NCAR,
          live: true,
          createdAt: new Date(),
          createdWho: Meteor.userId(),
          closedAt: null,
          closedWho: null,
          timeBudget: exTimeNum,
          deliverAt: new Date(doneTarget),
          quantity: Number(quant),
          instruct: howLink,
          notes: {
            time: new Date(),
            who: Meteor.userId(),
            content: ''
          },
          cascade: [],
          whitewater: [],
          autoNC: [],
          autoSH: []
        });
      
        if(exBatch && batchId) {
          XBatchDB.update({_id: batchId, orgKey: accessKey}, {
            $set : { 
              live: true
            }
          });
          Meteor.defer( ()=>{ Meteor.call('updateOneMovement', batchId, accessKey); });
        }
        return true;
      }else{ 
        return false;
      }
    }else{
      return false;
    }
  },
  
  editExRapidBasic(rapId, rType, iNum, dTgt, quant, exTime, howLink) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      
      const rapid = XRapidsDB.findOne({_id: rapId});
      const currNum = rapid.rapid.substring(2);
      
      const apend = rType === 'modify' ? 'EM' : 'ER';
      
      const rarapid = apend + currNum;
        
      XRapidsDB.update(rapId, {
        $set: {
          rapid: rarapid, 
          type: rType,
          issueOrder: iNum,
          timeBudget: exTime,
          deliverAt: new Date(dTgt),
          quantity: Number(quant),
          instruct: howLink,
        }
      });
      return true;
    }
    // Meteor.defer( ()=>{ Meteor.call('updateOneMovement', batchId, accessKey); });
  },
  
  setExRapidFall(rapId, falls) {
    if(Array.isArray(falls) && Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      
      const doc = XRapidsDB.findOne({_id: rapId});
      const csc = doc.cascade;
      
      let wfObjs = [];
      
      if(falls.includes('doPre')) {
        const match = csc.find( w => w.type === 'checkpoint' );
        match ? wfObjs.push(match) :
          wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'Pre-Check',
            type: 'checkpoint',
            position: Number(1),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          });
      }
      if(falls.includes('doBuild')) {
        const match = csc.find( w => w.type === 'build' );
        match ? wfObjs.push(match) :
          wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: doc.type,
            type: 'build',
            position: Number(2),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          });
      }
      if(falls.includes('doInspect')) {
        const match = csc.find( w => w.type === 'inspect' );
        match ? wfObjs.push(match) :
          wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'inspect',
            type: 'inspect',
            position: Number(3),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          });
      }
      if(falls.includes('doTest')) {
        const match = csc.find( w => w.type === 'test' );
        match ? wfObjs.push(match) :
          wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'test',
            type: 'test',
            position: Number(4),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          });
      }
      if(falls.includes('doFinish')) {
        const match = csc.find( w => w.type === 'finish' );
        match ? wfObjs.push(match) :
          wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'finish',
            type: 'finish',
            position: Number(5),
            action: 'clicker',
            branchKey: 't3rm1n2t1ng8r2nch',
            counts: []
          });
      }
        
      XRapidsDB.update(rapId, {
        $set: {
          cascade: wfObjs
        }
      });
      return true;
    }
  },
  
  setExRapidFlow(rapId, flows, batchNum) {
    if(Array.isArray(flows) && Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      
      const app = AppDB.findOne({orgKey: Meteor.user().orgKey});
      const srs = XSeriesDB.findOne({batch: batchNum});
      const items = srs ? srs.items : [];
      
      let wwObjs = [];
      for(let fl of flows) {
        if(fl.key === 'f1n15h1t3m5t3p') {
          let uniqueStep = fl;
          uniqueStep['key'] = new Meteor.Collection.ObjectID().valueOf();
          wwObjs.push(uniqueStep);
        }else{
          const amatch = app.trackOption.find( x => x.key === fl.key );
          if(!amatch) {
            wwObjs.push(fl);
          }else{
            let imatch = false;
            let ritems = items.filter( i => i.altPath.find( a => 
                                  a.rapId === rapId && a.completed === false ) );
            for(let i of ritems) {
              const hmatch = i.history.find( x => x.key !== fl.key && 
                                      x.step === fl.step && x.type === fl.type );
              if(hmatch) {
                imatch = hmatch.key;
                break;
              }
            }
            const useKey = imatch ? imatch : new Meteor.Collection.ObjectID().valueOf();
            
            let uniqueStep = fl;
            uniqueStep['key'] = useKey;
            wwObjs.push(uniqueStep);
          }
        }
      }
        
      XRapidsDB.update(rapId, {
        $set: {
          whitewater: wwObjs
        }
      });
      return true;
    }
  },
  
  clearExRapidFlow(rapId) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      XRapidsDB.update(rapId, {
        $set: {
          whitewater: []
        }
      });
      return true;
    }else{
      return false;
    }
  },
  
  setExRapidNC(rapId, nonConArr) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      XRapidsDB.update(rapId, {
        $set: {
          autoNC: nonConArr
        }
      });
      return true;
    }
  },
  
  setExRapidSH(rapId, shortArr) {
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      XRapidsDB.update(rapId, {
        $set: {
          autoSH: shortArr
        }
      });
      return true;
    }
  },
  
  setRapidNote(rapidId, noteContent) {
    if(Roles.userIsInRole(Meteor.userId(), ['edit','run'])) {
      XRapidsDB.update({_id: rapidId, orgKey: Meteor.user().orgKey}, {
        $set : { notes : {
          time: new Date(),
          who: Meteor.userId(),
          content: noteContent
        }}});
      return true;
    }else{
      return false;
    }
  },
  
  
  rapidPositiveCounter(rapidId, wfKey, upVal) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      const num = upVal ? Math.abs(upVal) : Math.abs(1);
      
      XRapidsDB.update({_id: rapidId, orgKey: Meteor.user().orgKey, 'cascade.wfKey': wfKey}, {
        $push : { 'cascade.$.counts': { 
          tick: Number(num),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  
  rapidNegativeCounter(rapidId, wfKey, dnVal) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      const num = dnVal ? -Math.abs(dnVal) : -Math.abs(1);
      
      XRapidsDB.update({_id: rapidId, orgKey: Meteor.user().orgKey, 'cascade.wfKey': wfKey}, {
        $push : { 'cascade.$.counts': { 
          tick: Number(num),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  
  
  
  
  
  
 
      
      
  setRapidClose(rapidId, batchId, batchNum) {
    const accessKey = Meteor.user().orgKey;
    
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      XRapidsDB.update(rapidId, {
        $set: {
          live: false,
          closedAt: new Date(),
          closedWho: Meteor.userId()
        }
      });
      const anyOpen = XRapidsDB.find({extendBatch: batchNum, live: true}).count();
      if(anyOpen === 0) {
        XBatchDB.update({_id: batchId, completed: true},{
          $set: {
            live: false,
          }
        });
      }
      Meteor.defer( ()=>{
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
    
  },
  setRapidOpen(rapidId, batchId) {
    const accessKey = Meteor.user().orgKey;
    
    if(Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])) {
      XRapidsDB.update(rapidId, {
        $set: {
          live: true,
          closedAt: null,
          closedWho: null
        }
      });
      XBatchDB.update({_id: batchId},{
        $set: {
          live: true,
        }
      });
      Meteor.defer( ()=>{
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  
  deleteExtendRapid(rapidId, batchId, check) {
    const accessKey = Meteor.user().orgKey;
    const auth = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove', 'admin']);
    const app = AppDB.findOne({orgKey: Meteor.user().orgKey});
    
    if(auth && app.orgPIN === check) {
      XRapidsDB.remove({_id: rapidId});
        
      Meteor.defer( ()=>{
        Meteor.call('updateOneMovement', batchId, accessKey);
      });
      return true;
    }else{
      return false;
    }
  },
  

   /*
  addOneOffRapid(batchId, groupId, rType, exBatch, issueNum,
    exTime, doneTarget, flowKey, falls, howLink, applyAll, quant,
    nonConArr, shortArr
  ) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      
      const thisYear = moment().weekYear().toString().slice(-2);
      
      */
  /*
  fixFirstRapids() {
    const rapids = XRapidsDB.find({}).fetch();
    
    for(let rp of rapids) {
      
      // XRapidsDB.update(rp._id, {
      //   $set: {
      //     unlimited: apAl,
      //     cascade: []
      //   },
      // });
      XRapidsDB.update(rp._id, {
        $unset: {
          'unlimited': "" 
        }
      });
      
    }
    return true;
  },*/
  // removeALLrapids() {
  //   if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
  //     XRapidsDB.remove({});
  //     return true;
  //   }else{
  //     return false;
  //   }
  // },
  
  
  
});