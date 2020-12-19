Meteor.methods({
  
  //// Widgets \\\\
  addNewWidget(widget, groupId, desc) {
    const duplicate = WidgetDB.findOne({widget: widget});
    if(!duplicate && Roles.userIsInRole(Meteor.userId(), 'create')) {
      const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
      const endTrack = appDoc.lastTrack;
      const dfLists = appDoc.nonConTypeLists.filter( x => x.defaultOn === true );
      const ncKeys = Array.from(dfLists, x => x.key);
      
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
				    type: 'plus',
            flow: [endTrack],
            ncLists: ncKeys
          }
        ]
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
    const inUseX = XBatchDB.findOne({widgetId: widgetId});
    if(!inUse && !inUseX) {
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
  
// new
  pushBasicPlusFlow(widgetId, flowTitle, ncLists) {
    const exdt = Array.isArray(ncLists);
    const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
    const endTrack = appDoc.lastTrack;
    if(Roles.userIsInRole(Meteor.userId(), 'edit') && exdt === true) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $push : {
          flows: 
          {
            flowKey: new Meteor.Collection.ObjectID().valueOf(),
  				  title: flowTitle,
  				  type: 'plus',
            flow: [endTrack],
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
  setBasicPlusFlowHead(widgetId, editId, flowTitle, ncLists) {
    const exdt = Array.isArray(ncLists);
    if(Roles.userIsInRole(Meteor.userId(), 'edit') && exdt === true) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'flows.flowKey': editId}, {
        $set : {
          'flows.$.title': flowTitle,
          'flows.$.type': 'plus',
          'flows.$.ncLists': ncLists
      }});
      return true;
    }else{
      return false;
    }
  },
  
  setBasicPlusFlowRoute(widgetId, editId, flowObj) {
    if(Roles.userIsInRole(Meteor.userId(), 'edit')) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'flows.flowKey': editId}, {
        $set : {
          'flows.$.flow': flowObj,
      }});
      return true;
    }else{
      return false;
    }
  },
  
  rebuildWidgetFlows(widgetId) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      
      const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
      const options = appDoc.trackOption;
      const endTrack = appDoc.lastTrack;
      
      const doc = WidgetDB.findOne({_id: widgetId});
      if(doc) {
        for( let flow of doc.flows) {
          const editKey = flow.flowKey;
          const oldFlow = flow.flow;
          
          let baseSet = new Set();
          for(let t of oldFlow) {
            let o = options.find(x => x.key === t.key);
            o ? o['how'] = t.how : null;
            o ? baseSet.add(o) : null;
          }
          baseSet.add(endTrack);
          
          const newFlowObj = [...baseSet];
    
          WidgetDB.update({
            _id: widgetId, 
            orgKey: Meteor.user().orgKey, 
            'flows.flowKey': editKey
          }, {
            $set : {
              'flows.$.flow': newFlowObj,
          }});
        }
        return true;
      }else{
        return true;
      }
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
  }
  
  
});