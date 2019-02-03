import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

const RecentPanel = ({ orb, bolt, app, user, users, bCache })=> {
  
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
      <div className='rightText'>
        <p>{user.username}</p>
        <p>Production search history from the past 30 days</p>
      </div>
      <table className='wide cap space'>
        
          {limitedTrail.map( (entry, index)=>{
            const keyword = entry.keyword;
            const elink = '/data/batch?request=' + keyword;
            const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === entry.keyword) : false;
            const what = moreInfo ? moreInfo.isWhat : 'unavailable';
            if(index === 0 || moment(entry.time).isSame(limitedTrail[index-1].time, 'day') === false) {
              return(
                <tbody key={index}>
                  <tr className='big leftText line4x'>
                    <th colSpan='4'>{moment(entry.time).format('dddd MMMM Do')}</th>
                  </tr>
                  <tr>
                    <td className='noRightBorder medBig'>{keyword}</td>
                    <td className='noRightBorder'>{what}</td>
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
                </tbody>
              );
            }
            return(
              <tbody key={index}>
                <tr>
                  <td className='noRightBorder medBig'>{keyword}</td>
                  <td className='noRightBorder'>{what}</td>
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
              </tbody>
            );
          })}
      </table>
      
    </div>
  );
};

export default RecentPanel;