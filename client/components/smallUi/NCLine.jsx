import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from './UserNice.jsx';

export default class NCLine extends Component {
  
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
    
    const fix = dt.fix !== false ?
                <p>fixed: {moment(dt.fix.time).calendar()} by <UserNice id={dt.fix.who} /></p>
                :
                <p>fixed:</p>;
    
    const inspect = dt.inspect !== false ?
                    <p>inspected: {moment(dt.inspect.time).calendar()} by <UserNice id={dt.inspect.who} /></p>
                    :
                    <p>inspected:</p>;
    
    const skip = dt.skip !== false ?
                 <p>skipped: {moment(dt.skip.time).calendar()} by <UserNice id={dt.skip.who} /></p>
                 :
                 <p></p>;

    return (
      <div className='infoBox'>
        <div className='titleBar'>
          {dt.ref} {dt.type} {moment(dt.time).calendar()} by <UserNice id={dt.who} /> at {dt.where}
        </div>
        {dt.comm}
        {fix}
        {inspect}
        {skip}
        {Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']) ?
          <span className='rAlign'>
            <button
              className='miniAction blackT'
              onClick={this.popNC.bind(this, dt.key)}
              readOnly={true}
              ><i className='fa fa-times'></i>Remove</button>
          </span>
        :null}
        <hr />
      </div>
    );
  }
}