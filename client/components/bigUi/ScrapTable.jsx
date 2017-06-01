import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ScrapGroup from './ScrapGroup.jsx';

// requires data
// all batchData
export default class ScrapTable extends Component {

  render () {

    return (
      <div>
        <table className='wide'>
          <thead className='fadeRed cap'>
            <tr>
              <th>{Pref.batch}</th>
              <th>{Pref.item}</th>
              <th>{Pref.group}</th>
              <th>{Pref.widget}</th>
							<th>who</th>
							<th>when</th>
							<th>{Pref.trackStep}</th>
              <th>comment</th>
            </tr>
          </thead>
          {this.props.batchData.map( (entry, index)=>{
            if(entry.scrap > 0) {
              return (
                <ScrapGroup key={index} batchData={entry} />
                );
            }else{null}
          })}
        </table>
      </div>
    );
  }
}