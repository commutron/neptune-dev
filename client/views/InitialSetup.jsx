import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
import Spin from '../components/tinyUi/Spin.jsx';

const InitialSetup = ({ ready, option })=> {
  
  function hndlSet(e) {
    e.preventDefault();
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
    let options = {
      username: "administrator", 
      password: "riversserenity",
      org: "crew"
    };
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
        <form onSubmit={(e)=>hndlSet(e)}>
          <button
            className='action clear whiteT'
          >Setup App First</button>
        </form>
        <br /><br /><br /><br />
        <button
          className='action clear whiteT'
          onClick={(e)=>hndlFirstUser(e)}
        >Create Admin Account Second</button>
        <br /><br /><br /><br />
        <button
          className='action clear whiteT'
          onClick={()=>FlowRouter.go('/')}
        >Go Home Third</button>
      </div>
    </div>
  );
      
};

export default withTracker( () => {
  
  let login = Meteor.userId() ? true : false;
  let user = login ? Meteor.user() : false;
  let org = user ? user.org : false;

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