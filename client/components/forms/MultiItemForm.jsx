import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';

// required data
//// batch id as props.id
/// items array as props.items
/// props.more as true or false

export default class MultiItemForm extends Component {

  checkRange() {
    let barStart = this.refs.barNumStart.value.trim();
    let barEnd = this.refs.barNumEnd.value.trim();
    
    let first = parseInt(barStart, 10);
    let last = parseInt(barEnd, 10);
    
    // get how many items to create and +1 corection
    let count = last - first + 1;
    
    // validate the count
    let valid = false;
    
    if(
      !isNaN(count)
      &&
      count > 0
      &&
      count <= 5000
      )
      {
        valid = true;
      }
    else
      {
        valid = false;
      }
    
    // enable or disable submit button
    if(valid) {
      this.refs.go.disabled = false;
    }else{
      this.refs.go.disabled = true;
    }
    
    // display quantity
    let quantity = isNaN(count) ? 'Not a number' : 
                   count < 1 ? 'Invalid Range' :
                   count + ' ' + Pref.item + '(s)';
    this.refs.status.value = quantity;
  }

	addItem(e) {
    e.preventDefault();
    this.refs.go.disabled = true;
    
    let batchId = this.props.id;
    
    const barStart = this.refs.barNumStart.value.trim();
    const barEnd = this.refs.barNumEnd.value.trim();
    const unit = this.refs.unit.value.trim();
  
    const first = parseInt(barStart, 10);
    const end = parseInt(barEnd, 10);
    const last = end + 1;

    Meteor.call('addMultiItems', batchId, first, last, unit, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply[0]) {
        Bert.alert(Alert.success);
        this.refs.unit.value = 1;
        this.refs.barNumStart.value = '';
        this.refs.barNumEnd.value = '';
      }else{
        Bert.alert(Alert.caution);
        console.log(reply[2]);
      }
      
      if(!reply[1]) {
        null;
      }else if(reply[1].length > 0) {
        let bad = reply[1].toString();
        this.refs.status.value = 'duplicates not created - ' + bad;
      }else{
        this.refs.status.value = 'all created successfully';
      }
    });
	}

  render() {
    
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');

    return (
      <Model
        button={'Add ' + Pref.item + 's'}
        title={'Add ' + Pref.item + 's'}
        type='action clear greenT'
        lock={!auth || !this.props.more} >
        <div className='centre'>
          <form onSubmit={this.addItem.bind(this)} autoComplete='off'>
            <p><label htmlFor='cln'>{Pref.unit} Quantity</label><br />
              <input
                type='number'
                ref='unit'
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
              />
            </p>
            <br />
            <p><label htmlFor='strt'>First {Pref.item} Number</label><br />
              <input
                type='text'
                ref='barNumStart'
                id='strt'
                pattern='[000000-999999]*'
                maxLength='6'
                minLength='6'
                placeholder='100000-999999'
                inputMode='numeric'
                autoFocus='true'
                required
              />
            </p>
            <br />
            <p><label htmlFor='nd'>Last {Pref.item} Number</label><br />
              <input
                type='text'
                ref='barNumEnd'
                id='nd'
                pattern='[000000-999999]*'
                maxLength='6'
                minLength='6'
                placeholder='100000-999999'
                inputMode='numeric'
                required
                onInput={this.checkRange.bind(this)}
              />
            </p>
            <br />
            <p className='centre'>
              <output ref='status' />
            </p>
            <br />
            <p className='centre'>
              <button
                ref='go'
                disabled='true'
                className='action clear greenT'
                type='submit'
              >Add</button>
            </p>
          </form>
        </div>
      </Model>
    );
  }
}