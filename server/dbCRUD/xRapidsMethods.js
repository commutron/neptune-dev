import moment from 'moment';


Meteor.methods({

  addExtendRapid(batchId, groupId, rType, exBatch, issueNum,
    exTime, doneTarget, flowKey, falls, howLink, applyAll, quant,
    nonConArr, shortArr
  ) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      
      const rp = XRapidsDB.findOne({extendBatch: exBatch},{fields:{'rapid':1}},{sort:{rapid: 1}});
      const next = !rp ? 1 : parseInt( rp.rapid.slice(-2), 10) + 1;
      
      if(!isNaN(next) && next < 99) {
        const nextRapid = exBatch + '-r' + next.toString().padStart(2, 0);
        
        const inHours = parseFloat( exTime );
        const inMinutes = moment.duration(inHours, 'hours').asMinutes();
        const exTimeNum = isNaN(inMinutes) ? false : Number(inMinutes);
        
        let fallObjs = [];
        falls.includes('doBuild') ? fallObjs.push({
          wfKey: new Meteor.Collection.ObjectID().valueOf(),
          gate: rType,
          type: 'build',
          position: Number(1),
          action: 'clicker',
          branchKey: 'r@p1d8r2nch',
          counts: []
        }) : null;
        falls.includes('doInspect') ? fallObjs.push({
          wfKey: new Meteor.Collection.ObjectID().valueOf(),
          gate: 'inspect',
          type: 'inspect',
          position: Number(2),
          action: 'clicker',
          branchKey: 'r@p1d8r2nch',
          counts: []
        }) : null;
        falls.includes('doTest') ? fallObjs.push({
          wfKey: new Meteor.Collection.ObjectID().valueOf(),
          gate: 'test',
          type: 'test',
          position: Number(3),
          action: 'clicker',
          branchKey: 'r@p1d8r2nch',
          counts: []
        }) : null;
        falls.includes('doFinish') ? fallObjs.push({
          wfKey: new Meteor.Collection.ObjectID().valueOf(),
          gate: 'finish',
          type: 'finish',
          position: Number(4),
          action: 'clicker',
          branchKey: 't3rm1n2t1ng8r2nch',
          counts: []
        }) : null;
           
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
          cascade: fallObjs,
          applyAll: applyAll,
          whitewater: flowKey, // if extended & serialized
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
  
  
  
  
  
  
  
  
  /*
  addOneOffRapid(batchId, groupId, rType, exBatch, issueNum,
    exTime, doneTarget, flowKey, falls, howLink, applyAll, quant,
    nonConArr, shortArr
  ) {
    const accessKey = Meteor.user().orgKey;
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      
      const thisYear = moment().weekYear().toString().slice(-2);
      
      */
  
  
  
  
  
  
  removeALLrapids() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      XRapidsDB.remove({});
      return true;
    }else{
      return false;
    }
  },
  
  
  
});