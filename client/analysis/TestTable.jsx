import React, {Component} from 'react';


export default class TestTable extends Component {



  render () {
    
    let testData = this.props.bData;
    
    let boxStyle = {
      backgroundColor: 'grey'
    }
    
    return (
      <div style={boxStyle}>
        
        <p>no griddle</p>


      </div>
    )
  }
}
