import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
import Spin from '../components/uUi/Spin.jsx';

const InitialSetup = ({ ready, option })=> {
  
  function hndlSet() {
    Meteor.call('addFirstSetting', (err, reply)=>{
      if (err)
        console.log(err);
      if(reply) {
        toast.success('Success');
      }else{
        toast.error('ERROR');
      }
    });
  }
  
  function hndlFirstUser() {
    let options = {username: 'devMaster', password: 'firefly'};
    	Accounts.createUser(options, (error)=>{
    		if(error) {
    			console.log(error);
    		}
    	});
  }
  
  if( !ready ) {
    return(
      <Spin />
    );
  }
  
  if( !option ) {
    return(
      <h1>NOT ALLOWED</h1>
    );
  }
  
  return(
    <div className='space'>
      <div className=''>
        <button
          className='clear whiteT'
          onClick={()=>hndlFirstUser()}
        >First User</button>
        <br /><br /><br /><br /><br />  
        <form onSubmit={()=>hndlSet()}>
          <button
            className='clear whiteT'
          >Setup</button>
        </form>
      </div>
    </div>
  );
      
};

export default withTracker( () => {
  
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;
  //let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
     
    if(!org) {
      if(Pref.InitialAppSetup) {
        return {
          ready: true,
          option: true
        };
      }else{
        return {
          ready: true,
          option: false
        };
      }
    }

})(InitialSetup);