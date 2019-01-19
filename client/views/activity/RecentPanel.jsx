import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

const RecentPanel = ({ orb, bolt, app, user, users })=> {
  
  function jumpTo(location) {
    Session.set('now', location);
    FlowRouter.go('/production');
  }
  
  const basket = user.breadcrumbs || [];
  const limitedTrail = basket.filter( 
                        x => moment().diff(moment(x.time), 'days') < 31 )
                          .reverse();
  
  return(
    <div className='invert'>
      <p>Based on Production searches from the past 30 days</p>
      <p className='vspace'></p>
      <table className='wide cap space'>
        <tbody>
          {limitedTrail.map( (entry, index)=>{
            const keyword = entry.keyword;
            const elink = '/data/batch?request=' + keyword;
            const highlight = moment().isSame(entry.time, 'day') ? 'eventListNew ' : '';
            return(
              <tr key={index} className={highlight}>
                <td className='noRightBorder medBig'>{keyword}</td>
                <td className='noRightBorder'>{moment(entry.time).format('dddd MMMM Do')}</td>
                <td className='noRightBorder noCopy'>
                  <button
                    onClick={()=>jumpTo(keyword)}
                    className='textLinkButton'
                  ><i className='fas fa-paper-plane fa-fw'></i> Production</button>
                </td>
                <td className='noRightBorder noCopy'>
                  <a href={elink}><i className='fas fa-rocket fa-fw'></i> Explore</a>
                </td>
              </tr>
          )})}
        </tbody>
      </table>
      
    </div>
  );
};

export default RecentPanel;