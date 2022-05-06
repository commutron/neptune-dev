import { Mongo } from 'meteor/mongo';

FontAwesomeConfig = { autoReplaceSvg: 'nest' };

// Deny all client-side updates on collections

AppDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

CacheDB.deny({
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

VariantDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

BatchDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

XBatchDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

XSeriesDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

XRapidsDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

TraceDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});

EmailDB.deny({
  insert: () => { return true; },
  update: () => { return true; },
  remove: () => { return true; },
});