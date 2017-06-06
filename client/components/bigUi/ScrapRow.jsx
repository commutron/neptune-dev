import React, {Component} from 'react';
import moment from 'moment';

import JumpFind from '../smallUi/JumpFind.jsx';
import UserNice from '../smallUi/UserNice.jsx';
// include:
/// entry
/// oId
/// oNum
/// oProd

export default class ScrapRow extends Component {

  render () {

    return (
			<tr>
        <td>{this.props.batchNum}</td>
        <td><JumpFind title={this.props.barcode} sub='' sty='smallAction clear' /></td>
        <td className='up'>{this.props.group}</td>
        <td className='up'>{this.props.wIdget}</td>
				<td className='cap'><UserNice id={this.props.entry.who} /></td>
        <td>{moment(this.props.entry.time).calendar()}</td>
        <td>{this.props.entry.step}</td>
        <td>{this.props.entry.comm}</td>
			</tr>
    );
  }
}