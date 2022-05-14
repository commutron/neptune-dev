import React, { useState, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

import TimesEdit from '/client/components/forms/LocaleTime';

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
      if( moment( testDate ).isWorkingDay() ) {
        toast.info(`${dateState} IS a workday`);
      }else{
        toast(`${dateState} is NOT a workday`);
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
        <div className='overscroll'>
        
          <h3>Working Hours</h3>
          <TimeObjMap timeObj={app.workingHours || {}} />
          {isAdmin &&
            <TimesEdit
              key='S3TW0RK'
              setFunc='setWorkTimes'
              idpre='work'
              defaultObj={app.workingHours || {}}
            />
          }
          
          <hr className='vmargin' />
          
          <h3>Shipping Hours</h3>
          <TimeObjMap timeObj={app.shippingHours || {}} />
          {isAdmin &&
            <TimesEdit
              key='S3TSH1P'
              setFunc='setShipTimes'
              idpre='ship'
              defaultObj={app.shippingHours || {}}
            />
          }
          
          <hr className='vmargin' />
      
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
          
          <hr className='vmargin' />
        
          <h3>Next Year Fixed Date Holidays</h3>
          <dl>
            {farList.map( (e, i)=>{
              return( 
                <dd key={i+'hld'} className='vmarginhalf'
                  >{moment(e, 'YYYY-MM-DD').format('dddd MMMM  Do YYYY')}
                </dd> );
              })
            }
          </dl>
          
          <hr className='vmargin' />
        </div>
        
        <div className='overscroll'>
      
          <h3>{isAuth ? 'Set Holiday' : 'Test'} Day</h3>
          
          <div className='vspace balance'>
            <Flatpickr
              onChange={(e)=>handleDateChange(e)}
              options={{
                dateFormat: "Y-m-d",
                defaultDate: new Date(),
              }} />
              
            <button 
              className='smallAction nHover'
              onClick={()=>handleTest()}
            >Test {dateState}</button>
          </div>
        
          {isAuth ?
          <Fragment>
            <div className='vspace balance'>
              <button 
                className='action greenSolid'
                onClick={()=>handleAdd(true)}
                disabled={!isAuth}>Add {wildState}
              </button>
              
              <button 
                className='action greenSolid'
                onClick={()=>handleAdd(false)}
                disabled={!isAuth}>Add {dateState}
              </button>
            </div>
      
            <div className='vspace balance'>
              <button
                className='action redSolid'
                onClick={()=>handleRemove(true)}
                disabled={!isAuth || noRmv}>Remove {wildState}
              </button>
            
              <button
                className='action redSolid'
                onClick={()=>handleRemove(false)}
                disabled={!isAuth || noRmv}>Remove {dateState}
              </button>
            </div>
            
            <p className='small grayT centreText'
            >removing former holidays will create inacurate on time / late calculations
            </p>
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
          </details>
        </div>
      </div>
            
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