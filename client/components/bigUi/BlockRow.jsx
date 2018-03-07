import React from 'react';
import moment from 'moment';

import UserNice from '../smallUi/UserNice.jsx';
import BlockForm from '../forms/BlockForm.jsx';
import {SolveBlock} from '../forms/BlockForm.jsx';
import {RemoveBlock} from '../forms/BlockForm.jsx';

const BlockRow = ({ entry, id, lock })=> {
  let dt = entry;
  let unlock = Roles.userIsInRole(Meteor.userId(), 'run');
  let solved = dt.solve ? 
                typeof dt.solve === 'object' ?
                <b>
                  {dt.solve.action} - {moment(dt.solve.time).calendar()} by <UserNice id={dt.solve.who} />
                </b>
                :null
                :null;
  return(
		<tr>
			<td>{dt.block}</td>
      <td>{moment(dt.time).calendar()} by <UserNice id={dt.who} /></td>
      <td>{solved}</td>
      <td>
      {unlock && !lock && !solved ?
        <SolveBlock id={id} blKey={dt.key} />
      :null}
      </td>
      <td>
      {!lock && !solved ?
        <BlockForm id={id} edit={dt} smIcon={true} />
      :null}
      </td>
      <td>
      {unlock && !lock && !solved ?
        <RemoveBlock id={id} blKey={dt.key} />
      :null}
      </td>
		</tr>
  );
};

export default BlockRow;