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
    
    inputMultiWrapSTY = {
      position: 'static',
      height: '32px',
      width: '300px',
      margin: '0 10px'
    };
    
    inputMultiSTY = {
      position: 'relative',
      top: '0',
      right: '0px',
      zIndex: '3',
      height: '32px',
      width: '300px',
      opacity: '0.01',
      border: '1px solid transparent',
    };
    
    inputMultiSelectedSTY = {
      position: 'absolute',
      zIndex: '1',
      height: '32px',
      width: '300px',
      padding: '0 5px',
      backgroundColor: 'transparent',
      border: '1px solid transparent',
      borderBottomColor: 'white',
      overflow: 'hidden'
    };
    
    endSpacerArrow = {
      position: 'relative',
      bottom: '30px',
      right: '2px',
      float: 'right',
      zIndex: '2',
      width: '25px',
      height: '32px',
      color: 'white'
    };
    
    return(
      <div className='inputMulti' style={inputMultiWrapSTY}>
      
        <div 
          className='inputMultiSelected'
          style={inputMultiSelectedSTY}>
          {[...this.state.choice].map( (entry)=>{
            const dspNm = this.props.options.find( x => x.value === entry );
            return(
              <i className='tempTag' key={entry}>
                {dspNm.label},</i>
          )})}
        </div>
        
        <select
          id='selectMultiOptions'
          ref={(i)=> this.sL = i}
          style={inputMultiSTY}
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
          
        <div style={endSpacerArrow}>
          <i className='fas fa-caret-down fa-fw'></i>
        </div>

      </div>
    );
  }
}