import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

export default class UnitSet extends Component	{
  
  unitSet() {
    const id = this.props.id;
    const bar = this.props.bar;
    const unit = this.unit.value.trim();
    
    if(unit) {
      Meteor.call('setItemUnit', id, bar, unit, (error, reply)=>{
        if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.warning);
      }
      });
    }else{null}
  }

  render() {
    
    const allow = Roles.userIsInRole(Meteor.userId(), ['power', 'creator']);
    return(
      <Model
        button={Pref.unit + ' set'}
        title={Pref.unit + ' set'}
        type='action clear greenT'
        lock={!allow || this.props.lock}>
        <p className='centre'>
          <label htmlFor='cln'>{Pref.unit} Quantity</label><br />
          <input
            type='number'
            ref={(i)=> this.unit = i}
            id='cln'
            pattern='[000-999]*'
            maxLength='3'
            minLength='1'
            max='100'
            min='1'
            defaultValue={this.props.unit}
            placeholder='1-100'
            inputMode='numeric'
            required
            onChange={this.unitSet.bind(this)}
          />
        </p>
      </Model>
      );
  }
}