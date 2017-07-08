import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import FirstForm from './FirstForm.jsx';

export default class Stone extends Component	{
  
  constructor() {
    super();
    this.state = {
      lock: true,
      show: false
    };
    this.reveal = this.reveal.bind(this);
  }
  
  reveal() {
    this.setState({show: !this.state.show});
  }
    
  // close first-off form and recheck the lock when switching items 
  componentWillReceiveProps(nextProps) {
    if(this.props.sKey !== nextProps.sKey || this.props.barcode !== nextProps.barcode) {
      this.setState({show: false});
      this.setState({lock: true});
      this.unlock();
    }else{null}
  }
  
  unlock() {
  	const first = this.props.type === 'first';
  	const inspect = this.props.type === 'inspect';
  	const finish = this.props.type === 'finish';
  	const inspector = first || inspect || finish ? true : false;
  	const test = this.props.type === 'test';
  	if(inspector && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
  		null;
  	}else if(test && !Roles.userIsInRole(Meteor.userId(), 'test')) {
  		null;
  	}else{
  	  Meteor.setTimeout(()=> {
  		  let iky = Session.get('ikyView');
  		  !iky || iky === false ? // if item card is displayed
  		    this.setState({lock: false})
  		  : null;
  	  }, 3000);
  	}
  }
  
  firstDone() {
    this.reveal();
    this.unlock();
  }
  
  //// Action for standard step
  passS() {
    this.setState({lock: true});
    const id = this.props.id;
    const bar = this.props.barcode;
    const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
    const comm = this.comm ? this.comm.value.trim().toLowerCase() : '';
		Meteor.call('addHistory', id, bar, sKey, step, type, comm, (error, reply)=>{
	    if(error)
		    console.log(error);
			if(reply) {
			  let findBox = document.getElementById('find');
		    findBox.focus();
		    this.unlock();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
  }

  //// Action for marking the board as complete
	finish() {
	  this.setState({lock: true});
    const batchId = this.props.id;
		const barcode = this.props.barcode;
		const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
		Meteor.call('finishItem', batchId, barcode, sKey, step, type, (error, reply)=>{
		  if(error)
		    console.log(error);
		  if(reply) {
		    let findBox = document.getElementById('find');
		    findBox.focus();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
	}


  render() {

		let shape = '';
		let ripple = '';
		let lock = this.state.lock;
		let sty = {width: '100%'};

	//// Style the Stone Accordingly \\\\
		if(this.props.type === 'first'){
			shape = 'stone iFirst';
			ripple = this.reveal;
		}else if(this.props.type === 'inspect'){
			shape = 'stone iCheck';
			ripple = this.passS.bind(this);
    }else if(this.props.type === 'build'){
			shape = 'stone iBuild';
			ripple = this.passS.bind(this);
    }else if(this.props.type === 'test'){
			shape = 'stone iTest';
			ripple = this.passS.bind(this);
    }else if(this.props.type === 'finish'){
			shape = 'stone iCheck';
			ripple = this.finish.bind(this);
    }else{
      null }
     
    return (
    	<div>
        {!this.state.show ?
					<div className='centre'>
		      	<button
		      	  className={shape}
		  				name={this.props.step}
		  				ref={(i)=> this.stone = i}
		  				onClick={ripple}
		  				tabIndex={-1}
		  				disabled={lock} >
							{this.props.step}
						</button>
						{this.props.type === 'test' ?
						  <input
						    type='text'
						    ref={(i)=> this.comm = i}
						    placeholder='comment'
						    style={sty} />
						  : null}
					</div>
					:
          <div className='actionBox blue'>
            <button className='action clear rAlign' onClick={this.reveal}>{Pref.close}</button>
            <br />
            <br />
            <FirstForm
              id={this.props.id}
              barcode={this.props.barcode}
              sKey={this.props.sKey}
              step={this.props.step}
              type={this.props.type}
              users={this.props.users}
              methods={this.props.methods} 
              onPass={e => this.firstDone()} />
            <br />
          </div>
        }
        </div>
    );
  }
  
  componentDidMount() {
    this.unlock();
  }
}