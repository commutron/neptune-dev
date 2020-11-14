import React, { useState, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import * as ShipTime from '/client/utility/ShipTime.js';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
//import Pref from '/client/global/pref.js';

// const clientTZ = moment.tz.guess();

const ScheduleSlide = ({ app, user, users, isAdmin, isPeopleSuper })=> {
  
  const now = moment().format('YYYY-MM-DD');
  const nArr = now.split('-');
  const nString = '*' + '-' + nArr[1] + '-' + nArr[2];
    
  const [ dateState, dateSet ] = useState(now);
  const [ wildState, wildSet ] = useState(nString);
  
  function handleDateChange(e) {
    const dateString = moment(e[0]).format('YYYY-MM-DD');
    const dArr = dateString.split('-');
    const wildString = '*' + '-' + dArr[1] + '-' + dArr[2];
    dateSet(dateString);
    wildSet(wildString);
  }
  
  function handleTest() {
    const testDate = dateState;
    const nonWorkDays = app.nonWorkDays;
    if( Array.isArray(nonWorkDays) ) {  
      moment.updateLocale('en', {
        holidays: nonWorkDays
      });
      if( moment( testDate ).isWorkingDay() ) {
        toast.info(`${dateState} IS a workday`);
      }else{
        toast(`${dateState} is NOT a workday`);
      }
    }
  }
  
  function handleAdd(wild) {
    const newDate = !wild ? dateState : wildState;
    Meteor.call('addNonWorkDay', newDate, (err, re)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  function handleRemove(wild) {
    const badDate = !wild ? dateState : wildState;
    Meteor.call('removeNonWorkDay', badDate, (err, re)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  function handleReset() {
    const check = window.confirm('Permanently Delete All Days??');
    if(check) {
      Meteor.call('resetNonWorkDay', (err, re)=>{
        err && console.log(err);
        console.log(_.itr(re));
      });
    }
  }
  
  const nWD = app.nonWorkDays || [];
  const sortList = nWD.sort();
  const nowYear = moment().year();
  const nxtList = nWD.map( e => { return e.replace('*', nowYear ) });
  const farWld = nWD.filter( e => e.startsWith('*'));
  const frList = farWld.map( e => { return e.replace('*', nowYear + 1 ) });
 
  const nextList = nxtList.filter( x => 
                        moment(x, 'YYYY-MM-DD').isAfter(new Date()) ).sort();
  const farList = frList.filter( x => 
                        moment(x, 'YYYY-MM-DD').isAfter(new Date()) ).sort();
  
  const isAuth = isPeopleSuper || isAdmin;
  
  const noRmv = moment(dateState, 'YYYY-MM-DD').isBefore(new Date()) && !isAdmin;
  
  return(
    <div className='space5x5'>
      
      <div className='comfort'>
        <div>
          <h3>Working Hours</h3>
          <TimeObjMap timeObj={ShipTime.workingHours} />
        </div>
        
        <div>
          <h3>Shipping Hours</h3>
          <TimeObjMap timeObj={ShipTime.shippingHours} />
        </div>
      </div>
      <p className='small grayT rightText'
        >workinghours and shippinghours objects are hard coded and not user adjustable
      </p>
      
      <hr className='vmargin' />
      
      <div className='comfort'>
        <div>
          <h3>Upcoming Holidays</h3>
          <dl>
            {nextList.map( (e, i)=>{
              return( 
                <dd key={i+'hld'} className='vmarginhalf'
                  >{moment(e, 'YYYY-MM-DD').format('dddd MMMM  Do YYYY')}
                </dd> );
              })
            }
          </dl>
        </div>
        
        <div>
          <h3>Next Year Holidays</h3>
          <dl>
            {farList.map( (e, i)=>{
              return( 
                <dd key={i+'hld'} className='vmarginhalf'
                  >{moment(e, 'YYYY-MM-DD').format('dddd MMMM  Do YYYY')}
                </dd> );
              })
            }
          </dl>
        </div>
      </div>
      
      <hr className='vmargin' />
      
      <h3>{isAuth ? 'Set Holiday' : 'Test'} Day</h3>
          
        <div className='vspace balance'>
          <Flatpickr
            onChange={(e)=>handleDateChange(e)}
            options={{
              dateFormat: "Y-m-d",
              defaultDate: new Date(),
            }} />
            
          <button 
            className='action clearBlue'
            onClick={()=>handleTest()}
          >Test {dateState}</button>
        </div>
        
        {isAuth ?
        <Fragment>
          <div className='vspace balance'>
            
            <button 
              className='action clearGreen'
              onClick={()=>handleAdd(false)}
              disabled={!isAuth}>Add {dateState}</button>
            
            <button
              className='action clearRed'
              onClick={()=>handleRemove(false)}
              disabled={!isAuth || noRmv}>Remove {dateState}</button>
          
          </div>
      
          <div className='vspace balance'>
              
            <button 
              className='action clearGreen'
              onClick={()=>handleAdd(true)}
              disabled={!isAuth}>Add {wildState}</button>
            
            <button
              className='action clearRed'
              onClick={()=>handleRemove(true)}
              disabled={!isAuth || noRmv}>Remove {wildState}</button>
            
          </div>
        </Fragment>
        :
        <p className='small grayT rightText'
          >adjusting holiday days requires 'Admin' or 'PeopleSuper' access
        </p>
        }
      
      <hr className='vmargin' />
      
      <details>
        <summary>All recorded holidays</summary>
        <ul>
        {sortList.map( (e, i)=>{
            return( <li key={i}>{e}</li> );
          })
        }
        </ul>
        
        <hr />
        
        <button
          className='action clearBlack'
          onClick={()=>handleReset()}
            disabled={!isAdmin}>RESET ALL</button>
      </details>  
            
    </div>
  );
};

export default ScheduleSlide;


const TimeObjMap = ({timeObj})=> (
  <Fragment>
    {_.pairs(timeObj).map( (entry, index)=>{
      if(!entry[1]) {
        return(
          <p key={index+'day'} className='comfort'>
            <b>{moment(index, 'd').format('dddd')}&nbsp;&nbsp;</b>
          </p>
        );
      }else{
      return(
        <p key={index+'day'} className='comfort'>
            <b>{moment(index, 'd').format('dddd')}&nbsp;&nbsp;</b>
          <i>
          {entry[1].map( (ent, ix)=>{
            const j = ix == entry[1].length-1 ? '' :
                        ix % 2 == 0 ? ' to ' : ' and ';
            return(
            <i key={ix+'time'}>{moment(ent, 'kk:mm:ss').format('h:mm a')}<small>{j}</small></i>
            )})}
            </i>
        </p>
      );
    }})}
  </Fragment>
);