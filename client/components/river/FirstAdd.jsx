import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';

// id={this.props.id}
// barcode={this.props.barcode}
// sKey={thhis.props.sKey}
// step={this.props.step}
// type={this.props.type}
// users={this.props.users}
// methods={this.props.methods}
// onPass={e => this.unlock()}

export default class FirstForm extends Component	{
  
  constructor() {
    super();
    this.state = {
      goforward: false,
      page: 1,
      step: '',
      howInspect: false,
      whoB: new Set(),
      howB: false,
      good: true,
      ng: false,
      diff: false
    };
    this.goNext = this.goNext.bind(this);
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
  }
  
  goNext() {
    // if done
    this.setState({ goforward: 'forward' });
    this.setState({ page: 2});
  }
  goBack() {
    this.setState({ goforward: 'backward' });
    this.setState({ page: 1});
  }
  
  again(e) {
    e.preventDefault();
    let val = this.change.value.trim().toLowerCase();
    if(!val) {
      null;
    }else{
      this.setState({ diff: val });
    }
  }
  
  how() {
    this.setState({ howInspect: this.howI.value });
  }

// step 1
  up() {
    let who = this.state.whoB;
    let val = this.user.value;
    who.add(val);
    this.setState({ whoB: who });
    this.user.value = '';
  }
  
  down(entry) {
    let who = this.state.whoB;
    who.delete(entry);
    this.setState({ whoB: who });
  }

// step 2
  tool() {
    let val = this.methodB.value.trim().toLowerCase();
    if(!val) {
      null;
    }else{
      this.setState({ howB: val });
      this.goNext();
    }
  }

// step 3
  flaw() {
    let val = this.issue.value.trim().toLowerCase();
    if(!val) {
      null;
    }else{
      this.setState({ ng: val });
    }
  }
  
  notgood() {
    this.goBad.disabled = true;
    this.setState({ good: false }, ()=>{
      this.pass();
    });
  }
  
  pass() {
    this.go.disabled = true;
    const id = this.props.id;
    const bar = this.props.barcode;
    const sKey = this.props.sKey;
		const step = this.props.step;
    const type = this.props.type;
      
    const howI = this.state.howI ? this.state.howI : 'manual';
    const whoB = [...this.state.whoB];
    const howB = this.state.howB;
    const good = this.state.good;
    const diff = this.state.diff;
    const ng = this.state.ng;
      
		Meteor.call('addFirst', id, bar, sKey, step, type, good, whoB, howB, howI, diff, ng, (error, reply)=>{
		  if(error)
		    console.log(error);
		  if(reply) {
     		const findBox = document.getElementById('lookup');
			  findBox.focus();
			 }else{
			   Bert.alert(Pref.blocked, 'danger');
			 }
		});
	}
	
	handleFirst(e) {
	  e.preventDefault();
	}


  render() {
    
    const allFlows = this.props.allFlows;
    const riverKey = this.props.riverKey;
    const riverAltKey = this.props.riverAltKey;
    const a = this.props.app;
    
    const river = riverKey ? 
                  allFlows.find( x => x.flowKey === riverKey).flow :
                  [];
    const riverAlt = riverAltKey ? 
                     allFlows.find( x => x.flowKey === riverAltKey).flow :
                     [];
    const firsts = new Set();
    for(let s of river) {
      s.type === 'first' ? firsts.add(s) : null;
    }
    for(let s of riverAlt) {
      s.type === 'first' ? firsts.add(s) : null;
    }
    
    let secondOpinion = this.state.whoB.has(Meteor.userId()) ? true : false;
    
    const movement = !this.state.goforward ? 
                     '' :
                     this.state.goforward === 'forward' ?
                     'forward' : 
                     'backward';
    
    
    console.log(firsts);
    
    if(this.state.page === 1) {                 
      return(
        <InOutWrap type={movement}>
        <div className='actionForm' key='page1'>
            
            <select
              id='whatfirst'
              className='cap blueIn'
              required>
                {[...firsts].map( (dt)=>{
                  return (
                    <option key={dt.key} value={dt}>{dt.step}</option>
                )})}
            </select>
            
            
            <input
    			    type='text'
    			    id='proC'
    			    ref={(i)=> this.change = i}
    			    placeholder={Pref.proChange} />
          
          
            <select
              id='howinspect'
              className='cap blueIn'
              ref={(i)=> this.howI = i}
              onChange={this.how.bind(this)}
              required>
              <option
                value='manual'
                defaultValue={!this.state.step.toLowerCase().includes('smt')}
                required
              >Manual</option>
              <option
                value='auto'
                defaultValue={this.state.step.toLowerCase().includes('smt')}
              >AOI</option>
            </select>
            
            
            <button
              className='miniAction bigger'
              onClick={()=>this.goNext()}>
              <i className='fas fa-arrow-right fa-lg'></i>
            </button>

        </div>
        </InOutWrap>
      );
    }
    
    if(this.state.page === 2) {                 
      return(
        <InOutWrap type={movement}>
        <div className='actionForm' key='page2'>
          
          <button
            className='miniAction bigger'
            onClick={()=>this.goBack()}>
            <i className='fas fa-arrow-left fa-lg'></i>
          </button>
          
          <select
            id='wuilt'
            className='cap'
            ref={(i)=> this.user = i}
            onChange={this.up.bind(this)}>
            <optgroup label={Pref.builder}>
              <option></option>
              {this.props.users.map( (entry, index)=>{
                return(
                  <option key={index} value={entry._id}>{entry.username}</option>
              )})}
            </optgroup>
          </select>
          
          
          {[...this.state.whoB].map( (entry, index)=>{
            return(
              <i className='tempTag big' key={index}>
                <UserNice id={entry} />
                <button
                  type='button'
                  name={entry}
                  ref={(i)=> this.ex = i}
                  className='miniAction big redT'
                  onClick={()=>this.down(entry)}>
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>
              </i>
          )})}
              
              
          <select
            id='mthb'
            className='cap'
            ref={(i)=> this.methodB = i}
            onChange={this.tool.bind(this)}
            required>
            <optgroup label={Pref.method}>
              <option></option>
              {a.toolOption.map( (entry, index)=>{
                return(
                  <option key={index} value={entry}>{entry}</option>
              )})}
            </optgroup>
          </select>
          
          
          <input
  			    type='text'
  			    id='oIss'
  			    ref={(i)=> this.issue = i}
  			    onChange={this.flaw.bind(this)}
  			    placeholder={Pref.outIssue} />
  			    
  			    
			    
			    <span className=''>
            <button
              type='button'
              className='miniAction bigger redT'
              ref={(i)=> this.goBad = i}
              disabled={false}
              onClick={this.notgood.bind(this)}>
              <i className="fas fa-times-circle fa-lg"></i>
            </button>
            <button
              type='button'
              className='miniAction bigger'
              ref={(i)=> this.go = i}
              disabled={secondOpinion}
              onClick={this.pass.bind(this)}>
              <i className="fas fa-check-circle fa-lg"></i>
            </button>
          </span>
          
        </div>
        </InOutWrap>
      );
    }
    
    return(null);
  }
}

