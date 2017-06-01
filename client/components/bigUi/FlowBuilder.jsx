import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

// props
/// options = buildStep options from the app settings
/// end = lastStep from app settings

export default class FlowForm extends Component	{

  constructor() {
    super();
    this.state = {
      steps: new Set()
   };
    this.removeOne = this.removeOne.bind(this);
  }
  
  sendUp() {
    this.props.onClick(this.state.steps);
  }

  addStep(e) {
    e.preventDefault();
    let list = this.state.steps; // steps set from state
    const sk = this.rStep.value; // key ofth selected step
    const step = this.props.options.find( x => x.key === sk ); // the step object
    let h = this.wika.value.trim().toLowerCase(); // instruction title
    
    // get rid of propblem characters
    h = h.replace(" ", "_");
    h = h.replace("/", "_");
    
    // set how key in the track object
    step['how'] = h;
    
    // take of the end finish step
    list.delete(this.props.end);
    
    // add step to list
    list.add(step);
    // add the finish step back on the end
    list.add(this.props.end);
    // update state with the new list
    this.setState({steps: list });
    
    // clear form
    this.rStep.value = '';
    this.wika.value = '';
    
  }

  removeOne(entry) {
    const curr = this.state.steps;
    const nope = entry;
    curr.delete(nope);
    this.setState({steps: curr });
  }
  
  /* not atached to existing flow
  reset() {
    let list = new Set();
    let saved = this.props.flow[0]; 
      for(var s of saved) {
        if(s.flow.type !== 'finish') {
          list.add(s.step + '|' + s.type + '|' + s.how);
        }else{null}
      }
      this.setState({ steps: list });
    } */
    
  /*
    better UI, check for duplicate flow name 
    const doc = GroupDB.findOne({_id: id});
    const widget = doc.widgets.find(x => x.wIdget === widgetId);
    const duplicate = widget.flows.find(x => x.flowId === flowId);
  */
    
  clear() {
    this.setState({ steps: new Set() });
  }
  
  // future - edit an existing flow

  render() {

    let steps = [...this.state.steps];

    return (
      <div className='split'>
        <div className='half'>
          <form onSubmit={this.addStep.bind(this)} >
            <p><label htmlFor='rteps'>Tracking Step</label><br />
              <select id='rteps' ref={(i)=> this.rStep = i} className='cap' required>
                <option value=''></option>
                {this.props.options.map( (entry, index)=>{
                  return ( <option key={index} value={entry.key}>{entry.step + ' - ' + entry.type}</option> );
                })}
              </select></p>
            <p><label htmlFor='winstruct'>instruction title</label><br />
              <input
                type='text'
                ref={(i)=> this.wika = i}
                id='winstruct'
                placeholder='surface_mount' />
            </p>
            <br />
            <p><button type='submit' className='smallAction clear'>Add</button></p>
          </form>
        </div>
        <div className='half'>
          <ul className='stepList'>
            { steps.map( (entry, index)=> {            
              return (                 
                <li key={index} className=''>                      
                  {entry.step} - {entry.type} - {entry.how}                 
                  <button
                    name={entry}
                    ref={(i)=> this.ex = i}
                    className='smallAction red'
                    onClick={()=>this.removeOne(entry)}>x</button>                  
                </li>
              )})}
          </ul>
          <br />
        <button
          className='smallAction clear up'
          onClick={this.clear.bind(this)}
          onMouseUp={this.props.onClear}
          disabled={!this.state.steps.size}>clear</button>
        <button
          value={steps}
          className='smallAction clear greenT up'
          disabled={!this.state.steps.has(this.props.end)}
          onClick={this.sendUp.bind(this)}>Set {Pref.flow}</button>
      </div>
    </div>
    );
  }

/*
  componentDidMount() {
    this.reset();
  } */
}