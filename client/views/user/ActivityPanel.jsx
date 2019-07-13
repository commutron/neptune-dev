import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Spin from '/client/components/uUi/Spin.jsx';

const ActivityPanel = ({ orb, bolt, app, user, users, bCache })=> {
  
  const [weekNum, setWeekNum] = useState(moment().week());
  const [weekData, setWeekData] = useState(false);
  
  function jumpTo(location) {
    Session.set('now', location);
    FlowRouter.go('/production');
  }
  
  function getData() {
    if(!weekData) {
      Meteor.call('fetchSelfTideActivity', weekNum, (err, rtn)=>{
  	    err && console.log(err);
  	    const cronoTimes = rtn.sort((x1, x2)=> {
                            if (x1.startTime < x2.startTime) { return 1 }
                            if (x1.startTime > x2.startTime) { return -1 }
                            return 0;
                          });
        setWeekData(cronoTimes);
  	  });
    }
  }
  useEffect(() => {
    getData();
    Roles.userIsInRole(Meteor.userId(), ['admin', 'debug']) && console.log(weekData);
  });
  
  if( !weekData ) {
    return(
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
  
  return(
    <div className='invert'>
      <div className=''>
        <p>This weeks logged time. Durations are rounded to the nearest minute</p>
      </div>
      <table className='wide cap space'>
        <tbody key={00}>
          <tr className='leftText line2x'>
            <th colSpan='2'></th>
            <th>Start</th>
            <th>Stop</th>
            <th>Duration</th>
            <th colSpan='2'></th>
          </tr>
        </tbody>
          {weekData.map( (blk, index)=>{
            const keyword = blk.batch;
            const elink = '/data/batch?request=' + keyword;
            const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === blk.batch) : false;
            const what = moreInfo ? moreInfo.isWhat : 'unavailable';
            const mStart = moment(blk.startTime);
            const mStop = blk.stopTime ? moment(blk.stopTime) : false;
            if(index === 0 || moment(blk.startTime).isSame(weekData[index-1].startTime, 'day') === false) {
              return(
                <tbody key={blk.tKey}>
                  <tr className='big leftText line4x'>
                    <th colSpan='7'>{moment(blk.startTime).format('dddd MMMM Do')}</th>
                  </tr>
                  <tr>
                    <td className='noRightBorder medBig'>{keyword}</td>
                    <td className='noRightBorder'>{what}</td>
                    <td className='noRightBorder'>{mStart.format('hh:mm A')}</td>
                    <td className='noRightBorder'>{mStop ? mStop.format('hh:mm A') : '___'}</td>
                    <td className='noRightBorder'>{mStop && Math.round( moment.duration(mStop.diff(mStart)).asMinutes() )} minutes</td>
                    <td className='noRightBorder noCopy'>
                      <button
                        onClick={()=>jumpTo(keyword)}
                        className='textLinkButton'
                      ><i className='fas fa-paper-plane fa-fw'></i></button>
                    </td>
                    <td className='noRightBorder noCopy'>
                      <a href={elink}><i className='fas fa-rocket fa-fw'></i></a>
                    </td>
                  </tr>
                </tbody>
              );
            }
            return(
              <tbody key={blk.tKey}>
                <tr>
                  <td className='noRightBorder medBig'>{keyword}</td>
                  <td className='noRightBorder'>{what}</td>
                  <td className='noRightBorder'>{mStart.format('hh:mm A')}</td>
                  <td className='noRightBorder'>{mStop ? mStop.format('hh:mm A') : '___'}</td>
                  <td className='noRightBorder'>{mStop && Math.round( moment.duration(mStop.diff(mStart)).asMinutes() )} minutes</td>
                  <td className='noRightBorder noCopy'>
                    <button
                      onClick={()=>jumpTo(keyword)}
                      className='textLinkButton'
                    ><i className='fas fa-paper-plane fa-fw'></i></button>
                  </td>
                  <td className='noRightBorder noCopy'>
                    <a href={elink}><i className='fas fa-rocket fa-fw'></i></a>
                  </td>
                </tr>
              </tbody>
            );
          })
          }
      </table>
      
    </div>
  );
};

export default ActivityPanel;