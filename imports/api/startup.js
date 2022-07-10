FlowRouter.wait();

Tracker.autorun( ()=> {
  // if the roles subscription is ready, start routing
  // there are specific cases that this reruns, so we also check
  // that FlowRouter hasn't initalized already
  if(Roles.subscription.ready() && !FlowRouter._initialized) {
     FlowRouter.initialize();
  }
 /*
  let { Worker, parentPort } = require("worker_threads");
  let hamsters = require("hamsters.js");
    meteor npm install --save hamsters.js@5.4.1
   hamsters.init({
      Worker: Worker,
      parentPort: parentPort,
      // persistence: true
    });
*/
});


/*
// Alanning Role V2 Migration
import { Roles } from 'meteor/alanning:roles'
Meteor.startup(() => {
  Roles._forwardMigrate()
})
*/
