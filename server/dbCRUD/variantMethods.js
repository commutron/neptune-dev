Meteor.methods({
  
//// Variants \\\\
  
  addNewVariant(widgetId, groupId, variant, wiki, unit) {
    const duplicate = VariantDB.findOne({widgetId: widgetId, variant: variant},{fields:{'_id':1}});
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'create')) {
          
      VariantDB.insert({
        orgKey: Meteor.user().orgKey,
        groupId: groupId,
        widgetId: widgetId,
        versionKey: new Meteor.Collection.ObjectID().valueOf(),
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
  
  
  dbbleCheckVersions() {
    let found = [];
    
    const docs = WidgetDB.find({}).fetch();
      
    for( let w of docs ) {
      if(w.versions) {
        const variants = VariantDB.find({widgetId: w._id},{fields:{'variant':1,'versionKey':1}}).fetch();
        found.push({
          widget: w.widget,
          vers: w.versions,
          variants: variants
        });
      }
    }
    
    return found;
    
  },
  
  /*UNSEToldwidgetversionsArray() {
    try{
      if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $unset : { 
            'phases': ""
          }})//,{multi: true});
      }else{
        null;
      }
    }catch (err) {
      throw new Meteor.Error(err);
    }
  },
  */
  
  
  
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
  
  editVariant(widgetId, vId, newVar, newWiki, newUnit) {
    const doc = VariantDB.findOne({_id: vId},{fields:{'variant':1}});
    const dups = VariantDB.findOne({widgetId: widgetId, variant: newVar},{fields:{'_id':1}});
    let duplicate = doc.variant !== newVar && dups ? true : false;
    
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'edit')) {
      VariantDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
        $set : {
          updatedAt: new Date(),
  			  updatedWho: Meteor.userId(),
          variant: newVar,
          instruct: newWiki,
          runUnits: Number(newUnit)
        }});
      return true;
    }else{
      return false;
    }
  },
  
  changeVive(vId, vKey, status) {
    const flip = !status;
    const accessKey = Meteor.user().orgKey;
    const inUseX = XBatchDB.findOne({versionKey: vKey, live: true});
    if(!inUseX && Roles.userIsInRole(Meteor.userId(), 'edit')) {
      VariantDB.update({_id: vId, orgKey: accessKey}, {
  			$set : {
  			  live: flip
        }
      });
      return true;
    }else{
      return false;
    }
  },
  
  /// move a variant to a different widget??

  deleteVariant(vObj, pass) {
    const doc = VariantDB.findOne({_id: vObj._id});
    const versionKey = doc.versionKey;
    const inUseX = XBatchDB.findOne({versionKey: versionKey},{fields:{'_id':1}});
    if(!inUseX) {
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
      VariantDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
        $push : { 
          tags: tag
        }});
      XBatchDB.update({orgKey: Meteor.user().orgKey, versionKey: vKey, live: true}, {
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
      VariantDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
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
      VariantDB.update({_id: vId, orgKey: Meteor.user().orgKey}, {
        $pull : { 
          assembly: { 
            component: comp
          }
      }});
    }else{
      null;
    }
  },
  
  componentExport(wId, vId) {
    const widget = WidgetDB.findOne({_id: wId, orgKey: Meteor.user().orgKey});
    const variant = VariantDB.findOne({_id: vId, orgKey: Meteor.user().orgKey});
    
    const data = [];
    if(variant) {
      for(let a of variant.assembly) {
        data.push(a.component);
      }
    }
    let cleanData = [... new Set(data) ].sort();
    cleanData.unshift(`${widget.widget}_v.${variant.variant}_${widget.describe}`);
    return cleanData;
  }
  
});