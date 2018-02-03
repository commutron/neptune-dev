import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';
import AnimateWrap from '../tinyUi/AnimateWrap.jsx';

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
      step: 1,
      howI: false,
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
    let count = this.state.step;
    count++;
    this.setState({ step: count});
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
  
  auto() {
    this.setState({ howI: 'auto' });
  }
  eyes() {
    this.setState({ howI: 'manual' });
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
      
    const howI = this.state.howI ? this.state.howI : 'manual';
    const whoB = [...this.state.whoB];
    const howB = this.state.howB;
    const good = this.state.good;
    const diff = this.state.diff;
    const ng = this.state.ng;
      
		Meteor.call('addFirst', id, bar, sKey, step, good, whoB, howB, howI, diff, ng, (error, reply)=>{
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


  render() {
    
    const step = this.state.step;
    
    let secondOpinion = this.state.whoB.has(Meteor.userId()) ? true : false;
    
    if(this.props.repeat && !this.state.diff) {
      return(
        <AnimateWrap type='contentTrans'>
          <form className='stoneForm' onSubmit={this.again.bind(this)} key={1}>
            <p>
              <textarea
      			    type='text'
      			    id='proC'
      			    ref={(i)=> this.change = i}
      			    required></textarea>
      			  <label htmlFor='proC'>{Pref.proChange}</label>
    			  </p>
            <button
              className='action clearWhite'>
              <i className="fas fa-arrow-right fa-lg" aria-hidden="true"></i>
              <br />Continue
            </button>
          </form>
        </AnimateWrap>
      );
    }
    
    if(this.props.step.includes('smt') && !this.state.howI) {
      return(
        <AnimateWrap type='contentTrans'>
          <div className='stoneForm' key={2}>
            <br />
            <span className='balance'>
              <button
                type='button'
                className='miniAction bigger'
                onClick={this.eyes.bind(this)}>
                <i className="fas fa-eye fa-3x" aria-hidden="true"></i>
                <br />Manual
              </button>
              <span className='space' />
              <button
                type='button'
                className='miniAction bigger'
                onClick={this.auto.bind(this)}>
                <i className="fas fa-camera fa-3x" aria-hidden="true"></i>
                <br />AOI
              </button>
            </span>
          </div>
        </AnimateWrap>
      );
    }
    
    if(step === 1) {
      return(
        <AnimateWrap type='contentTrans'>
          <div className='stoneForm' key={3}>
            <p>
              <select
                id='wuilt'
                className='cap'
                ref={(i)=> this.user = i}
                onChange={this.up.bind(this)}>
                <option></option>
                {this.props.users.map( (entry, index)=>{
                  return( <option key={index} value={entry._id}>{entry.username}</option> );
                })}
              </select>
              <label htmlFor='wuilt'>{Pref.builder}</label>
            </p>
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
            <br />
            {this.state.whoB.size > 0 ?
              <button
                type='button'
                className='action clearWhite'
                onClick={this.goNext}>
                <i className="fas fa-arrow-right fa-lg" aria-hidden="true"></i>
                <br />Continue
              </button>
            :null}
          </div>
        </AnimateWrap>
      );
    }
    
    
    if(step === 2) {
      return(
        <AnimateWrap type='contentTrans'>
          <div className='stoneForm' key={4}>
            <p>
              <select
                id='mthb'
                className='cap'
                ref={(i)=> this.methodB = i}
                onChange={this.tool.bind(this)}
                required>
                <option></option>
                {this.props.methods.map( (entry, index)=>{
                  if(typeof entry === 'string') {// redundant after migration
                    return ( <option key={index} value={entry}>{entry}</option> );
                  }else if(typeof entry === 'object') {// redundant after migration
                    if(entry.forSteps.includes(this.props.sKey)) {
                      return ( <option key={index} value={entry.title}>{entry.title}</option> );
                    }else{null}
                  }else{null}
                })}
              </select>
              <label htmlFor='mthb'>{Pref.method}</label>
            </p>
          </div>
        </AnimateWrap>
      );
    }
    
    if(step === 3) {
      return(
        <AnimateWrap type='contentTrans'>
          <div className='stoneForm' key={5}>
    			  <br />
            <span className='balance'>
              <button
                type='button'
                className='miniAction bigger redT'
                ref={(i)=> this.goBad = i}
                disabled={false}
                onClick={this.notgood.bind(this)}>
                <i className="fas fa-times-circle fa-3x" aria-hidden="true"></i>
                <br />Fail
              </button>
              <span className='space' />
              <button
                type='button'
                className='miniAction bigger'
                ref={(i)=> this.go = i}
                disabled={secondOpinion}
                onClick={this.pass.bind(this)}>
                <i className="fas fa-check-circle fa-3x" aria-hidden="true"></i>
                <br />Pass
              </button>
            </span>
            <br />
            <textarea
    			    type='text'
    			    id='oIss'
    			    ref={(i)=> this.issue = i}
    			    onChange={this.flaw.bind(this)}></textarea>
    			  <label htmlFor='oIss'>{Pref.outIssue}</label>
          </div>
        </AnimateWrap>
      );
    }
      
    return(
      null
    );

  }
}

