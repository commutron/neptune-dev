import React, { useState, Fragment } from 'react';
// import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const ServeFormWrapper = ({ 
  id, service,
  lockOut
})=> {
  const bttn = service ? 'Edit' : 'Add Service';
  const title = service ? 'Edit Service Pattern' : 'Add Service Pattern';
  
  const access = Roles.userIsInRole(Meteor.userId(), 'edit');

  return(
    <ModelMedium
      button={bttn}
      title={title}
      color='blueT'
      icon='fa-calendar-check'
      lock={!access || lockOut}
    >
      <ServeForm 
        id={id}
        serveKey={service?.serveKey}
        svTime={service?.timeSpan || 'day'}
        svPivot={service?.whenOf || 'endOf'}
        svRecur={service?.recur || 1}
        svPeriod={service?.period || 1}
        svGrace={service?.grace || 1}
      />
    </ModelMedium>
  );
};

export default ServeFormWrapper;

const ServeForm = ({ id, serveKey, svTime, svPivot, svRecur, svPeriod, svGrace, selfclose })=> {
  
  const [ timeSpan, setTime ] = useState(svTime);
  const [ pivot, setPivot ] = useState(svPivot);
  const [ recur, setRecur ] = useState(svRecur);
  const [ period, setPeriod ] = useState(svPeriod);
  const [ grace, setGrace ] = useState(svGrace);
  
  
  function saveService(e) {
    e.preventDefault();

    const rightyear = new Date().getMonth() > 1 ? new Date().getFullYear() + 1 : new Date().getFullYear();
    const rightmonth = pivot === 'startOf' ? 1 : pivot === 'endOf' ? 12 : pivot + 1;
    const truePeriod = timeSpan === 'year' ? new Date(rightyear, rightmonth, 0).getDate() : period;
  
    if(serveKey) {
      Meteor.call('editServicePattern', id, serveKey, timeSpan, pivot, recur, truePeriod, grace,
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          selfclose();
        }else{
          toast.error('Server Error');
        }
      });
    }else{
      Meteor.call('addServicePattern', id, timeSpan, pivot, recur, truePeriod, grace,
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('Saved');
          selfclose();
        }else{
          toast.error('Server Error');
        }
      });
    }
  }


  return(
    <form id='setServicePattern' className='fitWide' onSubmit={(e)=>saveService(e)}>
      <p>
        <span>
          <label htmlFor='pRecur' title='frequency'>Repeat Service once every 
          <input
            type='number'
            id='pRecur'
            className='gap miniIn6'
            defaultValue={recur}
            min={1}
            max={52}
            onChange={(e)=>setRecur(Number(e.target.value))}
            required /></label>
          <label htmlFor='pTime' title='time span'><select
            id='pTime'
            className='miniIn10'
            defaultValue={timeSpan}
            onChange={(e)=>{setTime(e.target.value);setPivot('endOf')}}
            required>
            <option value='day'>Day{recur > 1 ? 's' : ''}</option>
            <option value='week'>Week{recur > 1 ? 's' : ''}</option>
            <option value='month'>Month{recur > 1 ? 's' : ''}</option>
            <option value='year'>Year{recur > 1 ? 's' : ''}</option>
          </select></label>
        </span>
      </p>
      
      <p>
        <span>
          <label htmlFor='pWhen' title='perform service when'>Perform Service by
          <select
            id='pWhen'
            className='gap miniIn18'
            value={pivot}
            onChange={(e)=>setPivot(Number(e.target.value))}
            required>
            <option value='startOf'>Start of the {timeSpan}</option>
            <option value='endOf'>End of the {timeSpan}</option>
            {timeSpan === 'week' ?
              <Fragment>
                {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
                .map( (day, index)=>(
                  <option key={'w'+index} value={index}>{day}</option>
                ))}
              </Fragment>
            : timeSpan === 'month' ?
              <Fragment>
                {["1st","2nd","3rd","4th","5th","6th", "7th", "8th", "9th", "10th",
                "11th","12th","13th","14th","15th","16th", "17th", "18th", "19th", "20th",
                "21st","22nd","23rd","24th","25th","26th", "27th", "28th", "29th", "30th", "31st"]
                .map( (date, index)=>(
                  <option key={'d'+index} value={index+1}>{date} of the month</option>
                ))}
              </Fragment>
            : timeSpan === 'year' ?
              <Fragment>
                {["January","Febuary","March","April","May","June",
                "July","August","September","October","November","December"]
                .map( (month, index)=>(
                  <option key={'m'+index} value={index}>{month}</option>
                ))}
              </Fragment>
            : null}
          </select></label>
        </span>
      </p>
      
      {timeSpan === 'month' && 
      <p className='max300 vmarginquarter'>
        <n-sm>Nonexistent days flow into the next month. For example, June 31st becomes July 1st.</n-sm>
      </p>
      } 
      
      <p>
        <span>
          <label htmlFor='pPeriod' title='service period days'>Workdays to Complete Service 
          {timeSpan === 'year' ? <strong> All Month</strong> :
          <input
            type='number'
            id='pPeriod'
            className='gap miniIn6'
            defaultValue={period}
            min={1}
            max={timeSpan === 'day' ? 1 : timeSpan === 'week' ? 7 : 31}
            onChange={(e)=>setPeriod(Number(e.target.value))}
            required />
          }</label>
        </span>
      </p>
      
      <p>
        <span>
          <label htmlFor='pGrace' title='late grace days'>Workdays late before alert
          <input
            type='number'
            id='pGrace'
            className='gap miniIn6'
            defaultValue={grace}
            min={1}
            max={7}
            onChange={(e)=>setGrace(Number(e.target.value))}
            required /></label>
        </span>
      </p>
      
      <p>
        <span className='centre'>
          <button
            type='submit'
            id='srvpttrnSave'
            className='action nSolid'
            >Save
          </button>
        </span>
      </p>
    </form>
  );
};