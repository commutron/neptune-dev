import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

// props
/// options = buildStep options from the app settings
/// end = lastStep from app settings

export default class FlowForm extends Component	{

  constructor() {
    super();
    this.state = {
      steps: new Set(),
   };
    this.removeOne = this.removeOne.bind(this);
  }
  
  sendUp() {
    // steps set from state
    let list = this.state.steps;
    // add the finish step back on the end
    list.add(this.props.end);
    // Unlock save button
    this.props.onClick(list);
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
    
    // take off the end finish step
    list.delete(this.props.end);
    
    // add step to list
    list.add(step);
    // update state with the new list
    this.setState({ steps: list });
    
    // clear form
    this.rStep.value = '';
    this.wika.value = '';
    
    // lock save button
    this.props.onClick(false);
    
  }

  removeOne(entry) {
    const curr = this.state.steps;
    const nope = entry;
    // take of the end finish step
    curr.delete(this.props.end);
    // take off selected step
    curr.delete(nope);
    this.setState({steps: curr });
    // lock save button
    this.props.onClick(false);
  }
    
  clear() {
    this.setState({ steps: new Set() });
    // lock save button
    this.props.onClick(false);
  }

  render() {

    let steps = [...this.state.steps];

    return (
      <div className='split'>
        <div className='half'>
          <form onSubmit={this.addStep.bind(this)} >
            <p>
              <select id='rteps' ref={(i)=> this.rStep = i} className='cap' required>
                <option value=''></option>
                {this.props.options.map( (entry, index)=>{
                  return ( <option key={index} value={entry.key}>{entry.step + ' - ' + entry.type}</option> );
                })}
              </select>
              <label htmlFor='rteps'>tracking step</label>
            </p>
            <p>
              <input
                type='text'
                ref={(i)=> this.wika = i}
                id='winstruct'
                placeholder='surface_mount' />
              <label htmlFor='winstruct'>instruction title</label>
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
                    type='button'
                    name={entry}
                    ref={(i)=> this.ex = i}
                    className='smallAction red'
                    onClick={()=>this.removeOne(entry)}>x</button>                  
                </li>
              )})}
          </ul>
        <br />
        <i>Finish step is automatic</i>
        <br />
        <button
          className='smallAction clear up'
          onClick={this.clear.bind(this)}
          disabled={!this.state.steps.size}>clear</button>
        <button
          value={steps}
          className='smallAction clear greenT up'
          disabled={false}
          onClick={this.sendUp.bind(this)}>Set {Pref.flow}</button>
      </div>
    </div>
    );
  }

  componentDidMount() {
    const base = this.props.baseline;
    const ops = this.props.options;
    if(base) {
      baseSet = new Set();
      for(let t of base) {
        let o = ops.find(x => x.key === t.key);
        o ? o['how'] = t.how : null;
        o ? baseSet.add(o) : null;
      }
      this.setState({ steps: baseSet });
    }else{null}
  }
}