import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import { MuteButton } from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const WatchlistPanel = ({ orb, bolt, app, user, users, batchEvents })=> {
  
  return (
    <div className='invert'>
      <p>Work in progress.</p>
      <p>Watch a {Pref.batch} to keep up to date with events as they happen</p>
      <p>No notifications yet though</p>
      
      <table className=' wide cap'>
        {user.watchlist.map( (entry, index)=>{
          const keyword = entry.keyword.split('+')[0];
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
          return(
            <tbody key={index} className='vSpaceGaps'>
              <tr>
                <td className='noRightBorder medBig'>
                  <a href={link}>{keyword}</a>
                </td>
                <td className='noRightBorder'></td>
                <td className='noRightBorder'></td>
                <td className='noRightBorder'>
                  <MuteButton type={entry.type} keyword={entry.keyword} mute={entry.mute} />
                </td>
                <td>
                  <WatchButton list={user.watchlist} type={entry.type} keyword={entry.keyword} />
                </td>
              </tr>
              <tr>
                <td colSpan='5' className='leftText clean'>
                  <ul className='eventList'>
                    {events.map( (entry, index)=>{
                      const highlight = moment().isSame(entry.time, 'day') ? 'eventListNew' : '';
                      return(
                        <li key={index} className={highlight}>
                          <b>{entry.title}</b>,
                          <i> {entry.detail}</i>,
                          <em> {moment(entry.time).calendar()}</em>
                        </li>
                    )})}
                    {/*<dd>Started watching {moment(entry.time).calendar()}</dd>*/}
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