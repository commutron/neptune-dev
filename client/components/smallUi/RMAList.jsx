import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';
import RMAForm from '../forms/RMAForm.jsx';

// requires data
// rma array

export default class RMAList extends Component	{

  render() {
    
    const data = this.props.data;
    const id = this.props.id;

    return (
      <div>
        {data.length > 0 ?
          <details className='red'>
            <summary className='up'>{data.length} {Pref.rma}</summary>
          <div>
            { data.map( (dt, index)=>{
              return (
                <div key={index} className='infoBox'>
                  <div className='titleBar'>
                    RMA: {dt.rma} by <UserNice id={dt.createdWho} /> at {dt.createdAt.toLocaleString()}
                    { !dt.resolve ? 
                        <span className='rAlign'>
                          <RMAForm
                            id={id}
                            past={[]}
                            exist={dt}
                            nons={this.props.nons}
                            rmas={this.props.rmas} />
                        </span>
                    : null }
                  </div>
                  <p>NCAR: {dt.ncar}</p>
                  <p>Affected {Pref.item}s: {dt.barcodes.toString()}</p>
                  <p>Re Assembly Steps: {dt.reAssemble.toString()}</p>
                  <p>Resolved: {dt.resolve.toString()}/{dt.barcodes.length}</p>
                </div>
                );
            })}
          </div>
          </details>
          :
          null}
      </div>
    );
  }
}