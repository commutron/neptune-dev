import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';

// requires
/*
id={b._id}
nc={nc}
done={done}
*/

export default class NCTable extends Component	{

  render() {
    
    return (
      <div>
      {this.props.nc.length > 0 ?
        <table className='wide'>
          <thead className='red cap'>
            <tr>
              <th>Ref</th>
							<th>type</th>
							<th>where</th>
							<th>time</th>
							<th>who</th>
							<th>fixed</th>
              <th>fixer</th>
              <th>inspected</th>
              <th>inspector</th>
              <th>skipped</th>
              <th>skipper</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.nc.map( (entry, index)=>{
              return (
                <NCRow
                  key={index}
                  entry={entry}
                  id={this.props.id}
                  done={this.props.done}
                  multi={this.props.multi} />
              );
            })}
          </tbody>
          <thead className='red cap'>
            <tr>
              <th>Ref</th>
							<th>type</th>
							<th>where</th>
							<th>time</th>
							<th>who</th>
							<th>fixed</th>
              <th>fixer</th>
              <th>inspected</th>
              <th>inspector</th>
              <th>skipped</th>
              <th>skipper</th>
              <th></th>
            </tr>
          </thead>
        </table>
      :
        <div className='centreText fade'>
          <i className='fa fa-smile-o fa-3x' aria-hidden="true"></i>
          <p className='big'>no {Pref.nonCon}s</p>
        </div>
      }
      </div>
    );
  }
}


export class NCRow extends Component {
  
  popNC(ncId) {
    let check = 'Are you sure you want to remove this ' + Pref.nonCon;
    const yes = window.confirm(check);
    if(yes) {
      const id = this.props.id;
      Meteor.call('ncRemove', id, ncId, (error)=>{
        if(error)
          console.log(error);
      });
    }else{null}
  }
  
  render() {
    
    const dt = this.props.entry;
    const done = this.props.done;
    const multi = this.props.multi;
                   
     const fx = typeof dt.fix === 'object';
     const ins = typeof dt.inspect === 'object';
     const skp = typeof dt.skip === 'object';
     
     let fixed = fx ? moment(dt.fix.time).calendar() : '';
     let fixer = fx ? <UserNice id={dt.fix.who} /> : '';
     let inspected = ins ? moment(dt.inspect.time).calendar() : '';
     let inspector = ins ? <UserNice id={dt.inspect.who} /> : '';
     let skipped = skp ? moment(dt.skip.time).calendar() : '';
     let skipper = skp ? <UserNice id={dt.skip.who} /> : '';
     
     const remove = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) && !done;
                   
    return(
      <tr>
        {multi ? <td>{dt.serial}</td> : null}
        <td>{dt.ref}</td>
        <td>{dt.type}</td>
        <td>{dt.where}</td>
        <td>{moment(dt.time).calendar()}</td>
        <td><UserNice id={dt.who} /></td>
        <td>{fixed}</td>
        <td>{fixer}</td>
        <td>{inspected}</td>
        <td>{inspector}</td>
        <td>{skipped}</td>
        <td>{skipper}</td>
        <td>
          {remove ?
            <button
              className='miniAction redT'
              onClick={this.popNC.bind(this, dt.key)}
              readOnly={true}>
              <i className='fa fa-times'></i>
            </button>
          :null}
        </td>
      </tr>
    );
  }
}