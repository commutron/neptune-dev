import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';
import BlockForm from '../forms/BlockForm.jsx';
import {SolveBlock} from '../forms/BlockForm.jsx';
import {RemoveBlock} from '../forms/BlockForm.jsx';
// include:
/// entry
/// id
/// lock

export default class BlockRow extends Component {

  render () {
    
    const dt = this.props.entry;
    const unlock = Roles.userIsInRole(Meteor.userId(), 'run');
    
    const solved = dt.solve ? 
                    typeof dt.solve === 'object' ?
                    <b>
                      {dt.solve.action} - {moment(dt.solve.time).calendar()} by <UserNice id={dt.solve.who} />
                    </b>
                    :null
                    :null;
                        
    return (
			<tr>
				<td>{dt.block}</td>
        <td>{moment(dt.time).calendar()} by <UserNice id={dt.who} /></td>
        <td>{solved}</td>
        <td>
        {unlock && !this.props.lock && !solved ?
          <SolveBlock id={this.props.id} blKey={dt.key} />
        :null}
        </td>
        <td>
        {!this.props.lock && !solved ?
        <BlockForm id={this.props.id} edit={dt} />
        :null}
        </td>
        <td>
        {unlock && !this.props.lock && !solved ?
        <RemoveBlock id={this.props.id} blKey={dt.key} />
        :null}
        </td>
			</tr>
    );
  }
}