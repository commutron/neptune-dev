import React from 'react';


import TestChart from './TestChart.jsx';
import TestTable from './TestTable.jsx';

export default class AnalyzeWrap extends React.Component {
  

  
  
  render () {
    if(Boarddb.length < 1) {
      return (<div>Empty Database</div>)
    }
    

    return (
      <div>
        
        <div>
          <TestChart bData={this.bData()} ncData={this.ncData()} pData={this.pData()} />
          
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