FlowRouter.wait();

Tracker.autorun( ()=> {
  // if the roles subscription is ready, start routing
  // there are specific cases that this reruns, so we also check
  // that FlowRouter hasn't initalized already
  if(Roles.subscription.ready() && !FlowRouter._initialized) {
     FlowRouter.initialize();
  }
});

Tracker.autorun( ()=> {
  if(!Meteor.userId()) {
    if(Session.get('loggedIn')) {
      FlowRouter.go(FlowRouter.path('login'));
    }
  }
});