import React, {Component} from 'react';

export default class InputMulti extends Component	{
  
  constructor() {
    super();
    this.state = {
      choice: new Set()
    };
    this.handle = this.handle.bind(this);
  }
  
  componentWillMount() {
    for(let df of this.props.defaultEntries) {
      this.state.choice.add(df);
    }
  }
  
  handle() {
    let cH = this.state.choice;
    let oP = this.sL.value;
    if(!oP) {
      null;
    }else{
      cH.has( oP ) ? cH.delete( oP ) : cH.add( oP );
      this.setState({ choice: cH });
    }
    this.sL.value = null;
    this.props.onChange([...this.state.choice]);
  }
  
  render() {
    
    let inputMultiParentSTY = {
      height: '32px',
      width: '240px',
    };
    
    let inputMultiWrapSTY = {
      position: 'relative',
    };
    
    let inputMultiSTY = {
      position: 'absolute',
      top: '0',
      right: '0px',
      zIndex: '3',
      width: '240px',
      opacity: '0.01'
    };
    
    let inputMultiSelectedSTY = {
      position: 'absolute',
      zIndex: '1',
      height: '32px',
      width: '240px',
      overflow: 'hidden',
    };
    
    let selectLabel = {
      position: 'relative',
      bottom: '-32px',
      left: '0px',
      float: 'left',
      zIndex: '4',
      width: '240px',
    };
    
    let endSpacerArrow = {
      position: 'relative',
      bottom: '10px',
      right: '0px',
      float: 'right',
      zIndex: '2',
      width: '20px',
      height: '20px',
      color: 'white'
    };
    
    return(
      <div className={'inputMulti ' + this.props.classStyle} style={inputMultiParentSTY}>
      
      <div style={inputMultiWrapSTY}>
        
        <select
          id='selectMultiOptions'
          ref={(i)=> this.sL = i}
          style={inputMultiSTY}
          className={this.props.classStyle}
          onChange={()=>this.handle()}
        >
          <option></option>
          {this.props.options.map( (entry)=>{
            return(
              <option
                key={entry.value}
                value={entry.value}
              >{this.state.choice.has( entry.value ) ? 	"\u00D7 " : ''}
               {entry.label}</option> 
          )})}
        </select>
        <label
          id='selectMultiOptionsLabel'
          htmlFor='selectMultiOptions'
          style={selectLabel}
          className={this.props.classStyle}>
          {this.props.label}
        </label>
        
        <div
          id='inputMultiSelected'
          className='inputMultiSelected'
          style={inputMultiSelectedSTY}>
          {[...this.state.choice].map( (entry)=>{
            const dspNm = this.props.options.find( x => x.value === entry );
            return(
              <i className='tempTag' key={entry}>
                {dspNm.label},</i>
          )})}
        </div>
          
        <div style={endSpacerArrow}>
          <i className='fas fa-caret-down fa-fw'></i>
        </div>
        
        </div>
        
        

      </div>
    );
  }
}