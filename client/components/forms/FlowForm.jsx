import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

import Model from '../smallUi/Model.jsx';
import FlowBuilder from '../bigUi/FlowBuilder.jsx';

// requires
// id = widget ID
// existFlows = existing flows
// options = buildStep options from the app settings
// end = lastStep from app settings

export default class FlowForm extends Component	{

  constructor() {
    super();
    this.state = {
      fill: false,
      warn: false,
      flow: false
   };
  }
  
  back() {
    this.setState({ fill: false});
    this.setState({ warn: false});
  }
  
  setFlow(recSet) {
    let input = recSet;
    if(!input) {
      this.setState({ flow: false });
    }else{
      this.setState({ flow: [...input] });
    }
  }
  
  
  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const widgetId = this.props.id;
    const flowObj = this.state.flow;
    
    const flowTitle = this.title.value.trim().toLowerCase();
    
    // edit existing
    const f = this.state.fill;
    const edit = f ? this.props.existFlows.find( x => x.flowKey === f ) : false;
    const editId = edit ? edit.flowKey : false;
    
    if(!flowObj) {
      Bert.alert(Alert.warning);
    }else if(editId) {
      Meteor.call('setFlow', widgetId, editId, flowTitle, flowObj, (error)=>{
        if(error)
          console.log(error);
        Bert.alert(Alert.success);
        this.out.value = 'saved';
        this.setState({ fill: false });
        this.setState({ flow: false });
      });
    }else{
      Meteor.call('pushFlow', widgetId, flowTitle, flowObj, (error)=>{
        if(error)
          console.log(error);
        Bert.alert(Alert.success);
        this.out.value = 'saved';
        this.setState({ fill: false });
        this.setState({ flow: false });
      });
    }
  }
    
  clean() {
    this.out.value = '';
  }
  
  option() {
    this.out.value = '';
    const optn = this.pick.value;
    if(optn !== 'blank') { 
      Meteor.call('activeFlowCheck', optn, (error, reply)=>{
        if(error)
          console.log(error);
        this.setState({ warn: reply});
        this.setState({ fill: optn});
      });
    }else{
      this.setState({ fill: optn});
    }
  }

  render() {
    
    const f = this.state.fill;
    const e = f ? this.props.existFlows.find( x => x.flowKey === f ) : false;
    
    const warn = this.state.warn ? this.state.warn : false;
    
    const eN = e ? e.title : '';
    const eF = e ? e.flow : false;

    return (
      <Model
        button={Pref.flow}
        title={Pref.flow}
        lock={!Roles.userIsInRole(Meteor.userId(), 'edit') || this.props.lock}>
        
        {!this.state.fill ?
        
        <div className='centre'>
          <p>choose</p>
          <select ref={(i)=> this.pick = i} onChange={this.option.bind(this)}>
            <option></option>
            <option value='blank'>New</option>
            {this.props.existFlows.map( (entry, index)=>{
              return(
                <option key={index} value={entry.flowKey}>{entry.title}</option>
            )})}
          </select>
        </div>
          
          :
    
        <div>
          <div className='space'>
          <button className='action clear' onClick={this.back.bind(this)}>back</button>
            <form
              id='flowSave'
              className='centre'
              onSubmit={this.save.bind(this)}
              onChange={this.clean.bind(this)}
            >
            {warn ?
              <div className='centre'>
                <p><b>{eN}</b> is in used by</p>
                {warn === 'liveRiver' ?
                  <h3>An Active {Pref.batch} as the {Pref.buildFlow}</h3>
                : warn === 'liveAlt' ?
                  <h3>An Active {Pref.batch} as the {Pref.buildFlowAlt}</h3>
                : warn === 'liveAlt' ?
                  <h3>An Inactive {Pref.batch} as the {Pref.buildFlow}</h3>
                : warn === 'liveAlt' ?
                  <h3>An Inactive {Pref.batch} as the {Pref.buildFlowAlt}</h3>
                :
                  <p>something</p>}
              </div>
            : null}
              <p>
                <input
                  type='text'
                  ref={(i)=> this.title = i}
                  id='flwttl'
                  defaultValue={eN}
                  placeholder='title the defines this flow'
                  required />
                <label htmlFor='flwttl'>{Pref.flow} title</label>
              </p>
              <i className='small'>duplicate {Pref.flow} names are discouraged but not blocked</i>
            </form>
          </div>
          
          <hr />
          
          <FlowBuilder
            options={this.props.options}
            end={this.props.end}
            baseline={eF}
            onClick={e => this.setFlow(e)} />
            
          <hr />
  
          <div className='space centre'>
            <button
              type='submit'
              ref={(i)=> this.go = i}
              disabled={!this.state.flow}
              form='flowSave'
              className='action clear greenT'>SAVE</button>
            <br />
          </div>
        </div>}
        
        <div className='centre'>
          <p><output ref={(i)=> this.out = i} /></p>
        </div>
        
      </Model>
    );
  }
}


export class FlowRemove extends Component	{
  
  pull() {
    Meteor.call('pullFlow', this.props.id, this.props.fKey, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === 'inUse') {
        Bert.alert(Alert.inUse);
      }else if(reply) {
        Bert.alert( Alert.success );
      }else{
        Bert.alert( Alert.warning );
      }
    });
  }
  
  render() {
    
    return(
      <button
        className='actionSmall clear redT'
        onClick={this.pull.bind(this)}
        disabled={!Roles.userIsInRole(Meteor.userId(), 'edit')}
      >delete</button>
    );
  }
}