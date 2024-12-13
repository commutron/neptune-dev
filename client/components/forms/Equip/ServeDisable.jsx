import React from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import ModelSmall from '/client/layouts/Models/ModelSmall';

const ServeDisable = ({ id, serveKey, name, disable, lockOut, opendates })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
  
  return(
    <ModelSmall
      button={disable ? 'Enable' : 'Disable'}
      title={disable ? 'Enable Service Pattern' : 'Disable Service Pattern'}
      color={disable ? 'greenT' : 'yellowT'}
      icon={disable ? 'fa-calendar-check' : 'fa-calendar-xmark'}
      lock={!access || lockOut}
      wrapIcon={disable}>
      <ServeDisableConfirm
        id={id}
        serveKey={serveKey}
        name={name}
        disable={disable}
        opendates={opendates}
      />
    </ModelSmall>
  );
};

export default ServeDisable;

const ServeDisableConfirm = ({ id, serveKey, name, disable, opendates, selfclose })=> {
  
  function toggleService() {
    const able = !disable;
    Meteor.call('disEnAbleServicePattern', id, serveKey, able, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Not Allowed');
      }
      selfclose();
    });
  }
  
  if(disable) {
    return(
      <div className='centre space'>
        <p>Enable this <strong>{name}</strong> service pattern and schedule future service events?</p>
        <p>
          <button
            onClick={()=>toggleService()}
            title='Delete'
            className='action greenSolid vmargin'
          >Yes, Enable</button>
        </p>
      </div>
    );
  }
  
  return(
    <div className='centre space'>
      <p>Disable this <strong>{name}</strong> service pattern?</p>
      <p>The next service, {
        opendates?.map( (op, ix)=>(
          <em key={ix}>{moment(op.close).format('MMMM Do, YYYY')}, </em>
        )) || ''}will be deleted.</p>
      <p>Previous maintenance records will be retained.</p>
      <p>
        <button
          onClick={()=>toggleService()}
          title='Delete'
          className='action yellowSolid vmargin'
        >Yes, Disable</button>
      </p>
    </div>
  );
};