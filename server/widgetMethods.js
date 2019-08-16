Meteor.methods({
  
  //// Widgets \\\\
  addNewWidget(widget, groupId, desc, version, wiki, unit, endTrack) {
    const duplicate = WidgetDB.findOne({widget: widget});
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'create')) {
          
      WidgetDB.insert({
        widget: widget,
        describe: desc,
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        updatedAt: new Date(),
  			updatedWho: Meteor.userId(),
        orgKey: Meteor.user().orgKey,
        groupId: groupId,
        flows: [
          {
            flowKey: new Meteor.Collection.ObjectID().valueOf(),
				    title: 'default flow',
				    type: 'basic',
            flow: [endTrack]
          }
        ],
        versions: [
          {
            versionKey: new Meteor.Collection.ObjectID().valueOf(),
            version: version,
            createdAt: new Date(),
            createdWho: Meteor.userId(),
            updatedAt: new Date(),
  			    updatedWho: Meteor.userId(),
            verifiedWho: false,
            live: true,
            tags: [],
            wiki: wiki,
            units: Number(unit),
				    notes: false,
				    assembly: [],
				    subWidgets: [] // widgetId and versionKey
          }
				],
      });
      return true;
    }else{
      return false;
    }
  },
  
  editWidget(widgetId, newName, newDesc) {
    const doc = WidgetDB.findOne({_id: widgetId});
    let duplicate = WidgetDB.findOne({widget: newName});
    doc.widget === newName ? duplicate = false : null;
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'edit')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $set : {
          widget: newName,
          describe: newDesc,
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId()
        }});
      return true;
    }else{
      return false;
    }
  },
  
  
  deleteWidget(widgetId, pass) {
    const inUse = BatchDB.findOne({widgetId: widgetId});
    if(!inUse) {
      const doc = WidgetDB.findOne({_id: widgetId});
      const lock = doc.createdAt.toISOString().split("T")[0];
      const user = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(user && access && unlock) {
        WidgetDB.remove(widgetId);
        return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  
  addVersion(widgetId, versionId, wiki, unit) {
    const doc = WidgetDB.findOne({_id: widgetId});
    const duplicate = doc.versions.find(x => x.version === versionId);
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'create')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $push : {
          versions:
          {
            versionKey: new Meteor.Collection.ObjectID().valueOf(),
            version: versionId,
            createdAt: new Date(),
            createdWho: Meteor.userId(),
            updatedAt: new Date(),
            updatedWho: Meteor.userId(),
            verifiedWho: false,
            live: true,
            tags: [],
            wiki: wiki,
            units: Number(unit),
				    notes: false,
				    assembly: [],
				    subWidgets: [] // widgetId and versionKey
          }
        }});
      return true;
    }else{
      return false;
    }
  },
  

  editVersion(widgetId, vKey, newVer, state, newWiki, newUnit) {
    const doc = WidgetDB.findOne({_id: widgetId});
    const ver = doc.versions.find(x => x.versionKey === vKey);
    let duplicate = doc.versions.find(x => x.version === newVer);
    ver.version === newVer ? duplicate = false : null;
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'edit')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
        $set : {
          'versions.$.updatedAt': new Date(),
  			  'versions.$.updatedWho': Meteor.userId(),
          'versions.$.version': newVer,
          'versions.$.live': state,
          'versions.$.wiki': newWiki,
          'versions.$.units': newUnit
        }});
      return true;
    }else{
      return false;
    }
  },
  

  deleteVersion(widgetId, vKey, pass) {
    const inUse = BatchDB.findOne({versionKey: vKey});
    if(!inUse) {
      const doc = WidgetDB.findOne({_id: widgetId});
      const ver = doc.versions.find(x => x.versionKey === vKey);
      const lock = ver.createdAt.toISOString().split("T")[0];
      const user = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(user && access && unlock) {
    		WidgetDB.update(widgetId, {
          $pull : { versions: { versionKey: vKey }
    		   }});
    		return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },

// new
  pushBasicPlusFlow(widgetId, flowTitle, flowObj, ncLists) {
    const exdt = Array.isArray(ncLists);
    if(Roles.userIsInRole(Meteor.userId(), 'edit') && exdt === true) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $push : {
          flows: 
          {
            flowKey: new Meteor.Collection.ObjectID().valueOf(),
  				  title: flowTitle,
  				  type: 'plus',
            flow: flowObj,
            ncLists: ncLists
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  /*
  let counterObjs = [];
    for(let cs of counterSelect) {
      let app = AppDB.findOne({orgKey: Meteor.user().orgKey});
      let step = app && app.counterOptions && app.counterOptions.find( x => x.key === cs );
      if(step) {
        counterObjs.push({
          ckey: cs,
          step: step.step,
          counts: []
        });
      }
    }
    */

// edit 
  setBasicPlusFlow(widgetId, editId, flowTitle, flowObj, ncLists) {
    const exdt = Array.isArray(ncLists);
    if(Roles.userIsInRole(Meteor.userId(), 'edit') && exdt === true) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'flows.flowKey': editId}, {
        $set : {
          'flows.$.title': flowTitle,
          'flows.$.type': 'plus',
          'flows.$.flow': flowObj,
          'flows.$.ncLists': ncLists
      }});
      return true;
    }else{
      return false;
    }
  },

// remove
  pullFlow(widgetId, fKey) {
    const inUseR = BatchDB.findOne({river: fKey});
    const inUseRA = BatchDB.findOne({riverAlt: fKey});
    if(!inUseR && !inUseRA) {
      if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
    		WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
          $pull : { flows: { flowKey: fKey }
    		   }});
    		return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  activeFlowCheck(fKey) {
    const inUseRA = BatchDB.findOne({active: true, river: fKey});
    const inUseAA = BatchDB.findOne({active: true, riverAlt: fKey});
    const inUseR = BatchDB.findOne({active: false, river: fKey});
    const inUseA = BatchDB.findOne({active: false, riverAlt: fKey});
    if(inUseRA) {
      return 'liveRiver';
    }else if(inUseAA) {
      return 'liveAlt';
    }else if(inUseR) {
      return 'deadRiver';
    }else if(inUseA) {
      return 'deadAlt';
    }else{
      return false;
    }
  },

  setVersionNote(widgetId, vKey, note) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
        $set : { 'versions.$.notes': {
          time: new Date(),
          who: Meteor.userId(),
          content: note,
        }}});
      return true;
    }else{
      return false;
    }
  },
  
  // push a tag
  pushWTag(widgetId, vKey, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
        $push : { 
          'versions.$.tags': tag
        }});
      BatchDB.update({orgKey: Meteor.user().orgKey, versionKey: vKey, active: true}, {
        $push : { 
          tags: tag
        }});
    }else{
      null;
    }
  },
  // pull a tag
  pullWTag(widgetId, vKey, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
        $pull : {
          'versions.$.tags': tag
        }});
    }else{
      null;
    }
  },
  
  // Quoted Time Budget \\
  
  // setup quote time keys
  addQuoteTime(widgetId, vKey) {
    try{
      if(Roles.userIsInRole(Meteor.userId(), ['sales', 'edit'])) {
        WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
          $set : { 
            'versions.$.quoteTimeBasline': [],
            'versions.$.quoteTimeScale': []
          }});
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  // push basline, starting block of time
  pushBaselineTime(widgetId, vKey, qTimeBase) {
    try{
      if(Roles.userIsInRole(Meteor.userId(), ['sales', 'edit'])) {
        WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
          $push : { 
            'versions.$.quoteTimeBasline': {
              $each: [ {
                updatedAt: new Date(),
                timeAsMinutes: Number(qTimeBase)
              } ],
              $position: 0
            }
          }});
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  // push scale, per item time
  pushScaleTime(widgetId, vKey, qTimeScale) {
    try{
      if(Roles.userIsInRole(Meteor.userId(), ['sales', 'edit'])) {
        WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
          $push : { 
            'versions.$.quoteTimeScale': {
              $each: [ {
                updatedAt: new Date(),
                timeAsMinutes: Number(qTimeScale)
              } ],
              $position: 0
            }
          }});
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  
  // needs testing
    /*
    assembly: [
      { 
        ref: 'referance',
        component: 'part nummber',
        location: [x,y,z], // "z is optional"
        theta: 'orientation in degrees',
        bSide: true, // "or false" // "a split for double sided items"
      }
    ]
    */
  /*
  setAssembly(widgetId, vKey, assembly, verify) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      const verified = verify ? Meteor.userId() : false;
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
        $set : {
          'versions.$.updatedAt': new Date(),
          'versions.$.verifiedWho': verified,
          'versions.$.assembly': assembly
  		   }});
  		return true;
    }else{
      return false;
    }
  },
  */
  
  
// push a Component
  pushComp(widgetId, vKey, comps) {
    if(Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])) {
      for(let c of comps) {
        WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
          $push : { 
            'versions.$.assembly': { 
              ref: false,
              component: c,
              location: false,
              theta: false,
              bSide: false
            }
        }});
      }
    }else{
      null;
    }
  },

  // pull a Component
  pullComp(widgetId, vKey, comp) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
          $pull : { 
            'versions.$.assembly': { 
               component: comp
            }
        }});
    }else{
      null;
    }
  },

  
  
});