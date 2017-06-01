import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

export default class UserForm extends Component {
  
  clearPin() {
    const user = this.props.id;
    Meteor.call('noPin', user, (err)=>{
      if(err)
        console.log(err);
      Bert.alert(Alert.success);
    });
  }

  render() {
    
    const dt = this.props;
    const active = dt.active ? 'open' : 'open blackT';
    const admin = dt.admin ? 'administrator' : '';
    const power = dt.power ? 'poweruser' : '';
    const lock = dt.admin && !Meteor.user().admin ? true : false;

    return (
      <Model button={dt.name} title='account profile' type={active} >
        <h2 className='low'>{dt.name}</h2>
        <p className='up'>id: {dt.id}</p>
        <p className='greenT'>{admin}</p>
        <p className='blueT'>{power}</p>
        <p>organization: {dt.org}</p>
        <br />
        <fieldset>
          <legend>permissions</legend>
          <br />
          <ul>
            <SetCheck
              user={dt.id}
              id='active'
              label='active'
              check={dt.active}
              lock={lock}
            />
            <br />
            <SetCheck
              user={dt.id}
              id='power'
              label='poweruser'
              check={dt.power}
              lock={lock}
            />
            <br />
            <SetCheck
              user={dt.id}
              id='inspect'
              label={Pref.inspect}
              check={dt.inspector}
              lock={lock}
            />
            <br />
            <SetCheck
              user={dt.id}
              id='test'
              label={Pref.test}
              check={dt.tester}
              lock={lock}
            />
            <br />
            <SetCheck
              user={dt.id}
              id='create'
              label={Pref.create}
              check={dt.creator}
              lock={lock}
            />
          </ul>
        </fieldset>
        <br />
        {dt.power && Meteor.user().admin ?
          <fieldset>
            <legend>Forgot PIN</legend>
            <button
              className='smallAction clear redT'
              onClick={this.clearPin.bind(this)}
              disabled={lock}
            >Clear PIN</button>
          </fieldset>
          :
          null
        }
      </Model>
          
      );
  }
}

class SetCheck extends Component	{
  
  change() {
    Meteor.call('permissionSet', this.props.id, this.props.user, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert('saved', 'success');
      }else{
        console.log("BLOCKED BY SERVER");
      }
    });
  }
  
  render() {
    return(
      <li>
        <input
          type='checkbox'
          id={this.props.id}
          defaultChecked={this.props.check}
          onChange={this.change.bind(this)}
          disabled={this.props.lock}
          readOnly
        />
        <label htmlFor={this.props.id}>{this.props.label}</label>
      </li>
      );
  }
}