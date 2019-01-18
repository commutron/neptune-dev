import React from 'react';
import Pref from '/client/global/pref.js';

const InboxPanel = ({ orb, bolt, app, user, users })=> {
  
  return (
    <div className='invert'>
      <table className=' wide cap'>
        {user.inbox.map( (entry, index)=>{
          
          return(
            <tbody key={index} className='vSpaceGaps'>
              <tr>
                <td className='noRightBorder'>
                  <a href=''>{/*entry.keyword.split('+')[0]*/}</a>
                </td>
                <td className='noRightBorder'>
                  
                </td>
                <td>
                  {moment().calendar()}
                </td>
              </tr>
            </tbody>
        )})}
      </table>
      
    </div>
  );
};

export default InboxPanel;