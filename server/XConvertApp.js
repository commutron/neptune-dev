

Meteor.methods({
  
  
  
  resetTrackWithoutPhase() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
    
      let org = AppDB.findOne({orgKey: Meteor.user().orgKey});
      
      let betterTracks = [];
      
      for( let tr of org.trackOption ) {
        betterTracks.push({
          key: tr.key,
          step: tr.step,
          type: tr.type,
          how: false,
          branchKey: tr.branchKey || false
        });
      }
      
      if( betterTracks.length === org.trackOption.length ) {
        AppDB.update({orgKey: Meteor.user().orgKey}, {
          $set : { 
            trackOption : betterTracks
        }});
      }
    
      return true;
    }else{
      return false;
    }
    
  }
  
  
});