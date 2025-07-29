import moment from 'moment';
import timezone from 'moment-timezone';
import Config from '/server/hardConfig.js';


Meteor.methods({
 
	kallInfo(orb) {
    // console.log(orb);
    
    if(typeof orb === 'string' && Config.regexSN.test(orb) ) {
      return XSeriesDB.findOne({'items.serial': orb},{fields:{'_id':1}}) ? true : false;
    }else{
      return false;
    }
  },
  
  kallNewSerial(serial, batch, unitNum) {
    const isRole = Roles.userIsInRole(Meteor.userId(), ['admin', 'kitting']);
    const orgKey = Meteor.user().orgKey;
    
    if(!isRole) {
      return [false, undefined];
    }else{
      const regexANY = Config.regexSN.test(serial);
      if(!serial || !batch || !regexANY) {
        return [false, 'invalid'];
      }else{
        const exists = XSeriesDB.find({"items.serial": serial},{limit:1}).count();
        
        if(exists) {
          return [false, 'duplicate'];
        }else{
          
          const doc = XBatchDB.findOne({
            batch: batch, 
            orgKey: orgKey, 
            completed: false},{
              fields:{'versionKey':1,'quantity':1}
            });
            
          if(!doc) {
            return [false, 'nobatch'];
          }else{
    
            const srs = XSeriesDB.find({
              batch: batch, 
              $expr: { $lt: [{ $size: "$items" }, doc.quantity] }
            },{limit:1}).count();
        
            if(!srs) {
              return [false, 'maxsrs'];
            }else{
              const unit = unitNum || Meteor.call('quickVunit', doc.versionKey);
             
              XSeriesDB.update({batch: batch}, {
                $push : { items : {
                  serial: serial,
                  createdAt: new Date(),
                  createdWho: Meteor.userId(),
                  completed: false,
                  completedAt: false,
                  completedWho: false,
                  units: Number(unit),
                  subItems: [],
                  history: [],
                  altPath: []
              }}});
              
              return [true, `${serial} Created`];
            }
          }
        }
      }
    }
  }
  
    
});