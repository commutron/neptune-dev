import React, {Component} from 'react';
import { toast } from 'react-toastify';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';
import StoneProgRing from './StoneProgRing.jsx';

export default class Stone extends Component {
  
  constructor() {
    super();
    this.state = {
      lock: true
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
  		//this.props.doneStone !== nextProps.doneStone ||
  		this.props.blockStone !== nextProps.blockStone ||
  		this.props.sKey !== nextProps.sKey ||
  		(this.props.undoOption === true && nextProps.undoOption === false)
  	) {
    	return true;
  	}else{
  		return false;
  	}
  }
  
  reveal() {
    this.props.changeVerify();
  }
  
  unlock() {
  	let speed = !Meteor.user().unlockSpeed ? 4000 : ( Meteor.user().unlockSpeed * 2 ); 
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
  	if(this.state.lock === true) { return false; }
    this.setState({lock: true});
    const id = this.props.id;
    const bar = this.props.barcode;
    const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
    const comm = doComm ? prompt('Enter A Comment', '').trim() : '';
    
    const pre = this.props.progCounts;
    const preTotal = pre.regItems;
    const preStep = pre.regStepCounts.find( x => x.key === sKey );
    const preCount = preStep ? preStep.items : undefined;
    const benchmark = preCount === 0 ? 'first' : preCount === preTotal - 1 ? 'last' : false;              
    
		Meteor.call('addHistory', id, bar, sKey, step, type, comm, pass, benchmark, (error, reply)=>{
	    if(error)
		    console.log(error);
			if(reply) {
				this.props.openUndoOption();
			  document.getElementById('lookup').focus();
		  }else{
		    toast.error('server error');
		  }
		});
  }
  
  //// Action for test step
  passT(pass, doComm, shipFail) {
  	if(this.state.lock === true) { return false; }
    this.setState({lock: true});
    const id = this.props.id;
    const bar = this.props.barcode;
    const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
    const comm = doComm ? prompt('Enter A Comment', '') : '';
    const more = shipFail ? 'ship a failed test' : false;
    
    const pre = this.props.progCounts;
    const preTotal = pre.regItems;
    const preStep = pre.regStepCounts.find( x => x.key === sKey );
    const preCount = preStep ? preStep.items : undefined;
    const benchmark = preCount === 0 ? 'first' : preCount === preTotal - 1 ? 'last' : false;              
		
    if(pass === false && ( !comm || comm == '' ) ) {
    	this.unlock();
    }else{
			Meteor.call('addTest', id, bar, sKey, step, type, comm, pass, more, benchmark, (error, reply)=>{
		    if(error)
			    console.log(error);
				if(reply) {
					this.props.openUndoOption();
					pass === false && this.unlock();
				  document.getElementById('lookup').focus();
			  }else{
			    Bert.alert(Pref.blocked, 'danger');
			  }
			});
    }
  }

  //// Action for marking the board as complete
	finish() {
		if(this.state.lock === true) { return false; }
	  this.setState({lock: true});
    const batchId = this.props.id;
		const barcode = this.props.barcode;
		const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
    
    const pre = this.props.progCounts;
    const preTotal = pre.regItems;
    const preStep = pre.regStepCounts.find( x => x.key === sKey );
    const preCount = preStep ? preStep.items : undefined;
    const benchmark = preCount === 0 ? 'first' : preCount === preTotal - 1 ? 'last' : false;              

		Meteor.call('finishItem', batchId, barcode, sKey, step, type, benchmark, (error, reply)=>{
		  if(error)
		    console.log(error);
		  if(reply) {
		    document.getElementById('lookup').focus();
		  }else{
		    Bert.alert(Pref.blocked, 'danger');
		  }
		});
	}
	
	handleStepUndo() {
		const id = this.props.id;
		const serial = this.props.barcode;
		Meteor.call('popHistory', id, serial, ()=>{
			this.props.closeUndoOption();
		});
	}
	
  render() {

		let shape = '';
		let ripple = '';
		let lock = /*this.props.doneStone ||*/ this.props.blockStone ? 
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
    
    const topClass = /*this.props.doneStone ? 'doneStoneMask' :*/
    								 this.props.blockStone ? 'blockStone' : '';
    const topTitle = topClass !== '' ? Pref.stoneislocked : '';
		
     return(
     	<div className='noCopy'>
    		<div className={topClass + ' stoneFrame'} title={topTitle}>
        	<StoneProgRing
    				serial={this.props.barcode}
    				allItems={this.props.allItems}
    				isAlt={this.props.isAlt}
    				hasAlt={this.props.hasAlt}
    				sKey={this.props.sKey}
            step={this.props.step}
            type={this.props.type}
            progCounts={this.props.progCounts}>
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
					</StoneProgRing>
				</div>
				<div className='stoneBase'>
					<div className='undoStepWrap centre'>
						{this.props.undoOption ? 
							<button
								className='textAction'
								onClick={()=>this.handleStepUndo()}
							>undo</button> 
						: null}
					</div>
					<ContextMenuTrigger
						id={this.props.barcode}
						attributes={ {className:'moreStepAction centre'} }
						holdToDisplay={1}
            renderTag='div'>
            <i className='fas fa-ellipsis-v fa-fw fa-lg'></i>
					</ContextMenuTrigger>
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
		          {/*this.props.compEntry &&
			          <MenuItem onClick={()=>this.handleUndoLast()}>
			            Undo Completed Step
			          </MenuItem>*/}
		        </ContextMenu>
		    	}
	    	</div>
      </div>
    );
  }
  componentDidMount() {
    this.unlock();
  }
}