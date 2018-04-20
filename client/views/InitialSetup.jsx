import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Pref from '/client/global/pref.js';
import Spin from '../components/uUi/Spin.jsx';

const InitialSetup = ({ ready, option })=> {
  
  function hndlSet() {
    Meteor.call('addSetting', (err, reply)=>{
      if (err)
        console.log(err);
      if(reply) {
        Bert.alert('', 'success', 'fixed-top');
      }else{
        Bert.alert('ERROR', 'danger', 'fixed-top');
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
      <div className='centre'>
        <form onSubmit={()=>hndlSet()}>
          <button
            className='stone clear'
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
  let active = user ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
     
    if( !login || !active ) {
      return {
        ready: false,
        option: false,
      };
    }else if(!org) {
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