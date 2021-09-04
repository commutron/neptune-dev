import React from 'react';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '../tinyUi/LeapText.jsx';

import './style.css';

const RadioTableAll = ({ radioData })=> (
  <div>
    <table className='wide overviewTable'>
      <thead className='fadeRed cap'>
        <tr>
          <th>{Pref.radio.toUpperCase()}</th>
          <th>{Pref.group}</th>
          <th>{Pref.widget}</th>
					<th>{Pref.variant} State</th>
					<th>Live {Pref.xBatchs}</th>
        </tr>
      </thead>
      <tbody>
      {radioData.map( (rad, index)=>(
        <RadioRow 
          key={rad.vKey+index}
          rad={rad.rad}
          group={rad.group}
          widget={rad.widget}
          variant={rad.variant}
          vlive={rad.live}
          batchs={rad.liveBatch} />
      ))}
      </tbody>
    </table>
  </div>
);

export default RadioTableAll;

const RadioRow = ({ rad, group, widget, variant, vlive, batchs })=> (
	<tr>
    <td>{rad}</td>
    <td>
      <LeapTextLink
        title={group} 
        sty='blackT'
        address={'/data/overview?request=groups&specify=' + group}
      />
    </td>
    <td>
      <LeapTextLink
        title={widget.toUpperCase() + ' v.' + variant} 
        sty='blackT clean'
        address={'/data/widget?request=' + widget}
      />
    </td>
    <td>{vlive ? 'open' : 'closed'}</td>
    <td>{batchs}</td>
	</tr>
);