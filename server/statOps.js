import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time-ship';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['07:00:00', '16:30:00'],
      2: ['07:00:00', '16:30:00'],
      3: ['07:00:00', '16:30:00'],
      4: ['07:00:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
  },// including lunch breaks!
  shippinghours: {
      0: null,
      1: null,
      2: ['11:30:00', '11:30:00'],
      3: null,
      4: ['11:30:00', '11:30:00'],
      5: null,
      6: null
  }// including lunch breaks!
});


function countItemsWith(accessKey, rangeStart, rangeEnd, historyType) {
  
  let itemCount = 0;
  
  const generalFind = BatchDB.find({
    orgKey: accessKey, 
    items: { $elemMatch: { createdAt: {
      $lte: new Date(rangeEnd) 
    }}}
  }).fetch();
  
  for(let gf of generalFind) {
    const theseItems = gf.items.filter( x =>
      x.history.find( y =>
        moment(y.time).isBetween(rangeStart, rangeEnd) &&
        y.type === historyType && y.good === true )
    );
    itemCount = itemCount + theseItems.length;   
  }
  return itemCount;
}
export const itemsWithPromise = (accessKey, rangeStart, rangeEnd, historyType)=> {
  return new Promise(function(resolve) {
    const fetch = countItemsWith(accessKey, rangeStart, rangeEnd, historyType);
    resolve(fetch);
  });
};


export const totalTideTimePromise = (accessKey, rangeStart, rangeEnd)=> {
  return new Promise(function(resolve) { // bigInt ????
    let totalCount = 0;
  
    const generalFind = BatchDB.find({
      orgKey: accessKey,
      tide: { $elemMatch: { startTime: {
        $gte: new Date(rangeStart),
        $lte: new Date(rangeEnd) 
      }}}
    }).fetch();
  
    for(let gf of generalFind) {
      let tideTime = 0;
      if(Array.isArray(gf.tide)) {
        const windowedTide = gf.tide.filter( x =>
          moment(x.startTime).isBetween(rangeStart, rangeEnd)
        );
        for(let bl of windowedTide) {
          const mStart = moment(bl.startTime);
          const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
          const block = moment.duration(mStop.diff(mStart)).asMinutes();
          tideTime = tideTime + block;
        }
        totalCount = totalCount + tideTime;   
      }else{
        null;
      }
    }
    resolve(totalCount);
  });
};