import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

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
  componentWillReceiveProps() {
    this.setState({show: false});
    this.setState({lock: true});
    this.unlock();
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
  		  Session.get('ikyView') === false ? // if item card is displayed
  		    this.setState({lock: false})
  		  : null;
  	  }, 3000);
  	}
  }
  
    //// Action for a first off inspection
		passF(e) {
			e.preventDefault();
			this.go.disabled = true;
			this.setState({lock: true});
      const id = this.props.id;
      const bar = this.props.barcode;
      const sKey = this.props.sKey;
			const step = this.props.step;
      const type = this.props.type;
      const comm = this.comm ? this.comm.value.trim().toLowerCase() : '';
      const ac = this.ac.checked;
      
			const whoSelect = this.wB.selectedOptions;
			const whoB = [];
			for(let who of whoSelect) { whoB.push(who.value) }
			
      const howSelect = this.method.selectedOptions;
      const howB = [];
			for(let how of howSelect) { howB.push(how.value) }
      
			Meteor.call('addFirst', id, bar, sKey, step, type, comm, ac, whoB, howB, (error, reply)=>{
			  if(error)
			    console.log(error);
			  if(reply) {
       		const findBox = document.getElementById('find');
  			  findBox.focus();
  			  this.unlock();
  			 }else{
  			   Bert.alert(Pref.blocked, 'danger');
  			 }
			});
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
            <form className='centre' onSubmit={this.passF.bind(this)}>
              <h2>{this.props.step}</h2>
              <br />
              <p>
                <input
                  type='checkbox'
                  id='cptbl'
                  className='mini15x'
                  ref={(i)=> this.ac = i}
                  defaultChecked='true'
                  readOnly />
                <label htmlFor='cptbl'>acceptable</label><br />
              </p>
              <p><label htmlFor='wuilt'>{Pref.builder}</label><br />
                <select id='wuilt' ref={(i)=> this.wB = i} className='cap' multiple required>
                  {this.props.users.map( (entry, index)=>{
                    return( <option key={index} value={entry._id}>{entry.username}</option> );
                  })}
                </select>
              </p>
              <p><label htmlFor='whart'>{Pref.method}</label><br />
                <select ref={(i)=> this.method = i} id='whart' className='cap' required>
                  <option></option>
                  {this.props.methods.map( (entry, index)=>{
                    return ( <option key={index} value={entry}>{entry}</option> );
                  })}
                </select>
              </p>
              <p><label htmlFor='fcom'>Comment</label><br />
              <input
    				    type='text'
    				    id='fcom'
    				    ref={(i)=> this.comm = i} />
    				  </p>
              <br />
              <p>
                <button
                  type='submit'
                  ref={(i)=> this.go = i}
                  className='action clear'
                  disabled={false}
                >{Pref.post}</button></p>
            </form>
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