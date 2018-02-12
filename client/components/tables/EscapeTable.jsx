import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

// requires data
// escaped array

export default class EscapeTable extends Component	{

  render() {
    
    const data = this.props.data;

    return (
      <div>
        {data.length > 0 ?
        <table className='wide'>
          <thead className='red cap'>
            <tr>
              <th colSpan='6'>{Pref.escape} {Pref.nonCon}s</th>
            </tr>
            <tr>
  						<th>who</th>
  						<th>time</th>
              <th>ref</th>
              <th>type</th>
              <th>quantity</th>
              <th>ncar</th>
            </tr>
          </thead>
          {data.map( (entry)=>{
            return (
              <EscapeRow
                key={entry.key}
                entry={entry}
                id={this.props.id} />
            );
          })}
        </table>
        :
        <div className='centreText fade'>
          <i className='fas fa-smile fa-3x'></i>
          <p className='big'>no reported {Pref.escape} {Pref.nonCon}s</p>
        </div>
        }
      </div>
    );
  }
}

const EscapeRow = ({ entry, id })=> {
  let dt = entry;
  return(
    <tbody>
      <tr>
        <td><UserNice id={dt.who} /></td>
        <td>{moment(dt.time).calendar()}</td>
        <td>{dt.ref}</td>
        <td>{dt.type}</td>
        <td>{dt.quantity}</td>
        <td>{dt.ncar}</td>
      </tr>
    </tbody>
  );
};