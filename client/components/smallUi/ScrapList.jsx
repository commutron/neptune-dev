import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import JumpFind from './JumpFind.jsx';

// requires data
// array of barcodes that have been scrapped as props.data

export default class ScrapList extends Component	{

  render() {
    
    const data = this.props.data;
    const count = data.length;

    return (
      <div className='cap'>
        {count > 0 ?
          <details className='red'>
            <summary>Scrapped {Pref.item}s: {count}</summary>
          <div>
            {data.map( (entry, index)=>{
              return (
                <JumpFind
                  key={index}
                  title={entry}
                  sub=''
                  sty='action wide clear'
                />
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