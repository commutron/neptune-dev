import React from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';

import { UnReadButton } from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import { RemoveNotifyButton } from '/client/components/bigUi/WatchModule/WatchModule.jsx';


const InboxPanel = ({ orb, bolt, app, user, users })=> {
  
  const orderedInbox = user.inbox.sort((t1, t2)=> {
    if (moment(t1.time).isAfter(t2.time)) { return -1 }
    if (moment(t1.time).isBefore(t2.time)) { return 1 }
    return 0;
  });
  
  return (
    <div className='invert'>
      <p>
        Events will show up in your inbox for {Pref.batches} in your watchlist 
        while notify is turned on.
      </p>
      <p className='vspace'></p>
      <table className=' wide cap'>
        {orderedInbox.map( (entry, index)=>{
          const link = entry.type === 'batch' ? 
                        '/data/batch?request=' + entry.keyword
                      : '';
          return(
            <tbody key={index} className=''>
              <tr>
                <td className='noRightBorder'>
                  <UnReadButton nKey={entry.notifyKey} unread={entry.unread} />
                </td>
                <td className='noRightBorder'>
                  {entry.type === 'batch' ?
                    <a href={link}>{entry.keyword.split('+')[0]}</a>
                  :
                    <i>{entry.keyword}</i>
                  }
                </td>
                <td className='noRightBorder'>
                  <b>{entry.title}</b> - {entry.detail}
                </td>
                <td className='noRightBorder'>
                  {moment(entry.time).calendar()}
                </td>
                <td>
                  <RemoveNotifyButton nKey={entry.notifyKey} />
                </td>
              </tr>
            </tbody>
        )})}
      </table>
      
    </div>
  );
};

export default InboxPanel;