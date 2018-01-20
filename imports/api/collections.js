import { Mongo } from 'meteor/mongo';

// Deny all client-side updates on collections

AppDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

GroupDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

WidgetDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

BatchDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

ArchiveDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});