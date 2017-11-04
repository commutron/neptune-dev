import React from 'react';


import TestTable from './TestTable.jsx';

export default class AnalyzeWrap extends React.Component {
  

  
  
  render () {
    if(Boarddb.length < 1) {
      return (<div>Empty Database</div>)
    }
    

    return (
      <div>
        
        <div>
          
          
        </div>
        
        <br />
        <hr />
        <br />
        
        <div>
          <TestTable bData={this.bData()} />
        </div>
        
          
        
      </div>
    );
  }
}