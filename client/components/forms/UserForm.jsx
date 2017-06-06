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
  
  hndlRemove() {
    const user = this.props.id;
    const pin = this.pIn.value;
    Meteor.call('removeFromOrg', user, pin, (err, reply)=>{
      if (err)
        console.log(err);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.warning);
      }
    });
  }

  render() {
    
    const active = Roles.userIsInRole(this.props.id, 'active') ? 'open' : 'open blackT';
    const admin = Roles.userIsInRole(this.props.id, 'admin');
    const power = Roles.userIsInRole(this.props.id, 'power');
    const adminFlag = admin ? 'administrator' : '';
    const powerFlag = power ? 'poweruser' : '';
    const lock = Roles.userIsInRole(Meteor.userId(), 'admin') ? false : true;

    return (
      <Model button={this.props.name} title='account profile' type={active} >
        <h2 className='low'>{this.props.name}</h2>
        <p className='up'>id: {this.props.id}</p>
        <p className='greenT'>{adminFlag}</p>
        <p className='blueT'>{powerFlag}</p>
        <p>organization: {this.props.org}</p>
        <br />
        <fieldset>
          <legend>permissions</legend>
          <br />
          <ul>
            {['active', 'power', 'creator', 'inspector', 'tester'].map( (entry, index)=>{
              return(
                <SetCheck
                  key={index}
                  user={this.props.id}
                  role={entry}
                />
              )})}
          </ul>
        </fieldset>
        <br />
        {power || admin ?
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
        
        {this.props.org && this.props.id !== Meteor.userId() ?
          // leaving an org is undesirable
        <div>
          <label htmlFor='lv'>Leaving an organization is undesirable.</label>
          <br />
          <input
              type='password'
              ref={(i)=> this.pIn = i}
              id='pIn'
              pattern='[0000-9999]*'
              maxLength='4'
              minLength='4'
              cols='4'
              placeholder='Poweruser PIN'
              inputMode='numeric'
              autoComplete='new-password'
              required
            />
          <button 
            onClick={this.hndlRemove.bind(this)}
            className='smallAction red'
            disabled={lock}
            >Remove from Organization: "{this.props.org}"
          </button>
        </div>
        : null}
    
      </Model>
          
      );
  }
}

class SetCheck extends Component	{
  
  change() {
    const check = Roles.userIsInRole(this.props.user, this.props.role);
    const flip = check ? 'permissionUnset' : 'permissionSet';
    Meteor.call(flip, this.props.user, this.props.role, (error, reply)=>{
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
    
    const auth = Roles.userIsInRole(Meteor.userId(), ['admin', 'power']) ? false : true;
    const check = Roles.userIsInRole(this.props.user, this.props.role);
    
    return(
      <li>
        <input
          type='checkbox'
          id={this.props.role}
          defaultChecked={check}
          onChange={this.change.bind(this)}
          disabled={auth}
          readOnly
        />
        <label htmlFor={this.props.role}>{this.props.role}</label>
        <br />
      </li>
      );
  }
}