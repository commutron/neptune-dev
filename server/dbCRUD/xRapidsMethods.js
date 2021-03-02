import moment from 'moment';


Meteor.methods({

  addExtendRapid(batchId, groupId, rType, exBatch, issueNum,
    exTime, doneTarget, flows, falls, howLink, note, noLimit, quant,
    nonConArr, shortArr
  ) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      
      const allRapids = XRapidsDB.find({},{fields:{'rapid':1}}).fetch();
      const rapidS = allRapids.sort( (r1, r2)=>{
        const r1n = r1.rapid.substring(2);
        const r2n = r2.rapid.substring(2);
        return( r1n > r2n ? -1 : r1n < r2n ? 1 : 0 );
      });
      
      const next = !rapidS.length === 0 ? 1 : 
                    parseInt( rapidS[0].rapid.substring(2), 10) + 1;
      
      const apend = rType === 'modify' ? 'EM' : 'ER';
      
      if(!isNaN(next)) {
        const nextRapid = apend + next.toString().padStart(2, 0);
        
        const inHours = parseFloat( exTime );
        const inMinutes = moment.duration(inHours, 'hours').asMinutes();
        const exTimeNum = isNaN(inMinutes) ? false : Number(inMinutes);
        
        let wwObjs = [];
        if(Array.isArray(flows)) {
          for(let fl of flows) {
            let uniqueStep = fl;
            uniqueStep['key'] = new Meteor.Collection.ObjectID().valueOf();
            wwObjs.push(uniqueStep);
          }
        }
        
        let wfObjs = [];
        if(Array.isArray(falls)) {
          falls.includes('doPre') ? wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'Pre-Check',
            type: 'checkpoint',
            position: Number(1),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          }) : null;
          falls.includes('doBuild') ? wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: rType,
            type: 'build',
            position: Number(2),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          }) : null;
          falls.includes('doInspect') ? wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'inspect',
            type: 'inspect',
            position: Number(3),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          }) : null;
          falls.includes('doTest') ? wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'test',
            type: 'test',
            position: Number(4),
            action: 'clicker',
            branchKey: 'r@p1d8r2nch',
            counts: []
          }) : null;
          falls.includes('doFinish') ? wfObjs.push({
            wfKey: new Meteor.Collection.ObjectID().valueOf(),
            gate: 'finish',
            type: 'finish',
            position: Number(5),
            action: 'clicker',
            branchKey: 't3rm1n2t1ng8r2nch',
            counts: []
          }) : null;
        }

        XRapidsDB.insert({
          orgKey: accessKey,
          rapid: nextRapid, 
          type: rType, // repair, refurb, mod
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
          notes: note,
          unlimited: noLimit,
          cascade: wfObjs,
          whitewater: wwObjs, // if extended & serialized
          autoNC: nonConArr, // {ref: "k1", type: "upside down"}
          autoSH: shortArr, // {refs: "k1", part: "750001005"}
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  rapidPositiveCounter(rapidId, wfKey) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      XRapidsDB.update({_id: rapidId, orgKey: Meteor.user().orgKey, 'cascade.wfKey': wfKey}, {
        $push : { 'cascade.$.counts': { 
          tick: Number(1),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  
  rapidNegativeCounter(rapidId, wfKey) {
    if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
      null;
    }else{
      XRapidsDB.update({_id: rapidId, orgKey: Meteor.user().orgKey, 'cascade.wfKey': wfKey}, {
        $push : { 'cascade.$.counts': { 
          tick: Number(-1),
          time: new Date(),
          who: Meteor.userId()
      }}});
    }
  },
  
  /*
  fixFirstRapids() {
    const rapids = XRapidsDB.find({}).fetch();
    
    for(let rp of rapids) {
      const apAl = rp.applyAll;
      
      XRapidsDB.update(rp._id, {
        $set: {
          unlimited: apAl,
          cascade: []
        },
      });
      XRapidsDB.update(rp._id, {
        $unset: {
          'applyAll': "" 
        }
      });
      
    }
    return true;
  },*/
  
  
  
  
  /*
  addOneOffRapid(batchId, groupId, rType, exBatch, issueNum,
    exTime, doneTarget, flowKey, falls, howLink, applyAll, quant,
    nonConArr, shortArr
  ) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      
      const thisYear = moment().weekYear().toString().slice(-2);
      
      */
  
  
  
  deleteExtendRapid(rapidId, batchId, seriesId) {
    // const accessKey = Meteor.user().orgKey;
    // const doc = XRapidsDB.findOne({_id: rapidId, orgKey: accessKey});
    // const srs = XSeriesDB.findOne({_id: seriesId, orgKey: accessKey});
    
    const auth = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove', 'admin']);
    
    if(auth) {
     
      XRapidsDB.remove({_id: rapidId});
        
        // Meteor.defer( ()=>{
        //   Meteor.call('updateOneMinify', batchId, accessKey);
        // });
      return true;
    }else{
      return false;
    }
  },
  
  
  // removeALLrapids() {
  //   if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
  //     XRapidsDB.remove({});
  //     return true;
  //   }else{
  //     return false;
  //   }
  // },
  
  
  
});