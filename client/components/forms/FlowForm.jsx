import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

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
      flow: false,
      ncList: []
   };
  }
  
  setFlow(recSet) {
    let input = recSet;
    if(!input) {
      this.setState({ flow: false });
    }else{
      this.setState({ flow: input });
    }
  }
  
  setNCList(e) {
    let input = e.target.value;
    let tempList = this.state.ncList;
    let ncOn = tempList.find( x => x === input );
    if(ncOn) { 
      tempList.pop(input);
    }else{
      tempList.push(input);
    }
    this.setState({ ncList : tempList });
  }
  
  
  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const widgetId = this.props.id;
    const flowObj = this.state.flow;
    const ncLists = this.state.ncList;
    
    const flowTitle = this.title.value.trim().toLowerCase();
    
    // edit existing
    const f = this.state.fill;
    const edit = f ? this.props.existFlows.find( x => x.flowKey === f ) : false;
    const editId = edit ? edit.flowKey : false;
    
    if(!flowObj) {
      toast.warning('Cannot Save');
    }else if(editId) {
      Meteor.call('setBasicPlusFlow', widgetId, editId, flowTitle, flowObj, ncLists, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        this.out.value = 'saved';
        this.setState({ fill: false, flow: false, ncList: [] });
      });
    }else{
      Meteor.call('pushBasicPlusFlow', widgetId, flowTitle, flowObj, ncLists, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        this.out.value = 'saved';
        this.setState({ fill: false, flow: false, ncList: [] });
      });
    }
  }
    
  clean() {
    this.out.value = '';
  }
  
  preFill() {
    const optn = this.props.preFill;
    if(!optn) {
      this.setState({ fill: false});
    }else{
      Meteor.call('activeFlowCheck', optn.flowKey, (error, reply)=>{
        if(error)
          console.log(error);
        this.setState({ warn: reply});
        this.setState({ fill: optn.flowKey });
        optn.type === 'plus' && this.setState({ ncList: optn.ncLists });
      });
    }
  }

  render() {
    
    const f = this.state.fill;
    const e = f ? this.props.existFlows.find( x => x.flowKey === f ) : false;
    
    const warn = this.state.warn ? this.state.warn : false;
    
    const eN = e ? e.title : '';
    const eF = e ? e.flow : false;
    
    const name = this.props.edit ? 'Edit' : 'New Flow';

    return (
      <Model
        button={name}
        title={name}
        color='greenT'
        icon='fa-project-diagram'
        smIcon={this.props.small}
        lock={!Roles.userIsInRole(Meteor.userId(), 'edit') || this.props.lock}
        noText={this.props.noText}>
    
        <div>
          <div className='space'>
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
                  placeholder='descriptive title'
                  required />
                <label htmlFor='flwttl'>{Pref.flow} title</label>
              </p>
              <i className='small'>duplicate {Pref.flow} names are discouraged but not blocked</i>
            </form>
          </div>
          
          <hr />
          
          <h2 className='cap'>{Pref.flow}</h2>
          
          <FlowBuilder
            app={this.props.app}
            options={this.props.app.trackOption}
            end={this.props.app.lastTrack}
            baseline={eF}
            onClick={e => this.setFlow(e)} />
            
          <hr />
          
          <h2 className='cap'>{Pref.nonCon} lists</h2>
          
          <div>
            {this.props.app.nonConTypeLists.map( (entry, index)=>{
              let ncOn = this.state.ncList.find( x => x === entry.key );
              return(
              <label key={entry.key+index}>
                <input 
                  type='checkbox'
                  className='bigCheck'
                  value={entry.key}
                  onChange={(e)=>this.setNCList(e)}
                  defaultChecked={ncOn} />
                {entry.listPrefix}. {entry.listName}</label>
            )})}
            <p><em>If none are chosen the Legacy List will be used</em></p>
          </div>
          
          <hr />
  
          <div className='space centre'>
            <button
              type='submit'
              ref={(i)=> this.go = i}
              disabled={!this.state.flow}
              form='flowSave'
              className='action clearGreen'>SAVE</button>
            <br />
          </div>
        </div>
        
        <div className='centre'>
          <p><output ref={(i)=> this.out = i} /></p>
        </div>
        
      </Model>
    );
  }
  componentDidMount() {
    this.preFill();
  }
}


export const FlowRemove = ({ id, fKey })=>	{
  
  function pull() {
    Meteor.call('pullFlow', id, fKey, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === 'inUse') {
        toast.warning('Cannot be removed, is currently in use');
      }else if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
    
  return(
    <span>
      <button
        title='delete process flow *if not in use'
        className='transparent'
        onClick={()=>pull()}
        disabled={!Roles.userIsInRole(Meteor.userId(), 'edit')}>
        <label className='navIcon actionIconWrap'>
          <i className={'fas fa-trash fa-1x redT'}></i>
          <span className={'actionIconText redT'}>Delete</span>
        </label>
      </button>
    </span>
  );
};
