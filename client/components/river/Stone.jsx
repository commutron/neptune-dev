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
    const findBox = document.getElementById('find');
  	findBox.focus();
  }
    
  // close first-off form and recheck the lock when switching items 
  componentWillReceiveProps(nextProps) {
    if(this.props.sKey !== nextProps.sKey || this.props.barcode !== nextProps.barcode) {
      //if(this.state) {
        this.setState({show: false});
        this.setState({lock: true});
        this.unlock();
      //}else{null}
    }else{null}
  }
  
  unlock() {
    Meteor.setTimeout(()=> {
    	const first = this.props.type === 'first';
    	const inspect = this.props.type === 'inspect';
    	const inspector = first || inspect ? true : false;
    	const test = this.props.type === 'test' ? true : false;
    	const finish = this.props.type === 'finish' ? true : false;
    	if(inspector && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
    		null;
    	}else if(test && !Roles.userIsInRole(Meteor.userId(), 'test')) {
    		null;
    	}else if(finish && !Roles.userIsInRole(Meteor.userId(), 'finish')) {
    		null;
    	}else{
  		  let iky = Session.get('ikyView');
  		  !iky || iky === false ? // if item card is displayed
  		    this.setState({lock: false})
  		  : null;
    	}
    }, 2000);
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
		let prepend = this.props.type === 'build' || this.props.type === 'first' ?
		              <label className='big'>{this.props.type}<br /></label> : null;
		let apend = this.props.type === 'inspect' ?
		                <label className='big'><br />{this.props.type}</label> : null;

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
			shape = 'stone iFinish';
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
		  				{prepend}
							{this.props.step}
							{apend}
						</button>
						{this.props.type === 'test' ?
						  <input
						    type='text'
						    ref={(i)=> this.comm = i}
						    placeholder='optional comment'
						    style={sty} 
						    disabled={lock} />
						  : null}
					</div>
					:
          <div className='actionBox blue'>
            <button className='action clear rAlign' onClick={this.reveal}>{Pref.close}</button>
            <br />
            <br />
            <p className='bigger centre'>{this.props.step}</p>
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