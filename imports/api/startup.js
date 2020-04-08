FlowRouter.wait();

Tracker.autorun( ()=> {
  // if the roles subscription is ready, start routing
  // there are specific cases that this reruns, so we also check
  // that FlowRouter hasn't initalized already
  if(Roles.subscription.ready() && !FlowRouter._initialized) {
     FlowRouter.initialize();
  }
});

/*
Tracker.autorun( ()=> {
  console.log('ID: ' + Meteor.userId());
  if(!Meteor.userId()) {
    if(Session.get('loggedIn')) {
      FlowRouter.go(FlowRouter.path('login'));
    }
  }
});

// Alanning Role V2 Migration
import { Roles } from 'meteor/alanning:roles'
Meteor.startup(() => {
  Roles._forwardMigrate()
})


*/