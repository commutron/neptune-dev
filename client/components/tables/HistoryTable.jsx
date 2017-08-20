import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';
import StepBack from '../river/StepBack.jsx';

// requires
/*
id={b._id}
serial={i.serial}
history={i.history}
done={done}
*/

export default class HistoryTable extends Component	{

  render() {
    
    return (
      <div>
        <table className='wide'>
          <thead className='green cap'>
            <tr>
              <th>step</th>
							<th>type</th>
							<th>time</th>
							<th>who</th>
							<th>comment</th>
							<th>inspect</th>
              <th>{Pref.builder}</th>
              <th>method</th>
              <th>change</th>
              <th>issue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.history.map( (entry, index)=>{
              return (
                <HistoryRow
                  key={index}
                  entry={entry}
                  id={this.props.id}
                  serial={this.props.serial}
                  done={this.props.done} />
              );
            })}
          </tbody>
          <thead className='green cap'>
            <tr>
              <th>step</th>
							<th>type</th>
							<th>time</th>
							<th>who</th>
							<th>comment</th>
							<th>inspect</th>
              <th>{Pref.builder}</th>
              <th>method</th>
              <th>change</th>
              <th>issue</th>
              <th></th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}


export class HistoryRow extends Component {
  
  render() {
    
    const dt = this.props.entry;
    const id = this.props.id;
    const serial = this.props.serial;
    
    const cancel = Roles.userIsInRole(Meteor.userId(), 'edit') && !this.props.done ? 
                   <StepBack id={id} bar={serial} entry={dt} />
                   : 
                   '';
                   
     let good = dt.good ? <i className='clean greenT'>G{cancel}</i> : <b className='up redT'>{Pref.ng}</b>;
     
     const info = typeof dt.info === 'object';
     
     let inspect = info ? dt.info.verifyMethod : '';
     let builder = info ? dt.info.builder.map( (e, i)=>{ return( <UserNice key={i} id={e} /> ) }) : '';
     let method = info ? dt.info.buildMethod : '';
     let change = info ? dt.info.change : '';
     let issue = info ? dt.info.issue : '';
                   
    return(
      <tr>
        <td>{dt.step}</td>
        <td>{dt.type}</td>
        <td>{moment(dt.time).calendar()}</td>
        <td><UserNice id={dt.who} /></td>
        <td>{dt.comm}</td>
        <td>{inspect}</td>
        <td>{builder}</td>
        <td>{method}</td>
        <td>{change}</td>
        <td>{issue}</td>
        <td>{good}</td>
      </tr>
    );
  }
}