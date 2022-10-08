// import { Random } from 'meteor/random';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { syncLocale } from '/server/utility.js';
import Config from '/server/hardConfig.js';

const calcClose = ( nextMmnt, whenOf, timeSpan )=> {
  if( whenOf === 'startOf' || ( timeSpan === 'day' && !nextMmnt.isWorkingDay() ) ) {
    return nextMmnt.nextWorkingTime().endOf('day');
  }else{
    return nextMmnt.lastWorkingTime().endOf('day');
  }
};

const calcOpen = ( closeMmnt, period )=> {
  return closeMmnt.clone()
    .subtractWorkingTime(period - 1, 'days')
      .startOf('day')
        .format();
};

const calcExpire = ( closeMmnt, grace )=> {
  return closeMmnt.clone()
    .addWorkingTime(grace, 'days')
      .format();
};

const nextService = (sv)=> {
  const st = moment(sv.nextAt).tz(Config.clientTZ);
  
  let next = sv.whenOf === 'endOf' ? st.endOf(sv.timeSpan) :
              sv.whenOf === 'startOf' ? st.startOf(sv.timeSpan) :
              sv.timeSpan === 'week' ? st.day(sv.whenOf).endOf('day') :
              sv.timeSpan === 'month' ? st.date(sv.whenOf).endOf('day') :
                                        st.month(sv.whenOf).endOf('month');
  
  while(true) {
    if(next.isSameOrAfter(new Date())) {
      return new Date(next.format());
    }else{
      next.add(sv.recur, sv.timeSpan);
    }
  }
};

const futureService = (sv, startDate, endDate)=> {
  const st = moment(sv.nextAt).tz(Config.clientTZ);
  
  let evArr = [];
  
  let next = sv.whenOf === 'endOf' ? st.endOf(sv.timeSpan) :
              sv.whenOf === 'startOf' ? st.startOf(sv.timeSpan) :
              sv.timeSpan === 'week' ? st.day(sv.whenOf).endOf('day') :
              sv.timeSpan === 'month' ? st.date(sv.whenOf).endOf('day') :
                                        st.month(sv.whenOf).endOf('month');
  
  while(true) {
    const close = calcClose(next, sv.whenOf, sv.timeSpan);
    const open = moment( calcOpen( close, sv.period ) );

    if( ( close.isBetween(startDate, endDate, undefined, '[]') ||
          open.isBetween(startDate, endDate, undefined, '[]') )
    ) {
      if(evArr.length === 0 || !close.isSame( evArr[evArr.length-1][1], 'day' ) ) {
        evArr.push([
          new Date(open.format()),
          new Date(close.format())
        ]);
      }
      next.add(sv.recur, sv.timeSpan);
    }else if( open.isAfter(endDate) && close.isAfter(endDate) ) {
      return evArr;
    }else{
      next.add(sv.recur, sv.timeSpan);
    }
  }
};

const doneCheck = (mn)=> {
  const eq = EquipDB.findOne({_id: mn.equipId},{fields:{'service':1}});
  const sv = eq.service.find( s => s.serveKey === mn.serveKey );
    
  const all = sv.tasks.every( t => mn.checklist.find( c => c.task === t ) );
  if(all){
    return true;
  }else{
    return false;
  }
};

Meteor.methods({
  
  serveActive(mtId) {
    const maint = MaintainDB.findOne({_id: mtId},{fields:{'checklist':1}});
    if(maint) {
      return maint.checklist.length;
    }else{
      return 0;
    }
  },
  
  serveNoReqSet(mtId, NoReq) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      const stat = NoReq ? false : 'notrequired';
      MaintainDB.update({_id: mtId}, {
        $set : {
          status: stat,
          doneAt: false,
      }});
      return true;
    }
  },
  
  serveCheck(mtId, task, isDone) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      if(isDone) {
        MaintainDB.update({_id: mtId}, {
          $push: {
            checklist: {
              task: task,
              time: new Date(),
              who: Meteor.userId()
            }
          },
          $set : {
            status: 'complete',
            doneAt: new Date()
          }
        });
        return true;
      }else{
        MaintainDB.update({_id: mtId},{
          $push: {
            checklist: {
              task: task,
              time: new Date(),
              who: Meteor.userId()
          }
        }});
        return true;
      }
    }
  },
  
  serveNotCheck(mtId, task) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      MaintainDB.update({_id: mtId}, {
        $pull : {
          checklist: { task: task }
        },
        $set : {
          status: false,
          doneAt: false
        }
      });
      return true;
    }
  },
  
  serveNotesSet(mtId, notes) {
    if( Roles.userIsInRole(Meteor.userId(), 'active') ) {
      MaintainDB.update({_id: mtId}, {
        $set : {
          notes: notes
      }});
      return true;
    }
  },
  
  pmUpdate(eqId, serveKey, accessKey) {
    syncLocale(accessKey);
    
    const eq = EquipDB.findOne({_id: eqId, hibernate: { $ne: true } },{fields:{'online':1,'service':1}});
    const sv = eq?.service.find( s => s.serveKey === serveKey );
    
    if(eq && sv) {
      const next = nextService(sv);
      const nextMmnt = moment(next).tz(Config.clientTZ);
      
      const close = calcClose(nextMmnt, sv.whenOf, sv.timeSpan);
      
      const open = calcOpen( close, sv.period );
      const expire = calcExpire( close, sv.grace );
      
      const match = MaintainDB.findOne({equipId: eq._id, serveKey: sv.serveKey, expire: { $gt: new Date() }},
                                       {fields:{'_id':1}});
      
      const req = !eq.online && ( sv.timeSpan === 'day' || sv.timeSpan === 'week' ) ? 'notrequired' : false;
      
      if(!match) {
        MaintainDB.insert({
          equipId: eq._id,
          serveKey: sv.serveKey,
          orgKey: accessKey,
          name: sv.name,
          open: new Date( open ),
          close: new Date( close.format() ),
          expire: new Date( expire ),
          status: req, // complete, notrequired, incomplete, missed
          doneAt: false,
          checklist: [],
          notes: ''
        });
      }else{
        MaintainDB.update({_id: match._id, 
          $or: [ 
            { status: false },
            { status: 'notrequired' }
          ], close: { $gt: new Date() }},{
          $set: {
            name: sv.name,
            open: new Date( open ),
            close: new Date( close.format() ),
            expire: new Date( expire ),
            status: req
          }
        });
      }
    }
  },
  
  pmRobot(accessKey) {
    try {
      const orgKey = accessKey || Meteor.user().orgKey;
      syncLocale(orgKey);
      
      const updateStatus = ()=> {
        return new Promise(function(resolve, reject) {
          try {
            const now = moment().tz(Config.clientTZ);
            
            const maint = MaintainDB.find({status: false},
                            { fields: {
                              'equipId':1, 'serveKey': 1,
                              'name':1,
                              'close':1, 'expire':1,
                              'checklist':1
                            }}
                          ).fetch();

            for(const mn of maint) {
              if( now.isAfter(mn.expire) ) {
                if( mn.checklist.length > 0 && doneCheck(mn) ) {
                  MaintainDB.update({_id: mn._id},{
                    $set: {
                      status: 'complete',
                      doneAt: new Date( mn.checklist[mn.checklist.length-1].time )
                    }
                  });
                }else{
                  const ng = mn.checklist.length > 0 ? 'incomplete' : 'missed';
                  
                  MaintainDB.update({_id: mn._id},{
                    $set: {
                      status: ng
                    }
                  });
              
                  Meteor.defer( ()=>{
                    const equip = EquipDB.findOne({_id: mn.equipId},{fields:{'equip':1}});
                    const titl = equip?.equip || "";
                    const users = Meteor.users.find({ roles: { $in: ["equipSuper"] } });
                    const supr = Array.from(users, u => u._id);
                    
                    Meteor.call('handleInternalMaintEmail', 
                      orgKey, supr, titl, mn.name, "grace period");
                  });
                }
              }else if( now.isSame(moment(mn.close).add(1, 'days'), 'day') ) {
                Meteor.defer( ()=>{
                  const equip = EquipDB.findOne({_id: mn.equipId},{fields:{'equip':1,'stewards':1}});
                  const stew = equip?.stewards || [];
                  const titl = equip?.equip || "";
                  Meteor.call('handleInternalMaintEmail', 
                    orgKey, stew, titl, mn.name, "deadline", mn.expire); 
                });
              }
            }
            resolve('updated');
          }catch (err) {
            reject(err);
          } 
        });
      };
      
      const updateDates = ()=> {
        EquipDB.find({hibernate: { $ne: true }},{fields:{'alias':1,'online':1,'service':1}})
        .forEach( (eq)=> {

          const maintEq = MaintainDB.find({equipId: eq._id, expire: { $gt: new Date() }},
                          {fields:{'serveKey':1}}).fetch();
          
          for(const sv of eq.service) {
            const req = !eq.online && ( sv.timeSpan === 'day' || sv.timeSpan === 'week' ) ? 'notrequired' : false;
      
            const next = nextService(sv);
            
            const nextMmnt = moment(next).tz(Config.clientTZ);
            const close = calcClose(nextMmnt, sv.whenOf, sv.timeSpan);
            
            const match = maintEq.find( m => m.serveKey === sv.serveKey );
       
            const open = calcOpen( close, sv.period );
            const expire = calcExpire( close, sv.grace );
            
            if(!match) {
              MaintainDB.insert({
                equipId: eq._id,
                serveKey: sv.serveKey,
                orgKey: orgKey,
                name: sv.name,
                open: new Date( open ),
                close: new Date( close.format() ),
                expire: new Date( expire ),
                status: req, // complete, notrequired, incomplete, missed
                doneAt: false,
                checklist: [],
                notes: ''
              });
            }else{
              MaintainDB.update({_id: match._id, 
                $or: [ 
                  { status: false },
                  { status: 'notrequired' }
                ], close: { $gt: new Date() }},{
                $set: {
                  name: sv.name,
                  open: new Date( open ),
                  close: new Date( close.format() ),
                  expire: new Date( expire )
                }
              });
            }
          }
        });
      };
      
      updateStatus()
        .catch( (e)=>{
          console.error(e) })
            .then(updateDates())
              .finally(()=> { return true });

    }catch (error) {
      throw new Meteor.Error(error);
    }finally{ return true }
  },
  
  predictMonthService(startDate, endDate, incDone, incNext) {
    this.unblock();
    
    const orgKey = Meteor.user().orgKey;
    syncLocale(orgKey);
    
    let futureEvents = [];
    
    EquipDB.find({hibernate: { $ne: true}},{fields:{'alias':1,'service':1}})
      .forEach( (eq)=> {
        
        if(!incNext) {
          MaintainDB.find({equipId: eq._id, doneAt: { $ne: false },
            $or: [ 
              { open: { $gte: new Date(startDate), $lte: new Date(endDate) } },
              { close: { $gte: new Date(startDate), $lte: new Date(endDate) } }
            ]
          }, {
            fields: { 'name': 1, 'doneAt': 1 }
          }).forEach( (mn)=> {
            futureEvents.push({
          	  title: eq.alias + ' - ' + mn.name,
          	  start: mn.doneAt,
          	  end: mn.doneAt,
          	  allDay: true,
              done: true
          	});
          });
          
          MaintainDB.find({equipId: eq._id, status: 'notrequired',
            $or: [ 
              { open: { $gte: new Date(startDate), $lte: new Date(endDate) } },
              { close: { $gte: new Date(startDate), $lte: new Date(endDate) } }
            ]
          }, {
            fields: { 'name': 1, 'close': 1 }
          }).forEach( (mn)=> {
            futureEvents.push({
          	  title: eq.alias + ' - ' + mn.name,
          	  start: mn.close,
          	  end: mn.close,
          	  allDay: true,
              pass: true
          	});
          });
        }else{
      
          for(const sv of eq.service) {
              
            const next = futureService(sv, startDate, endDate);
            
            for( let nx of next ) {
              
              const matchdone = !incDone ? false :
                MaintainDB.findOne({
                  serveKey: sv.serveKey, 
                  doneAt: { $ne: false },
                  open: nx[0], close: nx[1]
              }, { fields: { 'name': 1, 'doneAt': 1 } });
              
              const matchpass = !incDone || matchdone ? false :
                MaintainDB.findOne({
                  serveKey: sv.serveKey, 
                  status: 'notrequired',
                  open: nx[0], close: nx[1]
              }, { fields: { 'name': 1, 'close': 1 } });
              
              if(matchdone) {
                futureEvents.push({
              	  title: eq.alias + ' -  ' + matchdone.name,
              	  start: matchdone.doneAt,
              	  end: matchdone.doneAt,
              	  allDay: true,
              	  done: true
              	});
              }else if(matchpass) {
                futureEvents.push({
              	  title: eq.alias + ' -  ' + matchpass.name,
              	  start: matchpass.close,
              	  end: matchpass.close,
              	  allDay: true,
              	  pass: true
              	});
              }else if( nx[1] >= new Date() ) {
                futureEvents.push({
              	  title: eq.alias + ' - ' + sv.name,
              	  start: nx[0],
              	  end: nx[1],
              	  allDay: true
              	});
              }else{
                null;
              }
            }
          }
        }
      });
      
      return futureEvents;
  },
  
  getMaintTime(mID) {
    return TimeDB.find({ 'link': mID }, 
                    { fields: {
                      'who':1,
                      'startTime':1, 
                      'stopTime':1,
                    }
                  }).fetch();
  }
  
});