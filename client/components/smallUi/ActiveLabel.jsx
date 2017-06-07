import React, {Component} from 'react';

// requires Data
// oData
export default class ActiveLabel extends Component	{

  change() {
    const batchId = this.props.id;
    const status = !this.props.active;
    Meteor.call('changeStatus', batchId, status, (error)=>{
      if(error)
        console.log(error);
    });
  }

  render() {

    let label = this.props.active ? 'status on' : 'status off';

    return (
      <button
        className={label}
        onClick={this.change.bind(this)}
        disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}>
      </button>
    );
  }
}