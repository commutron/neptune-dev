Meteor.methods({
  
//// Variants \\\\
  
  addNewVariant(widgetId, groupId, variant, wiki, unit, emailUsers) {
    const accessKey = Meteor.user().orgKey;
    const name = Meteor.user().username.replace('.', ' ').replace('_', ' ');
    
    const duplicate = VariantDB.findOne({widgetId: widgetId, variant: variant},{fields:{'_id':1}});
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'create')) {
          
      VariantDB.insert({
        orgKey: accessKey,
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
		    radioactive: false
      });
      
      if(emailUsers && emailUsers.length > 0) {
        Meteor.defer( ()=>{
          const widget = WidgetDB.findOne({_id: widgetId},{fields:{'widget':1,'describe':1}});
          const isW = widget.widget.toUpperCase() + ' - ' + widget.describe;
          const group = GroupDB.findOne({_id: groupId},{fields:{'group':1,'alias':1}});
          const isG = group.group + ' (' + group.alias.toUpperCase() + ')';
          
          Meteor.call('handleIntVarEmail', accessKey, emailUsers, name, isG, isW, variant, wiki);
        });
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
        
      XBatchDB.find({versionKey: vKey, live: true},{fields:{'_id':1}})
      .forEach( (b)=> {
        XBatchDB.update(b._id, {
          $push : { 
            tags: tag
          }
        });
        TraceDB.update({batchID: b._id}, {
          $push : { 
            tags: tag
          }
        });
      });
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
  
  setVRad(vKey, rad) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      VariantDB.update({versionKey: vKey, orgKey: Meteor.user().orgKey}, {
        $set : {
          radioactive: rad
        }});
        
      Meteor.defer( ()=>{
        XBatchDB.find({versionKey: vKey},{fields:{'batch':1}})
          .forEach( b => {
            TraceDB.update({batch: b.batch}, {
              $set : { 
                rad: rad
              }
            });
          });
      });
    }else{
      null;
    }
  },
  cutVRad(vKey) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      VariantDB.update({versionKey: vKey, orgKey: Meteor.user().orgKey}, {
        $set : {
          radioactive: false
        }});
        
      Meteor.defer( ()=>{
        XBatchDB.find({versionKey: vKey},{fields:{'batch':1}})
          .forEach( b => {
            TraceDB.update({batch: b.batch}, {
              $set : { 
                rad: false
              }
            });
          });
      });
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
              // ref: false,
              component: c,
              // location: false,
              // theta: false,
              // bSide: false
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