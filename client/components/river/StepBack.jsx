import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

export default class StepBack extends Component {
  
  //// Dangerous Component, use carefully \\\\

	  handle() {
      const id = this.props.id;
      const bar = this.props.bar;
      const entry = this.props.entry;
      const flag = entry.key;
      
      let replace = entry;
      replace.accept = false;
      
        Meteor.call('pullHistory', id, bar, flag, (error, reply)=> {
          if(error)
            console.log(error);
          if(reply) {
            Meteor.call('pushHistory', id, bar, replace, (error)=> {
              if(error)
                console.log(error);
            });
          }else{
            Bert.alert(Pref.blocked, 'danger');
          }
        });
	  }
        
  render () {
    return (
      <button
        className='miniAction redT'
        onClick={this.handle.bind(this)}
        disabled={this.props.lock}
        readOnly={true}
        ><i className='fa fa-times'></i></button>
    );
  }
}