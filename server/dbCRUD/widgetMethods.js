Meteor.methods({
  
  //// Widgets \\\\
  addNewWidget(widget, groupId, desc) {
    const duplicate = WidgetDB.findOne({widget: widget},{fields:{'_id':1}});
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
            ncLists: ncKeys,
            tskList: []
          }
        ]
      });
      return true;
    }else{
      return false;
    }
  },
  
  editWidget(widgetId, newName, newDesc) {
    const doc = WidgetDB.findOne({_id: widgetId},{fields:{'widget':1}});
    let duplicate = WidgetDB.findOne({widget: newName},{fields:{'_id':1}});
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
    const inUseX = VariantDB.findOne({widgetId: widgetId},{fields:{'_id':1}});
    if(!inUseX) {
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
  pushBasicPlusFlow(widgetId, flowTitle, tskList, ncLists) {
    const tkdt = Array.isArray(tskList);
    const ncdt = Array.isArray(ncLists);
    const appDoc = AppDB.findOne({orgKey: Meteor.user().orgKey});
    const endTrack = appDoc.lastTrack;
    if(Roles.userIsInRole(Meteor.userId(), 'edit') && tkdt && ncdt) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey}, {
        $push : {
          flows: 
          {
            flowKey: new Meteor.Collection.ObjectID().valueOf(),
  				  title: flowTitle,
  				  type: 'plus',
            flow: [endTrack],
            ncLists: ncLists,
            tskList: []
          }
      }});
      return true;
    }else{
      return false;
    }
  },

// edit 
  setBasicPlusFlowHead(widgetId, editId, flowTitle, tskList, ncLists) {
    const tkdt = Array.isArray(tskList);
    const ncdt = Array.isArray(ncLists);
    if(Roles.userIsInRole(Meteor.userId(), 'edit') && tkdt && ncdt) {
      WidgetDB.update({_id: widgetId, orgKey: Meteor.user().orgKey, 'flows.flowKey': editId}, {
        $set : {
          'flows.$.title': flowTitle,
          'flows.$.type': 'plus',
          'flows.$.ncLists': ncLists,
          'flows.$.tskList': tskList
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
      
      const doc = WidgetDB.findOne({_id: widgetId},{fields:{'flows':1}});
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
    const inUseX = XBatchDB.findOne({river: fKey},{fields:{'_id':1}});
    const inUseS = XSeriesDB.findOne({'items.altPath.river': fKey},{fields:{'_id':1}});
    
    if(!inUseX && !inUseS) {
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
    const inUseXA = XBatchDB.findOne({live: true, river: fKey},{fields:{'_id':1}});
    const inUseX = XBatchDB.findOne({live: false, river: fKey},{fields:{'_id':1}});
    
    const inUseSA = XSeriesDB.findOne({live: true, 'items.altPath.river': fKey},{fields:{'_id':1}});
    const inUseS = XSeriesDB.findOne({live: false, 'items.altPath.river': fKey},{fields:{'_id':1}});
    
    if(inUseXA) {
      return 'liveRiver';
    }else if(inUseX) {
      return 'deadRiver';
    }else if(inUseSA) {
      return 'liveAlt';
    }else if(inUseS) {
      return 'deadAlt';
    }else{
      return false;
    }
  }
  
  
});