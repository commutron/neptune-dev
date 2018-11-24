import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
//import RoleCheck from '/client/components/utilities/RoleCheck.js';
import UserNice from '../smallUi/UserNice.jsx';
import AnimateWrap from '../tinyUi/AnimateWrap.jsx';

// id={this.props.id}
// barcode={this.props.barcode}
// sKey={thhis.props.sKey}
// step={this.props.step}
// users={this.props.users}
// methods={this.props.methods}

export default class FirstForm extends Component	{

  constructor() {
    super();
    this.state = {
      stepKey: false,
      stepName: false,
      changes: '',
      howI: false,
      whoB: new Set(),
      howB: false,
      good: true,
      ng: false,
    };
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
  }
  
  setStep() {
    const stepKey = this.repeatStep.value;
    const stepName = this.props.flowFirsts.find( x => x.key === stepKey ).step;
    if(!stepKey) {
      null;
    }else{
      this.setState({ stepKey: stepKey });
      this.setState({ stepName: stepName });
      !stepName.toLowerCase().includes('smt') ? 
        null :
          this.setState({ howInspect: 'auto' });
    }
  }
  
  setChanges() {
    !this.change.value ? null :
    this.setState({ changes: this.change.value.trim().toLowerCase() });
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
    
    const sKey = this.props.sKey ? this.props.sKey : this.state.stepKey;
		const step = this.props.step ? this.props.step : this.state.stepName;
      
    const howI = this.state.howI ? this.state.howI : 'manual';
    const whoB = [...this.state.whoB];
    const howB = this.state.howB;
    const good = this.state.good;
    const diff = this.state.changes;
    const ng = this.state.ng;
    
		Meteor.call('addFirst', id, bar, sKey, step, good, whoB, howB, howI, diff, ng, (error, reply)=>{
		  error && console.log(error);
		  if(reply) {
		    document.getElementById('lookup').focus();
     	  this.props.changeVerify();
			 }else{
			   Bert.alert(Pref.blocked, 'danger');
			 }
		});
	}


  render() {
    
    let secondOpinion = this.state.whoB.has(Meteor.userId()) ? true : false;
    
    const stepKey = this.props.sKey ? this.props.sKey : this.state.stepKey;
    const stepName = this.props.step ? this.props.step : this.state.stepName;
    
    return(
      <AnimateWrap type='contentTrans'>
      
        <div className='vspace noCopy stoneFrame'>
          <div className='actionBox blue'>
          	<div className='flexRR'>
	          	<button
	          		className='action clear'
	          		onClick={()=>this.props.changeVerify()}>
	          		{Pref.close}
	          	</button>
          	</div>
        		<p className='bigger centreText up'>
        		  {this.props.step ? this.props.step : 'Repeat'}</p>
        		<br />
            {!this.props.sKey ?
              <fieldset className='stoneForm'>
                <p>
                  <select
                    id='whatfirst'
                    className='cap'
                    ref={(i)=> this.repeatStep = i}
                    onChange={this.setStep.bind(this)}
                    defaultValue={this.state.stepKey}
                    required>
                      <option></option>
                      {this.props.flowFirsts.map( (dt)=>{
                        return (
                          <option key={dt.key} value={dt.key}>{dt.step}</option>
                      )})}
                  </select>
                  <label htmlFor='whatfirst'>Repeat First-off</label>
                </p>
                <p>
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
            		    ref={(i)=> this.change = i}
            		    onChange={this.setChanges.bind(this)}
            		    defaultValue={this.state.changes} />
                  <label htmlFor='proC'>Process Changes</label>
                </p>
              </fieldset>
            : null }
      
            {stepName && stepName.toLowerCase().includes('smt') ?
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
                  {this.props.app.toolOption.map( (entry, index)=>{
                    if(entry.forSteps.includes(stepKey)) {
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
            <br />
          </div>
        </div>
      
      </AnimateWrap>
    );
  }
}

