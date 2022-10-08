import React , { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';

import { MultiSelect } from "react-multi-select-component";
import ModelSmall from '/client/components/smallUi/ModelSmall';

const EquipEmailsManager = ({ id, stewards, users })=> {

  const access = Roles.userIsInRole(Meteor.userId(), ['peopleSuper','equipSuper','edit']);
  
  return(
    <ModelSmall
      button={`Set ${Pref.steward}s`}
      title={`Set ${Pref.steward}s`} 
      color='midnightblueT'
      icon='fa-users'
      lock={!access}
      primeTopRight={true}>
      <EquipEmails
        id={id}
        stewards={stewards}
        users={users}
      />
    </ModelSmall>
  );
};

export default EquipEmailsManager;


const EquipEmails = ({ id, stewards, users, selfclose })=> {
  
  const [ eList, eListSet ] = useState( [ { label: 'name', value: 'name' } ] );
  const [ emails, emailSet ] = useState( [] );

  useEffect( ()=>{
    const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
                                        !Roles.userIsInRole(x._id, 'readOnly') );
    const listUsers = Array.from(liveUsers, x => { return { label: x.username, value: x._id } } );
    eListSet(listUsers);
    
    const emDefault = listUsers.filter( x => (stewards || []).find( y => y === x.value ));
    emailSet(emDefault);
  }, []);
  
  function saveEmails(e) {
    e.preventDefault(e);
    
    const emailArray = Array.from(emails, u => u.value);

    if(emailArray) {
      Meteor.call('stewardEquipment', id, emailArray, (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        if(reply) {
          toast.success('Saved');
          selfclose();
        }else{
          toast.warning('Not Allowed');
        }
      });
    }else{
      null;
    }
  }
    
  
  return(
    <div className='centre vmarginhalf space'>
      <div className='min300 max500'>
        <form onSubmit={(e)=>saveEmails(e)}>
          <span>
            <div className='vmargin'>
              <label htmlFor='userSteward' className='emailForm'>Select {Pref.steward}s<br />
                <MultiSelect
                  id='userSteward'
                  options={eList}
                  value={emails}
                  onChange={(e)=>emailSet(e)}
                  labelledBy='Select people'
                  className='multi-select'
                  hasSelectAll={false}
                  disableSearch={false}
              /></label>
            </div>
          </span>
          <p className='centreText'> 
            <button
              type='submit'
              id='stewardSubmit'
              className='action nSolid'
             >Save {Pref.steward}s</button>
          </p>
        </form>
      </div>
    </div>
  );
};