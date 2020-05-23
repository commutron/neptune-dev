Meteor.methods({
  
//// Variants \\\\
  
  addNewVariant(widgetId, groupId, variant, wiki, unit) {
    const duplicate = VariantDB.findOne({versionKey: OLDversionKey});
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'create')) {
          
      VariantDB.insert({
        orgKey: Meteor.user().orgKey,
        groupId: groupId,
        widgetId: widgetId,
        versionKey: new Meteor.Collection.ObjectID().valueOf(),// leagcy connector
        variant: variant,
        createdAt: new Date(),
        createdWho: Meteor.userId(),
        updatedAt: new Date(),
		    updatedWho: Meteor.userId(),
        live: true,
        tags: [],
        instruct: wiki,
        runUnits: Number(unit),
		    notes: false,
		    assembly: [],
		    npiTime: []
      });
      return true;
    }else{
      return false;
    }
  },
  
  migrateWidgetVersions(widgetId) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      
      const doc = WidgetDB.findOne({_id: widgetId});
      
      if(doc) {
        for( let ver of doc.versions) {
          
          const orgKey = doc.orgKey;
          const groupId = doc.groupId;
          const OLDversionKey = ver.versionKey; 
          const OLDversion = ver.version;
          const OLDcreateAt = ver.createdAt;
          const OLDcreateWho = ver.createdWho; 
          const OLDlive = ver.live;
          const OLDtags = ver.tags;
          const OLDnotes = ver.notes;
          const OLDwiki = ver.wiki;
          const OLDunit = ver.units;
          const OLDassembly = ver.assembly;
    
          VariantDB.insert({
            orgKey: orgKey,
            groupId: groupId,
            widgetId: widgetId,
            versionKey: OLDversionKey,
            variant: OLDversion,
            createdAt: OLDcreateAt,
            createdWho: OLDcreateWho,
            updatedAt: new Date(),
    		    updatedWho: Meteor.userId(),
            live: OLDlive,
            tags: OLDtags,
            instruct: OLDwiki,
            runUnits: Number(OLDunit),
    		    notes: OLDnotes,
    		    assembly: OLDassembly,
    		    npiTime: []
          });
        }
      }
      return true;
    }else{
      return false;
    }
  },
  
  editVariant(widgetId, vId, newVar, vState, newWiki, newUnit) {
    const doc = VariantDB.findOne({_id: vId});
    const dups = VariantDB.findOne({widgetId: widgetId, variant: newVar});
    let duplicate = doc.variant !== newVar && dups ? true : false;
    
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'edit')) {
      VariantDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
          variant: newVar,
          live: vState,
          instruct: newWiki,
          runUnits: Number(newUnit)
        }});
      return true;
    }else{
      return false;
    }
  },
  
  /// move a variant to a different widget??

  deleteVariant(vObj, pass) {
    const doc = VariantDB.findOne({_id: vId});
    const versionKey = doc.versionKey;
    const inUse = BatchDB.findOne({versionKey: versionKey});
    const inUseX = XBatchDB.findOne({versionKey: versionKey});
    if(!inUse && !inUseX) {
      const lock = doc.createdAt.toISOString().split("T")[0];
      const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
      const access = doc.orgKey === Meteor.user().orgKey;
      const unlock = lock === pass;
      if(auth && access && unlock) {
    		VariantDB.remove(vObj);
    		return true;
      }else{
        return false;
      }
    }else{
      return 'inUse';
    }
  },
  
  setVariantNote(vId, note) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      VariantDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
        $set : { notes: {
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
  pushVTag(vId, vKey, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      WidgetDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
        $push : { 
          tags: tag
        }});
      BatchDB.update({orgKey: Meteor.user().orgKey, versionKey: vKey, live: true}, {
        $push : { 
          tags: tag
        }});
    }else{
      null;
    }
  },
  // pull a tag
  pullVTag(vId, tag) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      WidgetDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
        $pull : {
          tags: tag
        }});
    }else{
      null;
    }
  },

  // push a Component
  pushCompV(vId, comps) {
    if(Roles.userIsInRole(Meteor.userId(), ['edit'])) {
      for(let c of comps) {
        VariantDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
          $push : { 
            assembly: { 
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
  pullCompV(vId, comp) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      VariantDB.update({_id: vID, orgKey: Meteor.user().orgKey}, {
        $pull : { 
          assembly: { 
            component: comp
          }
      }});
    }else{
      null;
    }
  },
  
});

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