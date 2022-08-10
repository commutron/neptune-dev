// import { Random } from 'meteor/random';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';

import { syncLocale } from '/server/utility.js';
import Config from '/server/hardConfig.js';

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
    if( next.isSameOrAfter(startDate) && next.isBefore(endDate) ) {
      evArr.push( new Date(next.format()) );
      next.add(sv.recur, sv.timeSpan);
    }else if( next.isAfter(endDate) ) {
      return evArr;
    }else{
      next.add(sv.recur, sv.timeSpan);
    }
  }
};

  
Meteor.methods({
  
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
    
    const eq = EquipDB.findOne({_id: eqId, online: true},{fields:{'service':1}});
    const sv = eq?.service.find( s => s.serveKey === serveKey );
    
    if(eq && sv) {
      const next = nextService(sv);
      const nextMmnt = moment(next).tz(Config.clientTZ);
      const close = sv.whenOf === 'startOf' || ( sv.timeSpan === 'day' && !nextMmnt.isWorkingDay() ) ?
                      nextMmnt.nextWorkingTime().endOf('day') :
                      nextMmnt.lastWorkingTime().endOf('day');
                    
      const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
      const expire = close.clone().addWorkingTime(sv.grace, 'days').format();
      
      const match = MaintainDB.findOne({equipId: eq._id, serveKey: sv.serveKey, expire: { $gt: new Date() }},
                                       {fields:{'checklist':1, 'notes':1}});
          
      if(!match) {
        MaintainDB.insert({
          equipId: eq._id,
          serveKey: sv.serveKey,
          orgKey: accessKey,
          name: sv.name,
          open: new Date( open ),
          close: new Date( close.format() ),
          expire: new Date( expire ),
          status: false, // complete, notrequired, incomplete, missed
          doneAt: false,
          checklist: [],
          notes: ''
        });
      }else{
        MaintainDB.update({_id: match._id, status: false, close: { $gt: new Date() }},{
          $set: {
            equipId: eq._id,
            serveKey: sv.serveKey,
            orgKey: accessKey,
            name: sv.name,
            open: new Date( open ),
            close: new Date( close.format() ),
            expire: new Date( expire ),
            status: false, // complete, notrequired, incomplete, missed
            doneAt: false,
            checklist: match?.checklist || [],
            notes: match?.notes || ''
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
                              'equipId':1, 'name':1,
                              'close':1, 'expire':1,
                              'checklist':1
                            }}
                          ).fetch();

            for(const mn of maint) {
              if( now.isAfter(mn.expire) ) {
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
        EquipDB.find({online: true},{fields:{'service':1}})
        .forEach( (eq)=> {
          const maintEq = MaintainDB.find({equipId: eq._id, expire: { $gt: new Date() }},
                          {fields:{'serveKey':1, 'checklist':1, 'notes':1}}).fetch();
          
          for(const sv of eq.service) {
            
            const next = nextService(sv);
            
            const nextMmnt = moment(next).tz(Config.clientTZ);
            const close = sv.whenOf === 'startOf' || ( sv.timeSpan === 'day' && !nextMmnt.isWorkingDay() ) ?
                      nextMmnt.nextWorkingTime().endOf('day') :
                      nextMmnt.lastWorkingTime().endOf('day');
                      
            const match = maintEq.find( m => m.serveKey === sv.serveKey );
       
            const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
            const expire = close.clone().addWorkingTime(sv.grace, 'days').format();
            
            if(!match) {
              MaintainDB.insert({
                equipId: eq._id,
                serveKey: sv.serveKey,
                orgKey: orgKey,
                name: sv.name,
                open: new Date( open ),
                close: new Date( close.format() ),
                expire: new Date( expire ),
                status: false, // complete, notrequired, incomplete, missed
                doneAt: false,
                checklist: [],
                notes: ''
              });
            }else{
              MaintainDB.update({_id: match._id, status: false, close: { $gt: new Date() }},{
                $set: {
                  equipId: eq._id,
                  serveKey: sv.serveKey,
                  orgKey: orgKey,
                  name: sv.name,
                  open: new Date( open ),
                  close: new Date( close.format() ),
                  expire: new Date( expire ),
                  status: false, // complete, notrequired, incomplete, missed
                  doneAt: false,
                  checklist: match?.checklist || [],
                  notes: match?.notes || ''
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
  
  predictMonthService(startDate, endDate) {
    const orgKey = Meteor.user().orgKey;
    syncLocale(orgKey);
    
    let futureEvents = [];
    
    EquipDB.find({online: true},{fields:{'alias':1,'service':1}})
      .forEach( (eq)=> {
          // const maintEq = MaintainDB.find({equipId: eq._id, expire: { $gt: new Date() }},
                          // {fields:{'serveKey':1, 'checklist':1, 'notes':1}}).fetch();
          
        for(const sv of eq.service) {
            
            const next = futureService(sv, startDate, endDate);
            
            for( let nx of next ) {
              
              const nextMmnt = moment(nx).tz(Config.clientTZ);
              
              const close = sv.whenOf === 'startOf' || ( sv.timeSpan === 'day' && !nextMmnt.isWorkingDay() ) ?
                      nextMmnt.nextWorkingTime().endOf('day') :
                      nextMmnt.lastWorkingTime().endOf('day');
              
              if(futureEvents.length === 0 || !close.isSame( futureEvents[futureEvents.length-1].end, 'day' ) ) {
                
                const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
            
                futureEvents.push({
              	  title: eq.alias + ' - ' + sv.name,
              	  start: new Date(open),
              	  end: new Date(close.format()),
              	  allDay: true
              	});
              }else{
                null;
              }
              
            }
            
            /*
            const nextMmnt = moment(next).tz(Config.clientTZ);
            const close = sv.whenOf === 'startOf' || ( sv.timeSpan === 'day' && !nextMmnt.isWorkingDay() ) ?
                      nextMmnt.nextWorkingTime().endOf('day') :
                      nextMmnt.lastWorkingTime().endOf('day');
                      
            // const match = maintEq.find( m => m.serveKey === sv.serveKey );
       
            const open = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
            const expire = close.clone().addWorkingTime(sv.grace, 'days').format();
            */
            
        }
      });
      
      return futureEvents;

    
  }
  
});