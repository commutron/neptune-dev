import React, {Component} from 'react';

import ScrapRow from './ScrapRow.jsx';

// requires
// Single batchData
export default class ShortGroup extends Component	{
  
  filter() {
    const data = this.props.batchData.items;
    if(data != undefined) {
      let scList = [];
      data.map( (entry)=>{
        // check history for...
        for(let value of entry.history) {
          // scraps
          if(value.type === 'scrap') {
            scList.push([entry.serial, value]);
          // other
          }else{null}
        }
       });
       return scList;
    }else{
      return [];
    }
  }
  
  

  //// Batch Section \\\\
  render () {

    let b = this.props.batchData;
    let sc = this.filter();

    return (
      <tbody>
        {sc.map( (entry, index)=>{
          return (
            <ScrapRow 
              key={index}
              entry={entry[1]}
              id={b._id}
              group={b.group}
              batchNum={b.batch}
              wIdget={b.wIdget}
              barcode={entry[0]} />
            );
        })}
      </tbody>
      );
  }
}