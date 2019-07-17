import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const ActivityPanel = ({ orb, bolt, app, user, users, bCache })=> {
  
  const [yearNum, setYearNum] = useState(moment().weekYear());
  const [weekNum, setWeekNum] = useState(moment().week());
  const [backwardLock, setBacklock] = useState(false);
  const [forwardLock, setForlock] = useState(true);
  
  const [weekData, setWeekData] = useState(false);
  
  // function jumpTo(location) {
  //   Session.set('now', location);
  //   FlowRouter.go('/production');
  // }
  
  function getData() {
    setWeekData(false);
    Meteor.call('fetchSelfTideActivity', yearNum, weekNum, (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=> {
                          if (x1.startTime < x2.startTime) { return 1 }
                          if (x1.startTime > x2.startTime) { return -1 }
                          return 0;
                        });
      setWeekData(cronoTimes);
	  });
  }
  
  useEffect(() => {
    getData();
    yearNum === moment().weekYear() && weekNum === moment().week() ?
      setForlock(true) : setForlock(false);
    yearNum === moment(app.tideWall || app.createdAt).weekYear() && 
    weekNum === moment(app.tideWall || app.createdAt).week() ?
      setBacklock(true) : setBacklock(false);
    
    Roles.userIsInRole(Meteor.userId(), ['admin', 'debug']) && console.log(weekData);
  }, [yearNum, weekNum]);
  
  function tickWeek(direction) {
    const yearNow = yearNum;
    const weekNow = weekNum;
    
    if( direction === 'down' ) {
      if( weekNow > 1 ) {
        setWeekNum( weekNow - 1 );
      }else{
        setYearNum( yearNow - 1 );
        setWeekNum( moment(yearNow - 1, 'YYYY').weeksInYear() );
      }
    }else if( direction === 'up') {
      if( weekNow < moment(yearNow, 'YYYY').weeksInYear() ) {
        setWeekNum( weekNow + 1 );
      }else{
        setYearNum( yearNow + 1 );
        setWeekNum( 1 );
      }
    }else if( direction === 'now') {
      setYearNum(moment().weekYear());
      setWeekNum(moment().week());
    }else{
      setYearNum(moment(app.tideWall || app.createdAt).weekYear());
      setWeekNum(moment(app.tideWall || app.createdAt).week());
    }
  }
  
  // console.log(yearNum);
  // console.log(weekNum);

  return(
    <div className='invert overscroll'>
      <div className='med line3x'>
        <p>
          <label>
            <button 
              title='First'
              className='BTTNtxtBTTN clear clearBlack'
              onClick={()=>tickWeek(false)} 
              disabled={backwardLock}
            ><i className="fas fa-angle-double-left fa-lg fa-fw"></i></button>
          </label>
          <label>
            <button 
              title='Previous'
              className='BTTNtxtBTTN clear clearBlack'
              onClick={()=>tickWeek('down')} 
              disabled={backwardLock}
            ><i className="fas fa-angle-left fa-lg fa-fw"></i></button>
          </label>
          <span className='bttnTXTbttn numFont'> {yearNum}<sub>w</sub>{weekNum} </span>
          <label>
            <button 
              title='Next'
              className='BTTNtxtBTTN clear clearBlack'
              onClick={()=>tickWeek('up')} 
              disabled={forwardLock}
            ><i className="fas fa-angle-right fa-lg fa-fw"></i></button>
          </label>
          <label>
            <button 
              title='This week'
              className='BTTNtxtBTTN clear clearBlack'
              onClick={()=>tickWeek('now')} 
              disabled={forwardLock}
            ><i className="fas fa-angle-double-right fa-lg fa-fw"></i></button>
          </label>
        </p>
      </div>
      {!weekData ?
        <CalcSpin />
      :
      weekData.length === 0 ?
        <div>
          <p className='medBig centreText line4x'>No activity found for this week</p>
        </div>
      :
      <table className='wide cap space'>
        <tbody key={00}>
          <tr className='leftText line2x'>
            <th colSpan='2'></th>
            <th><i className="fas fa-play fa-fw fa-xs blackT"></i> Start</th>
            <th><i className="fas fa-stop fa-fw fa-xs blackT"></i> Stop</th>
            <th>Duration<sup>i</sup></th>
            {/*<th colSpan='2'></th>*/}
          </tr>
        </tbody>
          {weekData.map( (blk, index)=>{
            const keyword = blk.batch;
            //const elink = '/data/batch?request=' + keyword;
            const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === blk.batch) : false;
            const what = moreInfo ? moreInfo.isWhat : 'unavailable';
            const mStart = moment(blk.startTime);
            const mStop = blk.stopTime ? moment(blk.stopTime) : false;
            if(index === 0 || moment(blk.startTime).isSame(weekData[index-1].startTime, 'day') === false) {
              return(
                <tbody key={blk.tKey}>
                  <tr className='big leftText line4x'>
                    <th colSpan='5'>{moment(blk.startTime).format('dddd MMMM Do')}</th>
                  </tr>
                  <tr>
                    <td className='noRightBorder medBig'>
                      <ExploreLinkBlock type='batch' keyword={keyword} />
                    </td>
                    {/*<td className='noRightBorder medBig numFont'>{keyword}</td>*/}
                    <td className='noRightBorder'>{what}</td>
                    <td className='noRightBorder numFont'>
                      <i className="fas fa-play fa-fw fa-xs greenT"></i> {mStart.format('hh:mm A')}
                    </td>
                    <td className='noRightBorder numFont'>
                      <i className="fas fa-stop fa-fw fa-xs redT"></i> {mStop ? mStop.format('hh:mm A') : '__:__ __'}
                    </td>
                    <td className='noRightBorder clean numFont'>
                      {mStop ? Math.round( moment.duration(mStop.diff(mStart)).asMinutes() ) : '_'} minutes
                    </td>
                    {/*
                    <td className='noRightBorder noCopy'>
                      <button
                        onClick={()=>jumpTo(keyword)}
                        className='textLinkButton'
                      ><i className='fas fa-paper-plane fa-fw'></i></button>
                    </td>
                    <td className='noRightBorder noCopy'>
                      <a href={elink}><i className='fas fa-rocket fa-fw'></i></a>
                    </td>
                    */}
                  </tr>
                </tbody>
              );
            }
            return(
              <tbody key={blk.tKey}>
                <tr>
                  <td className='noRightBorder medBig'>
                    <ExploreLinkBlock type='batch' keyword={keyword} />
                  </td>
                    {/*<td className='noRightBorder medBig numFont'>{keyword}</td>*/}
                  <td className='noRightBorder'>{what}</td>
                  <td className='noRightBorder numFont'>
                    <i className="fas fa-play fa-fw fa-xs greenT"></i> {mStart.format('hh:mm A')}
                  </td>
                  <td className='noRightBorder numFont'>
                    <i className="fas fa-stop fa-fw fa-xs redT"></i> {mStop ? mStop.format('hh:mm A') : '__:__ __'}
                  </td>
                  <td className='noRightBorder clean numFont'>
                    {mStop ? Math.round( moment.duration(mStop.diff(mStart)).asMinutes() ) : '_'} minutes
                  </td>
                  {/*
                  <td className='noRightBorder noCopy'>
                    <button
                      onClick={()=>jumpTo(keyword)}
                      className='textLinkButton'
                    ><i className='fas fa-paper-plane fa-fw'></i></button>
                  </td>
                  <td className='noRightBorder noCopy'>
                    <a href={elink}><i className='fas fa-rocket fa-fw'></i></a>
                  </td>
                  */}
                </tr>
              </tbody>
            );
          })
        }
      </table>
      }
      <p className='rightText'>
        <sup>i.</sup>Durations are rounded to the nearest minute
      </p>
    </div>
  );
};

export default ActivityPanel;