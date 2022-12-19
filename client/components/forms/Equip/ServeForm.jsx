import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const ServeFormWrapper = ({ 
  id, service,
  lockOut, servicing
})=> {
  const bttn = service ? 'Edit' : 'Add Service';
  const title = service ? 'Edit Service Pattern' : 'Add Service Pattern';
  
  const access = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);

  return(
    <ModelMedium
      button={bttn}
      title={title}
      color='midnightblueT'
      icon='fa-calendar-check'
      lock={!access || lockOut}
    >
      <ServeForm 
        id={id}
        serveKey={service?.serveKey}
        svName={service?.name || ''}
        svTime={service?.timeSpan || 'day'}
        svPivot={service?.whenOf !== undefined ? service.whenOf : 'endOf'}
        svNext={service?.nextAt || undefined}
        svRecur={service?.recur || 1}
        svPeriod={service?.period || 1}
        svGrace={typeof service?.grace === 'number' ? service.grace : 0}
        servicing={servicing}
      />
    </ModelMedium>
  );
};

export default ServeFormWrapper;

const ServeForm = ({ 
  id, serveKey, svName, svTime, svPivot, svNext, svRecur, svPeriod, svGrace, 
  servicing, selfclose
})=> {
  
  const [ name, setName ] = useState(svName);
  const [ timeSpan, setTime ] = useState(svTime);
  const [ pivot, setPivot ] = useState(svPivot);
  const [ next, setNext ] = useState(svNext);
  const [ recur, setRecur ] = useState(svRecur);
  const [ period, setPeriod ] = useState(svPeriod);
  const [ grace, setGrace ] = useState(svGrace);
  
  useEffect( ()=>{
    if(next && recur > 1) {
      if(timeSpan === 'week') {
        setPivot( Number( moment(next, 'YYYY-MM-DD').day() ) );
      }else if(timeSpan === 'month') {
        setPivot( Number( moment(next, 'YYYY-MM-DD').date() ) );
      }else if(timeSpan === 'year') {
        setPivot( Number( moment(next, 'YYYY-MM-DD').month() ) );
      }else{
        setPivot('endOf');
      }
    }else{
      setPivot(svPivot);
    }
  }, [next, timeSpan]);
  
  function saveService(e) {
    e.preventDefault();

    const nextStr = !next ? moment().format('YYYY-MM-DD') : next;
    
    if(serveKey) {
      Meteor.call('editServicePattern', id, serveKey, name, timeSpan, pivot, nextStr, recur, period, grace,
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
      Meteor.call('addServicePattern', id, name, timeSpan, pivot, nextStr, recur, period, grace,
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
          <label htmlFor='pName' title='Name'>Service is commonly referred to as
          <input
            type='text'
            id='pName'
            className='gap miniIn24'
            defaultValue={name}
            maxLength='64'
            minLength='1'
            onChange={(e)=>setName(e.target.value)}
            required /></label>
        </span>
        <span className='block max400 vmarginquarter'>
          <n-sm>Should match references in instructions.</n-sm>
        </span>
      </p>
      
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
            inputMode='numeric'
            onChange={(e)=>setRecur(Number(e.target.value))}
            required /></label>
          <label htmlFor='pTime' title='time span'><select
            id='pTime'
            className='miniIn10'
            defaultValue={timeSpan}
            onChange={(e)=>{setTime(e.target.value)}}
            required>
            <option value='day'>Day{recur > 1 ? 's' : ''}</option>
            <option value='week'>Week{recur > 1 ? 's' : ''}</option>
            <option value='month'>Month{recur > 1 ? 's' : ''}</option>
            <option value='year'>Year{recur > 1 ? 's' : ''}</option>
          </select></label>
        </span>
      </p>
      
      {recur > 1 &&
        <p>
          <span>
            <label htmlFor='pNext' title='Next Service'>Next Service is due
            <input
              type='date'
              id='pNext'
              className='gap miniIn18'
              defaultValue={next || new Date()}
              onChange={(e)=>setNext(e.target.value)}
              required 
            /></label>
            <span className='block max400 vmarginquarter'>
              <n-sm>Future service will be counted from this day.</n-sm>
            </span>
          </span>
        </p>
      }
      
      <p>
        <span>
          <label htmlFor='pWhen' title='perform service when'>Perform Service by
          <select
            id='pWhen'
            className='gap miniIn18'
            value={pivot}
            onChange={(e)=>setPivot(e.target.value === 'startOf' || e.target.value === 'endOf' ? e.target.value : Number(e.target.value))}
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
          {timeSpan === 'month' &&
          <span className='block max400 vmarginquarter'>
            <n-sm> Nonexistent days flow into the next month. For example, June 31st becomes July 1st.</n-sm>
          </span>}
        </span>
      </p>
      
      <p>
        <span>
          <label htmlFor='pPeriod' title='service period days'>Workdays to Complete Service 
          <input
            type='number'
            id='pPeriod'
            className='gap miniIn6'
            defaultValue={period}
            min={1}
            max={timeSpan === 'day' ? recur : timeSpan === 'week' ? 7 : 31}
            inputMode='numeric'
            onChange={(e)=>setPeriod(Number(e.target.value))}
            required
          /></label>
        </span>
        <span className='block max400 vmarginquarter'>
          <n-sm>Eg. If service is due Friday and has two days to complete then service is from the start of Thursday to the end of Friday.</n-sm>
        </span>
      </p>
      
      <p>
        <span>
          <label htmlFor='pGrace' title='late/grace workdaysdays'>Workdays Grace after due
          <input
            type='number'
            id='pGrace'
            className='gap miniIn6'
            defaultValue={grace}
            min={0}
            max={timeSpan === 'day' ? recur - period :
                 timeSpan === 'week' ? ( recur * 5  ) - period :
                 timeSpan === 'month' ? ( recur * 20  ) - period : 60}
            inputMode='numeric'
            onChange={(e)=>setGrace(Number(e.target.value))}
            required /></label>
        </span>
        <span className='block max400 vmarginquarter'>
          <n-sm>After the grace period an incomplete service is considered missed.</n-sm>
        </span>
      </p>
      
      {serveKey && servicing ?
        <p className='medSm centreText'
        >Editing this service pattern will alter an open service window.</p>
      : null}
      
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