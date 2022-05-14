import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';
import { toCap } from '/client/utility/Convert';

const GroupHibernateWrapper = ({ id, hState, noText, primeTopRight })=> {
  const actTtl = !hState ? toCap(Pref.hibernatate) + ' ' + Pref.group : 
                           'Un' + Pref.hibernatate + ' ' + Pref.group;
  
  const access = Roles.userIsInRole(Meteor.userId(), 'edit');
  const aT = !access ? Pref.norole : '';
  const title = access ? actTtl : aT;
  
  return(
    <ModelSmall
      button={Pref.hibernatate}
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
        toast.warning(`Not ${Pref.hibernatated}. Live ${Pref.variants} found`);
      }
    });
  }

  if(!hState) {
    return(
      <div className='centre'>
        <p>{toCap(Pref.hibernatated)} {Pref.group} will be hidden from some lists and some actions will be disabled.</p>
        <p>NO {Pref.group} data will be deleted.</p>
        <p>
          <button
            className='action blackSolid'
            onClick={(e)=>handleHibernate(e)}
          >{Pref.hibernatate} {Pref.group}</button>
        </p>
      </div>
    );
  }
  
  return(
    <div className='centre'>
      <p>{toCap(Pref.hibernatate)} flag will be removed from {Pref.group}</p>
      <p>
        <button
          className='action nSolid'
          onClick={(e)=>handleHibernate(e)}
        >Un{Pref.hibernatate} {Pref.group}</button>
      </p>
    </div>
  );
};
