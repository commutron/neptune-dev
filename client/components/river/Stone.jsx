import React, {Component} from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
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
    this.passS = this.passS.bind(this);
    this.passT = this.passT.bind(this);
    this.finish = this.finish.bind(this);
  }
  
  // removes excessive re-renders
  shouldComponentUpdate(nextProps, nextState) {
  	if(this.state !== nextState) {
  		return true;
  	}else if(this.props.sKey !== nextProps.sKey) {
    	return true;
  	}else{
  		return false;
  	}
  }
  
  reveal() {
    this.setState({show: !this.state.show});
    document.getElementById('find').focus();
  }
  
  unlock() {
  	let speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
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
    }, speed);
  }
  
  //// Action for standard step
  passS(pass, doComm) {
  	console.log('client: ' + this.props.sKey);
    this.setState({lock: true});
    const id = this.props.id;
    const bar = this.props.barcode;
    const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
    const comm = doComm ? prompt('Enter A Comment', '').trim() : '';
		Meteor.call('addHistory', id, bar, sKey, step, type, comm, pass, (error, reply)=>{
	    if(error)
		    console.log(error);
			if(reply) {
				console.log('server: ' + this.props.sKey);
			  document.getElementById('find').focus();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
  }
  
  //// Action for test step
  passT(pass, doComm, shipFail) {
  	console.log('client: ' + this.props.sKey);
    this.setState({lock: true});
    const id = this.props.id;
    const bar = this.props.barcode;
    const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
    const comm = doComm ? prompt('Enter A Comment', '').trim() : '';
    const more = shipFail ? 'ship a failed test' : false;
		Meteor.call('addTest', id, bar, sKey, step, type, comm, pass, more, (error, reply)=>{
	    if(error)
		    console.log(error);
			if(reply) {
				console.log('server: ' + this.props.sKey);
			  document.getElementById('find').focus();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
  }

  //// Action for marking the board as complete
	finish() {
		console.log('client: ' + this.props.sKey);
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
		  	console.log('server: ' + this.props.sKey);
		    document.getElementById('find').focus();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
	}


  render() {
  	
  	console.log('update ' + this.props.step + ' ' + this.props.type);

		let shape = '';
		let ripple = '';
		let lock = this.state.lock;
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
			ripple = ()=>this.passS(true, false);
    }else if(this.props.type === 'build'){
			shape = 'stone iBuild';
			ripple = ()=>this.passS(true, false);
    }else if(this.props.type === 'checkpoint'){
			shape = 'stone iPoint';
			ripple = ()=>this.passS(true, false);
    }else if(this.props.type === 'test'){
			shape = 'stone crackedTop iTest';
			ripple = ()=>this.passT(true, false, false);
    }else if(this.props.type === 'finish'){
			shape = 'stone iFinish';
			ripple = this.finish;
    }else{
      null }
     
    return (
    	<div>
        {!this.state.show ?
					<ContextMenuTrigger
						id={this.props.barcode}
						attributes={ {className:'centre'} }>
						{this.props.type === 'test' ?
						<div className='centre'>
							<button
			      	  className={shape}
			  				name={this.props.step + ' fail'}
			  				ref={(i)=> this.stonefail = i}
			  				onClick={ripple}
			  				tabIndex={-1}
			  				disabled={lock}>
			  				Pass
			  				<label className='big'><br />{this.props.step}</label>
							</button>
							<button
			      	  className='stone crackedBot'
			  				name={this.props.step + ' fail'}
			  				ref={(i)=> this.stonefail = i}
			  				onClick={this.passT.bind(this, false, true, false)}
			  				tabIndex={-1}
			  				disabled={lock}>
			  				Fail
			  				<label className='big'><br />{this.props.step}</label>
							</button>
						</div>
						:
						<div className='centre'>
			      	<button
			      	  className={shape}
			  				name={this.props.step}
			  				ref={(i)=> this.stone = i}
			  				onClick={ripple}
			  				tabIndex={-1}
			  				disabled={lock}>
			  				{prepend}
								<i>{this.props.step}</i>
								{apend}
							</button>
						</div>
						}
					</ContextMenuTrigger>
					:
          <div className='actionBox blue'>
          	<div className='flexRR'>
	          	<button
	          		className='action clear'
	          		onClick={this.reveal}>
	          		{Pref.close}
	          	</button>
          	</div>
        		<p className='bigger centreText up'>{this.props.step}</p>
        		<br />
            <FirstForm
              id={this.props.id}
              barcode={this.props.barcode}
              sKey={this.props.sKey}
              step={this.props.step}
              type={this.props.type}
              users={this.props.users}
              methods={this.props.methods} />
            <br />
          </div>
        }
        {this.props.type === 'first' || this.props.type === 'finish' ? null :
	        <ContextMenu id={this.props.barcode}>
	          <MenuItem onClick={()=>this.passS(true, true)} disabled={lock}>
	            Pass with Comment
	          </MenuItem>
	          {this.props.type === 'test' ?
		          <MenuItem onClick={this.passT.bind(this, true, true, true)} disabled={lock}>
		            Ship a Failed Test
		          </MenuItem>
	          :null}
	        </ContextMenu>
	    	}
      </div>
    );
  }
  
  componentDidMount() {
    this.unlock();
  }
}