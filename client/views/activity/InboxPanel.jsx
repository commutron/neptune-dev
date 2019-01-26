import React from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';

const InboxPanel = ({ orb, bolt, app, user, users })=> {
  
  return (
    <div className='invert'>
      <p>No notifications yet though</p>
      <p className='vspace'></p>
      <table className=' wide cap'>
        {user.inbox.map( (entry, index)=>{
          
          return(
            <tbody key={index} className='vSpaceGaps'>
              <tr>
                <td className='noRightBorder'>
                  <a href=''>{entry.keyword.split('+')[0]}</a>
                </td>
                <td className='noRightBorder'>
                  <b>{entry.title}</b> - {entry.detail}
                </td>
                <td>
                  {moment(entry.time).calendar()}
                </td>
              </tr>
            </tbody>
        )})}
      </table>
      
    </div>
  );
};

export default InboxPanel;