import React from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const PrivacyPanel = ({ orb, bolt, app, user, users, bCache })=> {
  
  function clearthisUserCrumbs() {
    Meteor.call('clearBreadcrumbsRepair', (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete'); }
    });
  }
  
  function jumpTo(location) {
    Session.set('now', location);
    FlowRouter.go('/production');
  }
  
  const basket = user.breadcrumbs || [];
  const limitedTrail = basket.reverse();
  
  return(
    <div className='invert'>
      <div className=''>
        <p>Saved usage behaviour for {user.username}</p>
      </div>
      <table className='wide cap space'>
        {limitedTrail.map( (entry, index)=>{
          const keyword = entry.keyword;
          const link = keyword.length === 5 ? 'pro' : false;
          const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === entry.keyword) : false;
          const what = moreInfo ? moreInfo.isWhat : 'unavailable';
          return(
            <tbody key={index}>
              <tr className='big leftText line4x'>
                <th colSpan='4'>{moment(entry.time).format('dddd MMMM Do')}</th>
              </tr>
              <tr>
                <td className='noRightBorder medBig'>{keyword}</td>
                <td className='noRightBorder'>{what}</td>
                <td className='noRightBorder'>{moment(entry.time).format('dddd MMMM Do')}</td>
                <td className='noRightBorder noCopy'>
                  {link === 'pro' &&
                  <button
                    onClick={()=>jumpTo(keyword)}
                    className='textLinkButton'
                  ><i className='fas fa-paper-plane fa-fw'></i> Production</button>}
                </td>
                
              </tr>
            </tbody>
          );
        })}
      </table>
      
      <p>
        <button
          onClick={()=>clearthisUserCrumbs()}
          className='action clearBlue invert'
        >Clear Your breadcrumbs</button>
      </p>
      
    </div>
  );
};

export default PrivacyPanel;