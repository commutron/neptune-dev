import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import { MuteButton } from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import EventsTimeline from '/client/components/bigUi/BatchFeed/EventsTimeline.jsx';


const WatchlistPanel = ({ orb, bolt, app, user, users, batchEvents, bCache })=> {
  
  const orderedWatchlist = user.watchlist.sort((w1, w2)=> {
    if (w1.keyword > w2.keyword) { return -1 }
    if (w1.keyword < w2.keyword) { return 1 }
    return 0;
  });
  
  return (
    <div className='invert'>
      <p>Watch a {Pref.batch} to keep up to date with events as they happen</p>
      <p>No notifications yet though</p>
      <p className='vspace'></p>
      <table className='wide cap space'>
        {orderedWatchlist.map( (entry)=>{
          const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === entry.keyword) : false;
          const what = moreInfo ? moreInfo.isWhat : 'unavailable';
          const batch = entry.type === 'batch' ?
                          batchEvents.find( x => x.batch === entry.keyword ) 
                        : [];
          
          return(
            <tbody key={entry.watchKey} className='vSpaceGaps'>
              <tr>
                <td className='noRightBorder big'>
                  <ExploreLinkBlock type={entry.type} keyword={entry.keyword} />
                </td>
                <td className='noRightBorder'>{what}</td>
                <td className='noRightBorder'>
                  <MuteButton
                    wKey={entry.watchKey}
                    mute={entry.mute} />
                </td>
                <td>
                  <WatchButton
                    list={user.watchlist}
                    type={entry.type}
                    keyword={entry.keyword}
                    unique={entry.time.toISOString()} />
                </td>
              </tr>
              <tr>
                <td colSpan='5' className='leftText clean'>
                  
                  <EventsTimeline
                    id={null}
                    batch={batch}
                    verifyList={[]}
                    eventList={batch ? batch.events || [] : []}
                    doneBatch={false} />
              
                </td>
              </tr>
            </tbody>
        )})}
      </table>
    </div>
  );
};

export default WatchlistPanel;