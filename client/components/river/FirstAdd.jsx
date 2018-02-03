import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import InputMulti from '../smallUi/InputMulti.jsx';

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
      availableSteps: new Set(),
      goforward: false,
      page: 1,
      step: false,
      howInspect: 'manual',
      changes: '',
      whoBuilt: [],
      howBuilt: false,
      stillIssue: '',
      good: true,
    };
  }
  
  componentWillMount() {
    const allFlows = this.props.allFlows;
    const riverKey = this.props.riverKey;
    const riverAltKey = this.props.riverAltKey;
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
    this.setState({ availableSteps: firsts });
  }
  
  goNext() {
    this.setState({ goforward: 'forward' });
    this.setState({ page: 2});
  }
  goBack() {
    this.setState({ goforward: 'backward' });
    this.setState({ page: 1});
  }
  
  setStep() {
    !this.repeatStep.value ? null :
    this.setState({ step: this.repeatStep.value });
  }
  
  setChanges() {
    !this.change.value ? null :
    this.setState({ changes: this.change.value.trim().toLowerCase() });
  }
  
  setHow() {
    !this.howI.checked ?
    this.setState({ howInspect: 'manual' }) :
    this.setState({ howInspect: 'auto' });
  }
  
  setTool() {
    !this.methodB.value ? null :
    this.setState({ howBuilt: this.methodB.value });
  }
  
  setIssue() {
    !this.issue.value ? null :
    this.setState({ stillIssue: this.issue.value.trim().toLowerCase() });
  }
  
  setWho(who) {
    !who ? null :
    this.setState({ whoBuilt: who });
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
    const serial = this.props.barcode;
    
    const sKey = this.state.step;
    const stepObj = [...this.state.availableSteps].find( x => x.key === sKey );
		const step = !stepObj ? null : stepObj.step; 
      
    const howI = this.state.howInspect;
    const diff = this.state.changes;
    const whoB = this.state.whoBuilt;
    const howB = this.state.howBuilt;
    const good = this.state.good;
    const ng = this.state.stillIssue;
      
		Meteor.call('addFirst', id, serial, sKey, step, good, whoB, howB, howI, diff, ng, (error, reply)=>{
		  if(error)
		    console.log(error);
		  if(reply) {
     		const findBox = document.getElementById('lookup');
			  findBox.focus();
			  this.props.doneClose();
			 }else{
			   Bert.alert(Pref.blocked, 'danger');
			 }
		});
	}

  render() {
    
    const a = this.props.app;
    
    const firsts = this.state.availableSteps;
    
    let secondOpinion = this.state.whoBuilt.includes(Meteor.userId());
    
    const movement = !this.state.goforward ? 
                     '' :
                     this.state.goforward === 'forward' ?
                     'forward' : 
                     'backward';
    
    const userOps = Array.from(this.props.users, x => { return {value: x._id, label: x.username } } );
    
    if(this.state.page === 1) {                 
      return(
        <InOutWrap type={movement}>
        <div className='actionForm inlineFirst' key='page1'>
            
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
              <input
                type='checkbox'
                id='howinspect'
                className='blueIn'
                ref={(i)=> this.howI = i}
                onChange={this.setHow.bind(this)}
                defaultChecked={this.state.howInspect === 'auto'} />
              <label htmlFor='howinspect'>AOI</label>
            </span>
            
            <span>
              <input
      			    type='text'
      			    id='proC'
      			    className='blueIn'
      			    ref={(i)=> this.change = i}
      			    onChange={this.setChanges.bind(this)}
      			    defaultValue={this.state.changes} />
              <label htmlFor='proC'>Process Changes</label>
            </span>
            
            <button
              title='Next'
              className='miniAction bigger'
              onClick={()=>this.goNext()}
              disabled={!this.state.step}>
              <i className='fas fa-arrow-right fa-lg'></i>
            </button>

        </div>
        </InOutWrap>
      );
    }
    
    if(this.state.page === 2) {    
      return(
        <InOutWrap type={movement}>
        <div className='actionForm inlineFirst' key='page2'>
          
          <button
            title='Back'
            className='miniAction bigger'
            onClick={()=>this.goBack()}>
            <i className='fas fa-arrow-left fa-lg'></i>
          </button>
          
          <span>
            <InputMulti
              id='whoBuilt'
              onChange={(e)=>this.setWho(e)}
              options={userOps}
              defaultEntries={this.state.whoBuilt}
            />
            <label htmlFor='whoBuilt'>Who Built</label>
          </span>
          
          <span>
            <select
              id='mthb'
              className='cap blueIn'
              ref={(i)=> this.methodB = i}
              onChange={this.setTool.bind(this)}
              defaultValue={this.state.howBuilt}
              required>
              <option></option>
              {a.toolOption.map( (entry, index)=>{
                if(typeof entry === 'string') {// redundant after migration
                  return ( <option key={index} value={entry}>{entry}</option> );
                }else if(typeof entry === 'object') {// redundant after migration
                  if(entry.forSteps.includes(this.state.step)) {
                      return ( <option key={index} value={entry.title}>{entry.title}</option> );
                    }else{null}
                  }else{null}
                })}
            </select>
            <label htmlFor='mthb'>Built With</label>
          </span>
            
          <span>
            <input
    			    type='text'
    			    id='oIss'
    			    className='blueIn'
    			    ref={(i)=> this.issue = i}
    			    onChange={this.setIssue.bind(this)}
    			    defaultValue={this.state.stillIssue} />
    			  <label htmlFor='oIss'>{Pref.outIssue}</label>
    			</span>
			    
			    <span className=''>
            <button
              type='button'
              className='miniAction bigger redT'
              ref={(i)=> this.goBad = i}
              disabled={this.state.whoBuilt.length === 0}
              onClick={this.notgood.bind(this)}>
              <i className="fas fa-times-circle fa-lg"></i>
            </button>
            <button
              type='button'
              className='miniAction bigger'
              ref={(i)=> this.go = i}
              disabled={this.state.whoBuilt.length === 0 || secondOpinion}
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