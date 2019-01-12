import React from 'react';
import moment from 'moment';
//import Pref from '/client/global/pref.js';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import { MuteButton } from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const WatchlistPanel = ({ orb, bolt, app, user, users })=> {
  
  return (
    <div className='invert'>
      <p>Work in progress.</p>
      <p>Just bookmarks at the moment but will soon be a feed of activity</p>
      <p>No notifications yet either</p>
      
      <table className=' wide cap'>
        {user.watchlist.map( (entry, index)=>{
          const link = entry.type === 'group' ? 
                        '/data/group?request=' + entry.keyword.split('+')[0]
                      : entry.type === 'widget' ? 
                        '/data/widget?request=' + entry.keyword.split('+')[0]
                      : entry.type === 'batch' ? 
                        '/data/batch?request=' + entry.keyword.split('+')[0]
                      : entry.type === 'item' ? 
                        '/data/batch?request=' + entry.keyword.split('+')[1] + '&specify=' + entry.keyword.split('+')[0]
                      : '';
          return(
            <tbody key={index} className='vSpaceGaps'>
              <tr>
                <td className='noRightBorder'>
                  <a href={link}>{entry.keyword.split('+')[0]}</a>
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
                  <dl>
                    <dd>Started watching {moment(entry.time).calendar()}</dd>
                  </dl>
                </td>
              </tr>
            </tbody>
        )})}
      </table>
    </div>
  );
};

export default WatchlistPanel;