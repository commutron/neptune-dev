Meteor.methods({
  
  
  //// THIS IS ALL VERY OUT OF DATE \\\\

  //// Archive \\\\
  addYear(year) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      var doc = ArchiveDB.findOne({year: year});
      if(!doc) {
        AchiveDB.insert({
          year: year,
          orgKey: Meteor.user().orgKey,
          org: Meteor.user().org,
          createdAt: new Date(),
          batches: []
        });
      }else{
        null;
      }
      return true;
    }else{
      return false;
    }
  },

  
  //////////////////////////////////////////////////////////////////////////////
 //// Archive Batch. Insert into ArchiveDB and Delete from BatchDB ////////////
//////////////////////////////////////////////////////////////////////////////

      //// Work in Progress \\\\

  batchAchive(batchId) {
    const b = BatchDB.findOne({_id: batchId, orgKey: Meteor.user().orgKey}); // data shortcut
    
    // requested batch exists
    if(!b) {
      return false;
    }else{
    // basic checks
      const start = b.items > 0;
      const open = b.finishedAt === false; // batch has NOT been finished
      const done = b.items.every( x => x.finishedAt !== false ); // all items are done
      const year = b.batch.substring(0, 2);
      // for a more logical company that followed real years
      // const year = b.createdAt.getFullYear().toString().substring(2);
      const stData = StatsDB.findOne({year: year}, {fields : {history : 1}}); // find year
      const report = stData ? stData.history.some(x => x.batch === b.batch) : false; // prevent duplicate

      if(start && open && done && !report) {
      // distille down to important information
  
        // top level info
        const batch = b.batch; // batch number
        const wIdget = b.wIdget; // widget Id
        const group = b.group; // group
        const tags = b.tags; // tags
        const steps = b.route.length; // how many route steps
    
        // get counts for how many tracked items and total units
        const items = b.items.length; // items
        let units = 0; // units
        for(var i of b.items) {
          units += i.unit;
        }
        
        // get counts for Non-Conformance total and categories
        const ncTotal = b.nonCon.length; // total nonCons
        let ncM = 0; // material
        let ncP = 0; // part
        let ncJ = 0; // join
        let ncW = 0; // work / function
        for(var q of b.nonCon) {
          if(q.cat === 1) {
            ncM++;
          }else if(q.cat === 2) {
            ncP++;
          }else if(q.cat === 3) {
            ncJ++;
          }else if(q.cat === 4) {
            ncW++;
          }else{
            null;
          }
        }
  
  // this is changing with the new GBDO
        // get total of items returned,
        // not counting multiple returns of the same item
        let rma = new Set();
        for(var r of b.rma) {
          for(var bar of r.barcodes) {
            rma.add(bar);
          }
        }
        const returns = rma.size; // total rma items
        
        // get stored scrap count
        const scraps = b.scrap; // scrapped
        // get total part shortages, counting multiples of the same part
        const shorts = b.short.length; // part shortages

// ----- entering the data ----- \\
        
        // enter report
        StatsDB.update({year: year, org: Meteor.user().org}, {
          $push : { 
            batches : {
              batch: batch,
              finishedAt: new Date(),
              wIdget: wIdget,
              group: group,
              tags: tags,
              steps: Number(steps),
              items: Number(items),
              units: Number(units),
              ncTotal: Number(ncTotal),
              ncMaterial: Number(ncM),
              ncPart: Number(ncP),
              ncJoin: Number(ncJ),
              ncWork: Number(ncW),
              returns: Number(returns),
              scraps: Number(scraps),
              shorts: Number(shorts)
            }
          }
        });
        
      
      // complete
      return true;
        
      }else{
        return false;
      }
    }
  },

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
  
  
  // not sure if any of this is needed below this point
  ///////////////
  
  
// increment number of returned items //////////////
  updateReturn(id) {
    const b = BatchDB.findOne(id);
    
    const yr = b.batch.substring(0, 2);
    const st = StatsDB.findOne({year: yr});
    const x = st.history.find(i => i.batch === b.batch);
    
    // get total of items returned,
    // not counting multiple returns of the same item
    let rma = new Set();
    for(var r of b.rma) {
      for(var bar of r.barcodes) {
        rma.add(bar);
      }
    }
    const returns = rma.size; // total rma items
    
    // get counts for Non-Conformance total and categories
    const ncTotal = b.nonCon.length; // total nonCons
    let ncM = 0; // material
    let ncP = 0; // part
    let ncJ = 0; // join
    let ncW = 0; // work / function
    for(var q of b.nonCon) {
      if(q.cat === 1) {
        ncM++;
      }else if(q.cat === 2) {
        ncP++;
      }else if(q.cat === 3) {
        ncJ++;
      }else if(q.cat === 4) {
        ncW++;
      }else{
        null;
      }
    }
    
    if(x) {
      const diffNC = ncTotal - x.ncTotal;
      const diffM = ncM - x.ncMaterial;
      const diffP = ncP - x.ncPart;
      const diffJ = ncJ - x.ncJoin;
      const diffW = ncW - x.ncWork;
      const diffR = returns - x.returns;
      
      StatsDB.update({year: yr, org: Meteor.user().org, 'history.batch': 'total'}, {
        $inc : {
          'history.$.ncTotal': diffNC,
          'history.$.ncMaterial': diffM,
          'history.$.ncPart': diffP,
          'history.$.ncJoin': diffJ,
          'history.$.ncWork': diffW,
          'history.$.returns': diffR
        }
      });
      StatsDB.update({year: yr, org: Meteor.user().org, 'history.batch': b.batch}, {
        $inc : {
          'history.$.ncTotal': diffNC,
          'history.$.ncMaterial': diffM,
          'history.$.ncPart': diffP,
          'history.$.ncJoin': diffJ,
          'history.$.ncWork': diffW,
          'history.$.returns': diffR
        }
      });
    }else{null}
  },

// increment number of scraped boards
  updateScrap(id) {
    const bt = BatchDB.findOne(id);
    const yr = bt.batch.substring(0, 2);
    const st = StatsDB.findOne({year: yr});
    const x = st.history.find(i => i.batch === bt.batch);
    
    if(x) {
      const diff = bt.scrap - x.scraps;
      if(diff !== 0) {
        StatsDB.update({year: yr, org: Meteor.user().org, 'history.batch': 'total'}, {
          $inc : {
            'history.$.scraps': diff
          }
        });
        StatsDB.update({year: yr, org: Meteor.user().org, 'history.batch': bt.batch}, {
          $inc : { 
            'history.$.scraps': diff
          }
        });
      }else{null}
    }else{null}
  },
  
  

});