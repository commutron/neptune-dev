import React, {Component} from 'react';

export default class RemoveUser extends Component {
  
  deleteForever() {
    const check = window.confirm('Delete this User Forever??');
    const userID = this.props.userID;
    const self = Meteor.userId() === userID;
    const pin = prompt("Enter PIN", "");
    if(check && !self && pin !== undefined) {
      Meteor.call('deleteUserForever', userID, pin, (error, reply)=>{
        if(error)
          console.log(error);
        reply ? alert('Account Deleted') : alert('not allowed');
      });
    }else{
      alert('not allowed');
    }
  }

  render () {
    return (
      <div>
        <p>
          <button
            type='button'
            className='miniAction red'
            onClick={this.deleteForever.bind(this)}
          >Delete User Account</button>
        </p>
      </div>
    );
  }
}