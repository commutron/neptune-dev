import React, {Component} from 'react';
//require('velocity-animate');
//require('velocity-animate/velocity.ui');
//import { VelocityComponent } from 'velocity-react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

import FirstForm from './FirstForm.jsx';
import FoldInNested from './FoldInNested.jsx';
import StoneProgRing from './StoneProgRing.jsx';

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
  	if(
  		this.state !== nextState ||
  		this.props.doneStone !== nextProps.doneStone ||
  		this.props.blockStone !== nextProps.blockStone ||
  		this.props.sKey !== nextProps.sKey
  	) {
    	return true;
  	}else{
  		return false;
  	}
  }
  
  reveal() {
    this.setState({show: !this.state.show});
    //document.getElementById('lookup').focus();
  }
  
  unlock() {
  	let speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
    Meteor.setTimeout(()=> {
    	const inspect = this.props.type === 'inspect';
    	const first = this.props.type === 'first';
    	const test = this.props.type === 'test';
    	const finish = this.props.type === 'finish';
    	if(inspect && !Roles.userIsInRole(Meteor.userId(), 'inspect')) {
    		null;
    	}else if(first && !Roles.userIsInRole(Meteor.userId(), 'verify')) {
    		null;
    	}else if(test && !Roles.userIsInRole(Meteor.userId(), 'test')) {
    		null;
    	}else if(finish && !Roles.userIsInRole(Meteor.userId(), 'finish')) {
    		null;
    	}else{
  		  this.setState({lock: false});
    	}
    }, speed);
  }
  
  //// Action for standard step
  passS(pass, doComm) {
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
			  //document.getElementById('lookup').focus();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
  }
  
  //// Action for test step
  passT(pass, doComm, shipFail) {
    this.setState({lock: true});
    const id = this.props.id;
    const bar = this.props.barcode;
    const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
    const comm = doComm ? prompt('Enter A Comment', '') : '';
    const more = shipFail ? 'ship a failed test' : false;
    if(pass === false && ( !comm || comm == '' ) ) {
    	this.unlock();
    }else{
			Meteor.call('addTest', id, bar, sKey, step, type, comm, pass, more, (error, reply)=>{
		    if(error)
			    console.log(error);
				if(reply) {
					pass === false && this.unlock();
				  //document.getElementById('lookup').focus();
			  }else{
			    Bert.alert(Pref.blocked, 'danger');
			  }
			});
    }
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
		    //document.getElementById('lookup').focus();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
	}
	
	handleUndoLast() {
		const id = this.props.id;
		const bar = this.props.barcode;
		const entry = this.props.compEntry;
	  const flag = entry.key;
	  const time = entry.time;
	  let replace = entry;
	  replace.good = false;
	  if(entry) {
		  Meteor.call('pullHistory', id, bar, flag, time, (error, reply)=> {
		    error && console.log(error);
		    if(reply) {
		      Meteor.call('pushHistory', id, bar, replace, (error)=> {
		        error && console.log(error);
		        this.unlock();
		      });
		    }else{
		      Bert.alert(Pref.blocked, 'danger');
		    }
		  });
	  }else{
	  	Bert.alert(Pref.blocked, 'danger');
	  }
	}

  render() {

		let shape = '';
		let ripple = '';
		let lock = this.props.doneStone || this.props.blockStone ? 
							 true : this.state.lock;
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
			shape = 'crackedTop iTest';
			ripple = ()=>this.passT(true, false, false);
    }else if(this.props.type === 'finish'){
			shape = 'stone iFinish';
			ripple = this.finish;
    }else{
      null }
    
    const vw = (v)=> {
      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      return (v * w) / 100;
    };
    const adaptiveWidth = vw(17) + "px";
    
    const stopmooving = { minHeight: vw(20) + "px" };
    
    const topClass = this.props.doneStone ? 'doneStoneMask' :
    								 this.props.blockStone ? 'blockStone' : '';
    const topTitle = topClass !== '' ? Pref.stoneislocked : '';
    //return (
    	{/*
    	<VelocityComponent 
        animation={{opacity: 1}}
        duration="slow"
        runOnMount={true}
        interruptBehavior="finish">*/}
     return(
    	<div style={stopmooving} className={topClass + ' vspace noCopy'} title={topTitle}>
        {this.props.type === 'nest' ?
        	<FoldInNested
            id={this.props.id}
            serial={this.props.barcode}
            sKey={this.props.sKey}
            step={this.props.step}
            lock={lock} />
        : !this.state.show ?
        	<StoneProgRing
    				serial={this.props.barcode}
    				allItems={this.props.allItems}
    				isAlt={this.props.isAlt}
    				hasAlt={this.props.hasAlt}
    				sKey={this.props.sKey}
            step={this.props.step}
            type={this.props.type}
            progCounts={this.props.progCounts}
            adaptiveWidth={adaptiveWidth}>
						<ContextMenuTrigger
							id={this.props.barcode}
							attributes={ {className:'centre'} }>
							{this.props.type === 'test' ?
								<div className='centre stone'>
									<button
					      	  className={shape}
					  				name={this.props.step + ' fail'}
					  				ref={(i)=> this.stonefail = i}
					  				onClick={ripple}
					  				tabIndex={-1}
					  				disabled={lock}>
					  				Pass
					  				<label className=''><br />{this.props.step}</label>
									</button>
									<button
					      	  className='crackedBot'
					  				name={this.props.step + ' fail'}
					  				ref={(i)=> this.stonefail = i}
					  				onClick={this.passT.bind(this, false, true, false)}
					  				tabIndex={-1}
					  				disabled={lock}>
					  				Fail
					  				<label className=''><br />{this.props.step}</label>
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
					</StoneProgRing>
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
	          {this.props.compEntry &&
          <MenuItem onClick={()=>this.handleUndoLast()}>
            Undo Completed Step
          </MenuItem>}
	        </ContextMenu>
	    	}
      </div>
    );
    //</VelocityComponent>
  }
  componentDidMount() {
    this.unlock();
  }
}