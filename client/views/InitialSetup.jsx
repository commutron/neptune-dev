import React, {Component} from 'react';

import OrgForm from '../components/forms/OrgForm.jsx';

export default class InitialSetup extends Component	{
  
  hndlSet() {
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
  
  // add option to leave group now before there are any consequenses
  render() {
    return (
      <div className='space'>
        <p>"{this.props.org}" is a new organization</p>
        <hr />
        <div className='centre'>
          <form onSubmit={this.hndlSet}>
            <button 
              className='stone clear'
            >START</button>
          </form>
        </div>
        <hr />
        <OrgForm org={this.props.org} />
      </div>
    );
  }
}