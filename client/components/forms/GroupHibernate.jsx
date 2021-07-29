import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '../smallUi/ModelSmall';

const GroupHibernateWrapper = ({ id, hState, noText, primeTopRight })=> {
  const actTtl = !hState ? `Hibernate ${Pref.group}` : 
                           `Wake Up ${Pref.group} from hibernation`;
  
  const access = Roles.userIsInRole(Meteor.userId(), 'edit');
  const aT = !access ? Pref.norole : '';
  const title = access ? actTtl : aT;
  
  return(
    <ModelSmall
      button='Hibernation'
      title={title}
      color='grayT'
      icon='fa-archive'
      lock={!access}
      noText={noText}
      primeTopRight={primeTopRight}>
      <GroupHibernate
        id={id}
        hState={hState}
      />
    </ModelSmall>
  );
};

export default GroupHibernateWrapper;

const GroupHibernate = ({ id, hState, selfclose })=> {

  function handleHibernate(e) {
    Meteor.call('hibernateGroup', id, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
        selfclose();
      }else{
        toast.warning(`Not hibernated. Live ${Pref.variants} found`);
      }
    });
  }

  if(!hState) {
    return(
      <div className='centre'>
        <p>Hibernatation will disable some actions and hide the {Pref.group} from some lists.</p>
        <p>NO {Pref.group} data will be deleted.</p>
        <p>
          <button
            className='action clearBlack'
            onClick={(e)=>handleHibernate(e)}
          >Hibernatate {Pref.group}</button>
        </p>
      </div>
    );
  }
  
  return(
    <div className='centre'>
      <p>Hibernatation flag will be removed from {Pref.group}</p>
      <p>
        <button
          className='action clearBlue'
          onClick={(e)=>handleHibernate(e)}
        >Wakeup {Pref.group}</button>
      </p>
    </div>
  );
};
