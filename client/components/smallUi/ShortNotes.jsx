import React, {Component} from 'react';

// requires data
// short array as shData
export default class ShortNotes extends Component {

  render () {

    let shData = this.props.shData;
    const short = shData.sort((s1, s2) => {return s1.time < s2.time});

    return (
      <div>
        { shData.length > 0 ?
            short.map( (entry, index)=>{
              return ( <ShortBox key={index} entry={entry}/> );
            })
          : null
        }
      </div>
    );
  }
}

export class ShortBox extends Component {
/// Display simple information about the shortage \\\\
  render () {
  	
  	const dt = this.props.entry;

    let act = dt.followup ? 
    					'Received' : 
    					dt.resolve ? 
    					dt.resolve.action === 'order' ?
    					'Ordered' :
    					dt.resolve.action === 'dnp' ?
    					'DNP, Send Short' :
    					dt.resolve.action === 'sub' ?
    					'sub ' + dt.resolve.alt :
    					false :
    					false;

    return (
    	<fieldset className='yellowBox'>
        <legend className=''>Shortage <b>{act}</b></legend>
        <p>{this.props.entry.partNum}, {this.props.entry.quantity} pcs, {this.props.entry.comm}</p>
				<div className='footerBar'>
          {dt.time.toLocaleString()}
        </div>
      </fieldset>
			);
  }
}