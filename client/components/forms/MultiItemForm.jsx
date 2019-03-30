import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// required data
//// batch id as props.id
/// items array as props.items
/// props.more as true or false

export default class MultiItemForm extends Component {
  
  constructor() {
    super();
    this.state = {
      digits: 10,
      work: false
    };
    this.checkRange = this.checkRange.bind(this);
    this.addItem = this.addItem.bind(this);
  }
  
  setDigit(num) {
    this.setState({ digits: num });
  }

  checkRange() {
    const barStart = this.barNumStart.value.trim();
    const barEnd = this.barNumEnd.value.trim();
    const unit = this.unit.value.trim();
    
    const floor = this.state.digits === 10 ? // simplify after appDB is updated
                  !this.props.app.latestSerial ? 10 :
                    !this.props.app.latestSerial.tenDigit ? 10 : 
                      this.props.app.latestSerial.tenDigit
                  :
                  !this.props.app.latestSerial ? 9 :
                    !this.props.app.latestSerial.nineDigit ? 9 :
                      this.props.app.latestSerial.nineDigit;
    
    let first = parseInt(barStart, 10);
    let last = parseInt(barEnd, 10);
    
    // get how many items to create and +1 corection
    let count = last - first + 1;
    
    // validate the count
    let valid = false;
    
    if(
      //first > floor
      //&&
      !isNaN(count)
      &&
      count > 0
      &&
      count <= 1000
      &&
      unit <= 250
    ) {
        valid = true;
      }
    else
      {
        valid = false;
      }
    
    // enable or disable submit button
    if(valid) {
      this.go.disabled = false;
    }else{
      this.go.disabled = true;
    }
    first <= floor ? 
      this.floorCheck.value = 'Please begin above ' + floor : 
      this.floorCheck.value = '';
    // display quantity
    let quantity = isNaN(count) ? 'Not a number' : 
                   count < 1 ? 'Invalid Range' :
                   count + ' ' + Pref.item + '(s)';
    this.message.value = quantity;
  }

	addItem(e) {
    e.preventDefault();
    this.go.disabled = true;
    this.setState({work: true});
    this.message.value = 'Working...';
    
    const batchId = this.props.id;
    
    const barStart = this.barNumStart.value.trim();
    const barEnd = this.barNumEnd.value.trim();
    const unit = this.unit.value.trim();
  
    const first = parseInt(barStart, 10);
    const last = parseInt(barEnd, 10);

    Meteor.call('addMultiItems', batchId, first, last, unit, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply.success === true) {
        toast.success('Saved');
        this.unit.value = this.props.unit;
        this.barNumStart.value = moment().format('YYMMDD');
        this.barNumEnd.value = moment().format('YYMMDD');
        this.setState({work: false});
        this.message.value = 'all created successfully';
      }else{
        toast.warning('There was a problem...');
        this.message.value = reply.message;
        console.log(reply.message);
        this.setState({work: false});
      }
    });
	}

  render() {
    
    const auth = Roles.userIsInRole(Meteor.userId(), 'run');
    const dig = this.state.digits;
    const today = moment().format('YYMMDD');
    let iconSty = this.state.work ? 'workIcon' : 'transparent';
    
    return (
      <Model
        button={'Add ' + Pref.item + 's'}
        title={'add ' + Pref.item + ' ' + Pref.itemSerial + ' numbers'}
        color='greenT'
        icon={'fa-' + Pref.serialType}
        lock={!auth || !this.props.more}
        noText={this.props.noText}>
        <div className='centre'>
          <form onSubmit={this.addItem} autoComplete='off'>
            <p>
              <input
                type='radio'
                ref={(i)=> this.nineDigit = i}
                id='nine'
                name='digit'
                defaultChecked={false}
                onChange={this.setDigit.bind(this, 9)}
                required />
              <label htmlFor='nine' className='beside'>9 digits</label>
            <br />
              <input
                type='radio'
                ref={(i)=> this.tenDigit = i}
                id='ten'
                name='digit'
                defaultChecked={true}
                onChange={this.setDigit.bind(this, 10)}
                required />
              <label htmlFor='ten' className='beside'>10 digits</label>
            </p>
            <p>
              <input
                type='number'
                ref={(i)=> this.unit = i}
                id='cln'
                pattern='[000-999]*'
                maxLength='3'
                minLength='1'
                max='250'
                min='1'
                defaultValue={this.props.unit}
                placeholder='1-250'
                inputMode='numeric'
                required />
              <label htmlFor='cln'>{Pref.unit} Quantity</label>
            </p>
            <p>
              <input
                type='text'
                ref={(i)=> this.barNumStart = i}
                id='strt'
                pattern='[0000000000-9999999999]*'
                maxLength={dig}
                minLength={dig}
                placeholder='1000000000-9999999999'
                defaultValue={today}
                inputMode='numeric'
                required
                onInput={this.checkRange} />
              <label htmlFor='strt'>First {Pref.item} Number</label>
            </p>
            <p>
              <input
                type='text'
                ref={(i)=> this.barNumEnd = i}
                id='nd'
                pattern='[0000000000-9999999999]*'
                maxLength={dig}
                minLength={dig}
                placeholder='1000000000-9999999999'
                defaultValue={today}
                inputMode='numeric'
                required
                onInput={this.checkRange} />
              <label htmlFor='nd'>Last {Pref.item} Number</label>
            </p>
            <br />
            <div className='centre'>
              <i className={iconSty}></i>
              <output ref={(i)=> this.floorCheck = i} value='' />
              <output ref={(i)=> this.message = i} value='' />
            </div>
            <br />
            <p className='centre'>
              <button
                ref={(i)=> this.go = i}
                disabled={true}
                className='action clearGreen'
                type='submit'
              >Add</button>
            </p>
          </form>
        </div>
      </Model>
    );
  }
}