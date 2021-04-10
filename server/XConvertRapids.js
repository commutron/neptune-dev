import moment from 'moment';

function getNextRapidNumber() {
  const allRapids = XRapidsDB.find({},{fields:{'rapid':1}}).fetch();
  
  const rapidS = allRapids.sort( (r1, r2)=>{
    const r1n = r1.rapid.substring(2);
    const r2n = r2.rapid.substring(2);
    return( r1n > r2n ? -1 : r1n < r2n ? 1 : 0 );
  });
    
  const next = rapidS.length === 0 ? 1 : 
                parseInt( rapidS[0].rapid.substring(2), 10 ) + 1;
    
  if(!isNaN(next)) {
    const nextRapid = 'ER' + next.toString().padStart(2, 0);
    return nextRapid;
  }else{ 
    return false;
  }
}

function getLastItemFinish(casItems, finishedAt) {
  
  let casHistory = [];
  
  for(let ci of casItems) {
    casHistory.push(ci.history);
  }
  const historyFlat = [].concat(...casHistory);
  
  if(historyFlat.length > 0) {
    const historyS = historyFlat.sort( (h1, h2)=>
                      h1.time > h2.time ? -1 : h1.time < h2.time ? 1 : 0 );
  
    const lasttime = historyS[0];
    
    return [ lasttime.time, lasttime.who ];
  }else{
    return [ finishedAt, 'unknown' ];
  }
  
}


Meteor.methods({
  
  
  convertToRapid(batchId) {
    try {
      const auth = Roles.userIsInRole(Meteor.userId(), 'admin');
      const bdoc = BatchDB.findOne({_id: batchId});
      
      if(auth && bdoc) {         
        
        const isDone = XRapidsDB.findOne({ extendBatch: bdoc.batch });
        
        if(!isDone) {
          const widget = WidgetDB.findOne({_id: bdoc.widgetId});
          const group = GroupDB.findOne({_id: widget.groupId});
          
          for( const cas of bdoc.cascade ) {
    
            const nextRapid = getNextRapidNumber();
            
            const casItems = bdoc.items.filter( x => x.rma.includes(cas.key) );
            const lastfin = getLastItemFinish(casItems, bdoc.finishedAt);
            
            if(nextRapid && lastfin) {
              
              const issueStr = 'rma-' + cas.rmaId;
              const closeTime = bdoc.live ? null : lastfin[0];
              const closeWho = bdoc.live ? null : lastfin[1];
              
              const delEst = moment(cas.time).add(14, 'days').format();
              const setCQ = cas.quantity === 0 ? casItems.length : cas.quantity;
              
              let rflow = [];
              for( let f of cas.flow ) {
                rflow.push({
                  key: f.key,
                  step: f.step,
                  type: f.type,
                  branchKey: f.branchKey || "t3rm1n2t1ng8r2nch",
                  how: f.how || ""
                });
              }
            
              XRapidsDB.insert({
                orgKey: bdoc.orgKey,
                rapid: nextRapid, 
                type: "converted-rma",
                extendBatch: bdoc.batch,
                groupId: group._id,
                gadget: false,
                issueOrder: issueStr,
                live: bdoc.live,
                createdAt: cas.time,
                createdWho: cas.who,
                closedAt: closeTime,
                closedWho: closeWho,
                timeBudget: '0',
                deliverAt: new Date(delEst),
                quantity: Number(setCQ),
                instruct: false,
                notes: {
                  time: cas.time,
                  who: cas.who,
                  content: cas.comm
                },
                cascade: [],
                whitewater: rflow,
                autoNC: cas.nonCons || [],
                autoSH: []
              });
            }
          }
          return true; // after loop
        }else{
          return 'isDone'; // aready done
        }
      }else{
        return false; // no doc
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  checkIfRapidConverted(batchId) {
    const bdoc = BatchDB.findOne({_id: batchId});
    const cas = bdoc.cascade;
    
    const xrapids = XRapidsDB.find({ extendBatch: bdoc.batch }).fetch();
    
    const ok = cas.length === xrapids.length;
    return ok;
  },
  
  findAllCascade() {
    const cbatch = BatchDB.find( { $where: "this.cascade.length > 0" } ).fetch();
    
    let rmaList = [];
    
    for( let cb of cbatch ) {
      for( let cas of cb.cascade ) {
        rmaList.push([cb.batch, cas.rmaId]);
      }
    }
    return rmaList;
  }
  
});