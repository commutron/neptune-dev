import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import ModelMedium from '/client/layouts/Models/ModelMedium';

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
      
      <MadLibInput
        id='pName'
        tiptitle='Name'
        label='Service is commonly referred to as'
        sub='Should match references in instructions.'
      ><input
        type='text'
        id='pName'
        className='gap miniIn24'
        defaultValue={name}
        maxLength='64'
        minLength='1'
        onChange={(e)=>setName(e.target.value)}
        required />
      </MadLibInput>
      
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
        <MadLibInput
          id='pNext'
          tiptitle='Next Service'
          label='Next Service is due'
          sub='Future service will be counted from this day.'
        ><input
          type='date'
          id='pNext'
          className='gap miniIn18'
          defaultValue={next || new Date()}
          onChange={(e)=>setNext(e.target.value)}
          required 
        /></MadLibInput>
      }
      
      <MadLibInput
        id='pWhen'
        tiptitle='perform service when'
        label='Perform Service by'
        sub={timeSpan === 'month' ? 'Nonexistent days flow into the next month. For example, June 31st becomes July 1st.' : 
             `End of ${timeSpan} is determined by workweek and holidays schedule`}
      ><select
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
      </select></MadLibInput>
      
      <MadLibInput
        id='pPeriod'
        tiptitle='service period days'
        label='Workdays to Complete Service'
        sub='Service window opens this many days before due date.'
      ><input
        type='number'
        id='pPeriod'
        className='gap miniIn6'
        defaultValue={period}
        min={1}
        max={Math.max(0,timeSpan === 'day' ? recur : timeSpan === 'week' ? 7 - grace : 31 - grace)}
        inputMode='numeric'
        onChange={(e)=>setPeriod(Number(e.target.value))}
        required
      /></MadLibInput>
      
      <MadLibInput
        id='pGrace'
        tiptitle='late/grace workdaysdays'
        label='Workdays Grace after due'
        sub='After the grace period an incomplete service is considered missed.'
      ><input
        type='number'
        id='pGrace'
        className='gap miniIn6'
        defaultValue={grace}
        min={0}
        max={Math.max(0, timeSpan === 'day' ? recur - period :
             timeSpan === 'week' ? ( recur * 5  ) - period :
             timeSpan === 'month' ? ( recur * 20  ) - period : 60)}
        inputMode='numeric'
        onChange={(e)=>setGrace(Number(e.target.value))}
        required 
      /></MadLibInput>
      
      <p className='medSm centreText'
      >Service window will be open for <n-num>{period + grace}</n-num> workdays. Overlaping Service windows may cause errors.</p>
      
      {serveKey && servicing ?
        <p className='medSm centreText darkOrangeT'
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

const MadLibInput = ({ id, tiptitle, label, sub, children })=> (
  <p>
    <span>
      <label htmlFor={id} title={tiptitle}>{label}{children}</label>
      <span className='block max400 vmarginquarter'>
        <n-sm>{sub}</n-sm>
      </span>
    </span>
  </p>
);