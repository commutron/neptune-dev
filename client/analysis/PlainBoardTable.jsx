import React, {Component} from 'react';

import BoardTableRow from './BoardTableRow.jsx';

export default class PlainBoardTable extends Component {
  
  render () {
    
    let data = this.props.data;
    
    if(data.length < 1) {
      return (<div>Empty Database</div>)
    }
    

    return (
      <div>
        
        
        <table className='entriesTable'>
          <tbody>
            <tr>
              <th>Board Number</th>
              <th>Work Order</th>
              <th>Created Date / Time</th>
              <th>1st Step</th>
              <th>2nd Step</th>
              <th>3rd Step</th>
              <th>4th Step</th>
              <th>5th Step</th>
            </tr>
            {data.map( (entry)=>{
            return <BoardTableRow key={entry._id} entry={entry} />
            })} 
          </tbody>
        </table>
          
        
      </div>
    )
  }
}