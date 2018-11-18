import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import RoleCheck from '/client/components/utilities/RoleCheck.js';
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
    };
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
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
    val === 'false' ? val = false : null;
    this.setState({ howB: val });
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
    const diff = '';
    const ng = this.state.ng;
      
		Meteor.call('addFirst', id, bar, sKey, step, good, whoB, howB, howI, diff, ng, (error, reply)=>{
		  error && console.log(error);
		  if(reply) {
     	  //this.props.onPass;
			 }else{
			   Bert.alert(Pref.blocked, 'danger');
			 }
		});
	}


  render() {
    
    //const step = this.state.step;
    
    let secondOpinion = this.state.whoB.has(Meteor.userId()) ? true : false;
    
    {/*
    <span>
      <select
        id='whatfirst'
        className='cap blueIn'
        ref={(i)=> this.repeatStep = i}
        onChange={this.setStep.bind(this)}
        defaultValue={this.state.step}
        required>
          <option></option>
          {[...firsts].map( (dt)=>{
            return (
              <option key={dt.key} value={dt.key}>{dt.step}</option>
          )})}
      </select>
      <label htmlFor='whatfirst'>Repeat First-off</label>
    </span>
            
    <span>
      <datalist id='commonReasons'>
        {this.props.app.repeatOption.map( (entry)=>{
          if(entry.live === true) {
            return( 
              <option key={entry.key} value={entry.reason}>{entry.reason}</option> 
        )}})}
      </datalist>
      <input
		    type='text'
		    id='proC'
		    list='commonReasons'
		    className='blueIn'
		    ref={(i)=> this.change = i}
		    onChange={this.setChanges.bind(this)}
		    defaultValue={this.state.changes} />
      <label htmlFor='proC'>Process Changes</label>
    </span>
    */}
    
    
    return(
      <AnimateWrap type='contentTrans'>
      
      {this.props.step.toLowerCase().includes('smt') ?
        <fieldset className='stoneForm'>
          <span className='balance'>
            <input
              id='manualInspect'
              type='radio'
              name='howInspect'
              onChange={this.eyes.bind(this)} />
            <label htmlFor='manualInspect' className='roundActionIcon dbblRound onblueHover'>
              <i className="fas fa-eye fa-3x"></i>
              <br /><i className='medBig'>Manual</i>
            </label>
            <input
              id='aoiInspect'
              type='radio'
              name='howInspect'
              onChange={this.auto.bind(this)} />
            <label htmlFor='aoiInspect' className='roundActionIcon dbblRound onblueHover'>
              <i className="fas fa-camera fa-3x"></i>
              <br /><i className='medBig'>AOI</i>
            </label>
          </span>
        </fieldset>
      : null}
      
    
        <fieldset className='stoneForm'>
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
              <i className='tempTag medBig' key={index}>
                <button
                  type='button'
                  name={entry}
                  ref={(i)=> this.ex = i}
                  className='miniAction big redT'
                  onClick={()=>this.down(entry)}
                ><i className="fas fa-times"></i>
                </button>  <UserNice id={entry} />
              </i>
          )})}
        </fieldset>

        <fieldset className='stoneForm'>
          <p>
            <select
              id='mthb'
              className='cap'
              ref={(i)=> this.methodB = i}
              onChange={this.tool.bind(this)}
              required>
              <option value={false}></option>
              {this.props.methods.map( (entry, index)=>{
                if(entry.forSteps.includes(this.props.sKey)) {
                  return ( <option key={index} value={entry.title}>{entry.title}</option> );
                }else{null}
              })}
            </select>
            <label htmlFor='mthb'>{Pref.method}</label>
          </p>
        </fieldset>
    

        <fieldset className='stoneForm' disabled={this.state.whoB.size === 0 || this.state.howB === false}>
          <p>
            <span className='balance'>
              <button
                type='button'
                title='No Good, repeat First-Off'
                className='roundActionIcon dbblRound firstBad'
                ref={(i)=> this.goBad = i}
                disabled={false}
                onClick={this.notgood.bind(this)}>
                <i className="fas fa-times fa-4x"></i>
              </button>
              <button
                type='button'
                title='OK First-Off, continue process'
                className='roundActionIcon dbblRound firstBetter'
                ref={(i)=> this.go = i}
                disabled={secondOpinion}
                onClick={this.pass.bind(this)}>
                <i className="fas fa-check fa-4x"></i>
              </button>
            </span>
          </p>
          <p>
            <textarea
    			    type='text'
    			    id='oIss'
    			    ref={(i)=> this.issue = i}
    			    onChange={this.flaw.bind(this)}></textarea>
    			  <label htmlFor='oIss'>{Pref.outIssue}</label>
    			</p>
    		</fieldset>
     
      
      </AnimateWrap>
    );
  }
}

