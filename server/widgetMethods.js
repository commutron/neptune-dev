Meteor.methods({
  
  //// Widgets \\\\

  addNewWidget(widget, groupId, desc, version, wiki, unit, endTrack) {
    const duplicate = WidgetDB.findOne({widget: widget});
    if(!duplicate && Meteor.user().power) {
          
      WidgetDB.insert({
        widget: widget,
        describe: desc,
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        orgKey: Meteor.user().orgKey,
        groupId: groupId,
        flows: [
          {
            flowKey: new Meteor.Collection.ObjectID().valueOf(),
				    title: 'default flow',
            flow: [endTrack]
          }
        ],
        versions: [
          {
            versionKey: new Meteor.Collection.ObjectID().valueOf(),
            version: version,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdWho: Meteor.userId(),
            verifiedWho: false,
            live: true,
            tags: [],
            wiki: wiki,
            unit: Number(unit),
				    notes: false,
				    assembly: []
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
    if(!duplicate && Meteor.user().power) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $set : {
          widget: newName,
          describe: newDesc,
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
      const lock = doc.createdAt.toISOString();
      const user = Meteor.user().power;
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
    if(!duplicate && Meteor.user().power) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $push : {
          versions:
          {
            versionKey: new Meteor.Collection.ObjectID().valueOf(),
            version: versionId,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdWho: Meteor.userId(),
            verifiedWho: false,
            live: true,
            tags: [],
            wiki: wiki,
            unit: Number(unit),
				    notes: false,
				    assembly: []
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
    if(!duplicate && Meteor.user().power) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
        $set : {
          'versions.$.version': newVer,
          'versions.$.live': state,
          'versions.$.wiki': newWiki,
          'versions.$.unit': newUnit
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
      const lock = ver.createdAt.toISOString();
      const user = Meteor.user().power;
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


  pushFlow(widgetId, flowTitle, flowObj) {
    if(Meteor.user().power) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $push : {
          flows: 
          {
            flowKey: new Meteor.Collection.ObjectID().valueOf(),
  				  title: flowTitle,
            flow: flowObj
          }
      }});
      return true;
    }else{
      return false;
    }
  },
  
  pullFlow(widgetId, fKey) {
    const inUseR = BatchDB.findOne({river: fKey});
    const inUseRA = BatchDB.findOne({riverAlt: fKey});
    if(!inUseR && !inUseRA) {
      if(Meteor.user().power) {
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
    WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.versionKey': vKey}, {
      $set : { 'versions.$.notes': {
        time: new Date(),
        who: Meteor.userId(),
        content: note,
      }}});
  },
  
// needs testing
  killAllVersions(widgetId) {
    if(Meteor.user().power) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'versions.live': true}, {
        $set : { 
          'versions.$.live': false
  		   }});
  		return true;
    }else{
      return false;
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
  setAssembly(widgetId, vKey, assembly, verify) {
    if(Meteor.user().power) {
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
  
  
});