import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import { MuteButton } from '/client/components/bigUi/WatchModule/WatchModule.jsx';

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
          const keyword = entry.keyword.split('+')[0];
          const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === entry.keyword) : false;
          const what = moreInfo ? moreInfo.isWhat : 'unavailable';
          const link = entry.type === 'group' ? 
                        '/data/group?request=' + keyword
                      : entry.type === 'widget' ? 
                        '/data/widget?request=' + keyword
                      : entry.type === 'batch' ? 
                        '/data/batch?request=' + keyword
                      : entry.type === 'item' ? 
                        '/data/batch?request=' + entry.keyword.split('+')[1] + '&specify=' + keyword
                      : '';
          const batch = entry.type === 'batch' ?
                          batchEvents.find( x => x.batch === keyword ) 
                        : [];
          const events = batch.events || [];
          const orderedEvents = events.sort((t1, t2)=> {
            if (moment(t1.time).isAfter(t2.time)) { return -1 }
            if (moment(t1.time).isBefore(t2.time)) { return 1 }
            return 0;
          });
          return(
            <tbody key={entry.watchKey} className='vSpaceGaps'>
              <tr>
                <td className='noRightBorder big'>
                  <a href={link}><i className='fas fa-rocket fa-fw'></i> {keyword}</a>
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
                  <ul className='eventList'>
                    {orderedEvents.map( (entry, index)=>{
                      const highlight = moment().isSame(entry.time, 'day') ? 'eventListNew' : '';
                      return(
                        <li key={entry.time.toISOString()+index} className={highlight}>
                          <b>{entry.title}</b>,
                          <i> {entry.detail}</i>,
                          <em> {moment(entry.time).calendar()}</em>
                        </li>
                    )})}
                  </ul>
                </td>
              </tr>
            </tbody>
        )})}
      </table>
    </div>
  );
};

export default WatchlistPanel;