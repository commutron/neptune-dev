import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { HolidayCheck } from '/client/utility/WorkTimeCalc.js';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import TideDayMini from '/client/components/charts/Tides/TideDayMini';
import TabsLite from '/client/components/smallUi/Tabs/TabsLite';
import PeopleScatter from '/client/components/charts/BatchBurn/PeopleScatter';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';
import UserNice from '/client/components/smallUi/UserNice';

const HistorySlide = ({ app, user, users, traceDT, isDebug })=> {
  
  const [dateString, setDateString] = useState(moment().format('YYYY-MM-DD'));
  const [dayData, setDayData] = useState(false);
  
  function getData() {
    setDayData(false);
    Meteor.call('fetchOrgTideActivity', dateString, (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=>
              x1.startTime < x2.startTime ? 1 : x1.startTime > x2.startTime ? -1 : 0 );
      setDayData(cronoTimes);
	  });
  }
  
  useEffect(() => {
    getData();
    isDebug && console.log(dayData);
  }, [dateString]);
  
  function setDay(input) {
    const date = moment(input[0]).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    setDateString(date);
  }
  
  let minDate = moment(app.tideWall || app.createdAt).format('YYYY-MM-DD');
  
  const localDate = moment.tz(dateString, moment.tz.guess());
  const isHoliday = HolidayCheck( app, moment(dateString, 'YYYY-MM-DD').format());
  
  return(
    <div className='space5x5 overscroll'>
      <div className='vbreak comfort beside gapminC'>
        <div className='line15x'>
          <Flatpickr
            value={moment().format('YYYY-MM-DD')}
            onChange={(e)=>setDay(e)}
            required
            options={{
              dateFormat: "Y-m-d",
              defaultDate: moment().format("YYYY-MM-DD"),
              minDate: minDate,
              maxDate: moment().format("YYYY-MM-DD"),
              altInput: true,
              altFormat: "F J",
            }} />
            <br />
            <span className='biggester breath numFont'
              > {localDate.year()}<sub>d</sub>{localDate.dayOfYear()} </span>
            <br />
            {isHoliday ? <span className='bigger line05x'>Holiday</span> : null}
        </div>
      
        <TideDayMini
          tideTimes={dayData || []}
          timeSpan='day'
          dateTime={moment(dateString, 'YYYY-MM-DD').format()}
          showUser={true}
          app={app}
          users={users} />
      
      </div>
      {!dayData ?
        <CalcSpin />
      :
      dayData.length === 0 ?
        <div>
          <p className='centreText'><i className="fas fa-ghost fa-3x grayT fade"></i></p>
          <p className='centreText line3x'>No activity on this day</p>
        </div>
      :
      <TabsLite 
        tabs={ [ 
          <i className="fas fa-running fa-lg fa-fw"></i>,
          <i className="fas fa-clipboard-list fa-lg fa-fw"></i>,
          <i className="fas fa-bars fa-lg fa-fw"></i>,
        ] }
        names={[ 
          'Distribution', 'Tasks', 'All Entries'
        ]}
      >
        <TidePeoplePlot
          tide={dayData}
          isDebug={isDebug} 
          app={app} 
        />
        
        <TideTaskCols 
          tide={dayData}
          traceDT={traceDT}
        />
          
        <table className='wide cap space'>
          <tbody>
          {dayData.map( (blk, index)=>{
            const keyword = blk.batch;
            const project = blk.project;
            const equip = project?.split(" ~ ")?.[0]?.split("-")[1];
            const maint = blk.type === 'MAINT';
            const eqfix = blk.type === 'EQFX';
            
            const moreInfo = maint ? false : traceDT?.find( x => x.batch === blk.batch);
            const what = eqfix ? '' :
                    maint ? (project?.split(" ~ ")?.[1]?.split("<*>")?.[0] || 'Scheduled')
                            + ' Service' : moreInfo?.isWhat.join(' ') || 'unavailable';
            const rad = maint ? null : moreInfo?.rad || null;
            
            const lastStart = dayData[index-1] && dayData[index-1].startTime;
            
            if(index === 0 || moment(blk.startTime).isSame(lastStart, 'hour') === false) {
              return(
                <Fragment key={blk.tKey+index}>
                  <tr key={blk.startTime.toISOString()} className='medBig leftText line4x'>
                    <th colSpan='4'>{moment(blk.startTime).format('h A')}</th>
                  </tr>
                  <TidePlainRow
                    key={blk.tKey}
                    batch={keyword}
                    describe={what}
                    rad={rad}
                    equip={equip}
                    tBlock={blk} />
                </Fragment>
              );
            }else{
              return(
                <TidePlainRow
                  key={blk.tKey}
                  batch={keyword}
                  describe={what}
                  rad={rad}
                  equip={equip}
                  tBlock={blk} />
              );
          }})}
          </tbody>
        </table>
      
      </TabsLite>
      }
      <div className='fadeMore vmargin nopmargin'>
        <p><sup>i.</sup>Times are displayed for timezone: {moment.tz.guess()}</p>
        <p><sup>ii.</sup>Task is from direct user input only</p>
        <p><sup>iii.</sup>Durations are rounded to the nearest minute</p>
      </div>
    </div>
  );
};

export default HistorySlide;

const TidePeoplePlot = ({ tide, isDebug, app })=> {
  
  const [ hrs, hrsSet ] = useState([]);
  
  useEffect( ()=>{
    let hoursTide = [];
    for(let t of tide) {
      const strt = moment(t.startTime).hour();
      const stop = moment(t.stopTime || new Date()).hour();
      const dhrs = stop >= strt ? Math.abs(stop - strt) : Math.abs((24 + stop) - strt);
      for(let i = dhrs; i > -1; i--) {
        hoursTide.push({
          startTime: moment(t.startTime).add(i, 'hours').format(),
          who: t.who
        });
      }
    }
    hrsSet(hoursTide);
  }, [tide]);

  return(
    <PeopleScatter 
      tide={hrs}
      period='hour'
      xlabel='hh:mma'
      isDebug={isDebug} 
      app={app} 
    />
  );
};

const TideTaskCols = ({ tide, traceDT })=> {
  
  const userList = [...new Set( Array.from(tide, x => x.who ) )]
                      .sort((u1, u2)=> u1 > u2 ? 1 : u1 < u2 ? -1 : 0 );
                      
  const batchList = [...new Set( Array.from(tide, x => x.batch ) )].filter(f=>f)
                      .sort((b1, b2)=> b1 > b2 ? 1 : b1 < b2 ? -1 : 0 );
                      
  const maintList = [...new Set( Array.from(tide, x => x.project?.split(" ~ ")?.[0]?.split("-")[1] ) )].filter(f=>f)
                      .sort((b1, b2)=> b1 > b2 ? 1 : b1 < b2 ? -1 : 0 );
                      
  const taskList = [...new Set( Array.from(tide, x => x.task ) )]
                    .filter(f=>f)
                    .sort((t1, t2)=> t1 > t2 ? 1 : t1 < t2 ? -1 : 0 );

  return(
    <div className='autoGrid'>
            
      <span className='space1v centre'>
        <h4>{userList.length} People</h4>
        <dl className='readlines'>
          {userList.map( (w, ix)=>(
            <dt key={w+ix}>
              <UserNice id={w} />
            </dt>
          ))}
        </dl>
      </span>
        
      <span className='space1v centre'>
        <h4>{batchList.length} {Pref.XBatchs}</h4>
        <dl className='readlines'>
          {batchList.map( (ent, ix)=>{
            const moreInfo = traceDT ? traceDT.find( x => x.batch === ent) : false;
            const what = moreInfo ? moreInfo.isWhat.join(' ') : 'unavailable';
            const rad = moreInfo ? moreInfo.rad : null;
            return(
              <dt key={ent+ix} className='rightRow doJustWeen'>
                <ExploreLinkBlock type='batch' keyword={ent} rad={rad} /> 
                <em className='rightText'>{what}</em>
              </dt>
          )})}
        </dl>
      </span>
      
      <span className='space1v centre'>
        <h4> {taskList.length} Known Tasks</h4>
        <dl className='readlines'>
          {taskList.map( (ent, ix)=>(
            <dt key={ent+ix}>{ent}</dt>
          ))}
        </dl>
      </span>
      
      <span className='space1v centre'>
        <h4> {maintList.length} Serviced</h4>
        <dl className='readlines'>
          {maintList.map( (eq, iq)=>(
            <dt key={eq+iq} className='rightRow doJustWeen'>
              <ExploreLinkBlock type='equip' keyword={eq} /> 
            </dt>
          ))}
        </dl>
      </span>
      
    </div>
  );
};

const TidePlainRow = ({ 
  batch, describe, equip, rad, tBlock
})=> {
  
  const tideWho = tBlock.who;
  const durrAsMin = tBlock.durrAsMin;
  const task = tBlock.task;
  const stsk = tBlock.subtask;
  
  const mStop = tBlock.stopTime && moment(tBlock.stopTime);
  
  return(
    <tr className='smTxt'>
      <td className='noRightBorder'><UserNice id={tideWho} /></td>
      
      <td className='noRightBorder'>
        {equip ?
          <ExploreLinkBlock type='equip' keyword={equip} /> :
          <ExploreLinkBlock type='batch' keyword={batch} rad={rad} />
        }
      </td>
      
      <td className='noRightBorder'>{describe}</td>
      
      <td className='noRightBorder timeInputs'>
        {task ? task + ( stsk ? ', ' + stsk : '') : '   '}
      </td>
      
      <td className='noRightBorder clean numFont rightText'>
        {tBlock.focus && <i className='fa-regular fa-clone fa-fw gapR tealT' 
          title={`Multi-tasking ${tBlock.focus} ${Pref.xBatchs}`}>
        </i>}
        {mStop ? Math.round( durrAsMin ) : '...'} minutes
      </td>
      
    </tr>
  );
};