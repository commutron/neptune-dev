import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';

// requires blocks data

export default class BlockNotes extends Component {

  render () {

    const blockers = this.props.data.sort((s1, s2) => {return s1.time < s2.time});

    return (
      <div>
        { blockers.length > 0 ?
            blockers.map( (entry, index)=>{
              return ( <BlockBox key={index} entry={entry}/> );
            })
          : null
        }
      </div>
    );
  }
}

export class BlockBox extends Component {
/// Display simple information about the Blocker \\\\
  render () {
  	
  	const dt = this.props.entry;

    let solved = dt.solve ? <p>{dt.solve.action}</p> : null;
    let color = solved ? '' : 'yellowBox';
    let when = solved ? dt.solve.time : dt.time;
    let who = solved ? dt.solve.who : dt.who;

    return (
    	<fieldset className={color}>
        <legend>{Pref.block}</legend>
        <p>{this.props.entry.block}</p>
        {solved}
				<div className='footerBar'>
          {moment(when).calendar()} - <UserNice id={who} />
        </div>
      </fieldset>
			);
  }
}