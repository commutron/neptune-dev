import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

export default class UnitSet extends Component	{
  
  unitSet() {
    const id = this.props.id;
    const bar = this.props.item.serial;
    const unit = this.unit.value.trim();
    
    if(unit) {
      Meteor.call('setItemUnit', id, bar, unit, (error, reply)=>{
        if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
      });
    }else{null}
  }

  render() {
        	    
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    let done = this.props.item.finishedAt !== false;
    
    return(
      <Model
        button={Pref.unit + ' set'}
        title={'set ' + Pref.unit}
        color='greenT'
        icon='fa-th'
        lock={!auth}
        noText={this.props.noText}>
        <p className='centre centreTrue'>
        {done &&
          <b className='big'>
            This serial number is finished, are you sure you want to adjust how many units were included under this serial?
          </b>}
          <br />
          <input
            type='number'
            ref={(i)=> this.unit = i}
            id='cln'
            pattern='[000-999]*'
            maxLength='3'
            minLength='1'
            max='100'
            min='1'
            defaultValue={this.props.item.units}
            placeholder='1-100'
            inputMode='numeric'
            required
            onChange={this.unitSet.bind(this)}
          />
          <label htmlFor='cln'>{Pref.unit} Quantity</label>
        </p>
      </Model>
      );
  }
}