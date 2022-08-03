import React from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const ServeRemove = ({ id, serveKey, lockOut, name, opendates })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
  
  return(
    <ModelSmall
      button='Delete'
      title='Delete Service Pattern'
      color='redT'
      icon='fa-circle-minus'
      lock={!access || lockOut}>
      <ServeRemoveConfirm
        id={id}
        serveKey={serveKey}
        name={name}
        opendates={opendates}
      />
    </ModelSmall>
  );
};

export default ServeRemove;

const ServeRemoveConfirm = ({ id, serveKey, name, opendates })=> {
  
  function deleteService() {
    Meteor.call('removeServicePattern', id, serveKey, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Removed');
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  return(
    <div className='centre space'>
      <p>This <em>{name}</em> Service Pattern and the next service, {
        opendates?.map( (op, ix)=>(
          <em key={ix}>{moment(op.close).format('MMMM Do, YYYY')}, </em>
        )) || ''}will be deleted.</p>
      <p>Previous maintenance records will be retained.</p>
      <p>
        <button
          onClick={()=>deleteService()}
          title='Delete'
          className='action redSolid vmargin'
        >Yes, Delete</button>
      </p>
    </div>
  );
};