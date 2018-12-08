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
    this.props.onClick([...list]);
  }

  addStep(e) {
    e.preventDefault();
    let list = this.state.steps; // steps set from state
    const sk = this.rStep.value; // key of the selected step
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
  
  moveUp(list, obj, indx) {
    let newList = list;
    if(indx === 0) {
      null;
    }else{
      newList.splice(indx, 1);
      newList.splice(indx - 1, 0, obj);
    }
    this.setState({ steps: new Set(newList) });
    // lock save button
    this.props.onClick(false);
  }
  
  moveDown(list, obj, indx) {
    let newList = list;
    if(indx === list.length - 1) {
      null;
    }else{
      newList.splice(indx, 1);
      newList.splice(indx + 1, 0, obj);
    }
    this.setState({ steps: new Set(newList) });
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
    
    const lockout = steps.filter( 
                      y => Object.values( y )
                        .includes( 'f1n15h1t3m5t3p' ) )
                          .length > 0;
    
    let options = this.props.options
                    .sort((t1, t2)=> {
                      if (t1.step < t2.step) { return -1 }
                      if (t1.step > t2.step) { return 1 }
                      return 0;
                    });

    return (
      <div className='split'>
        <div className='min350 max400'>
          <form onSubmit={this.addStep.bind(this)}>
            <p >
              <label htmlFor='rteps' className='inlineForm'><br />
                <select id='rteps' ref={(i)=> this.rStep = i} className='cap' required>
                  <option value=''></option>
                  {options.map( (entry, index)=>{
                    return ( <option key={index} value={entry.key}>{entry.step + ' - ' + entry.type}</option> );
                  })}
                </select>
                <button type='submit' className='smallAction clearWhite'>Add</button>
              </label>
              <i className='breath'></i>
              <label htmlFor='rteps'>Tracking Step</label>
            </p>
            <p>
              <input
                type='text'
                ref={(i)=> this.wika = i}
                id='winstruct'
                placeholder='surface_mount' />
              <label htmlFor='winstruct'>Instruction Section</label>
            </p>
          </form>
        </div>
        <span className='breath'></span>
        <div className='wide'>
          <div className='stepList'>
            { steps.map( (entry, index)=> {  
              return (                 
                <div key={index}>                      
                  <div>
                    {entry.step}
                  </div>
                  <div>
                    {entry.type}
                  </div>
                  <div>
                    {entry.how}
                  </div>
                  <div>
                    <button
                      type='button'
                      name='Move Up'
                      ref={(i)=> this.up = i}
                      className='smallAction blueHover'
                      onClick={()=>this.moveUp(steps, entry, index)}
                      disabled={lockout || index === 0}
                    ><i className='fas fa-arrow-up'></i></button>
                    <button
                      type='button'
                      name='Move Down'
                      ref={(i)=> this.dn = i}
                      className='smallAction blueHover'
                      onClick={()=>this.moveDown(steps, entry, index)}
                      disabled={lockout || index === steps.length - 1}
                    ><i className='fas fa-arrow-down'></i></button>
                    <button
                      type='button'
                      name='Remove'
                      ref={(i)=> this.ex = i}
                      className='smallAction redHover'
                      onClick={()=>this.removeOne(entry)}
                      disabled={lockout && entry.key !== 'f1n15h1t3m5t3p'}
                    ><i className='fas fa-times'></i></button>
                  </div>
                </div>
              )})}
          </div>
        <br />
        <button
          className='smallAction clearWhite up'
          onClick={this.clear.bind(this)}
          disabled={!this.state.steps.size}>clear</button>
        <button
          value={steps}
          className='smallAction clearGreen up'
          disabled={false}
          onClick={this.sendUp.bind(this)}>Set {Pref.flow}</button>
        <br />
        <p className='clean'>
          <i> The Finish Step is added and reordering is locked once the process flow is set.</i>
          <i> Remove the Finish Step to continue editing.</i>
        </p>
      </div>
    </div>
    );
  }

  componentDidMount() {
    const base = this.props.baseline;
    const ops = this.props.options;
    if(base) {
      let baseSet = new Set();
      for(let t of base) {
        let o = ops.find(x => x.key === t.key);
        o ? o['how'] = t.how : null;
        o ? baseSet.add(o) : null;
      }
      this.setState({ steps: baseSet });
    }else{null}
  }
}