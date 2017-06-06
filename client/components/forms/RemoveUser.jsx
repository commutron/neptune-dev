import React, {Component} from 'react';

export default class RemoveUser extends Component {
  
  /*
  remove(e) {
    e.preventDefault();
    Meteor.call('removeUser', id, ()=>{
      Bert.alert({
        title: 'Success',
        message: 'User ' + id + ' Deleted',
        type: 'emerald',
        style: 'fixed-bottom',
        icon: 'fa-check'});
    });
  }
  */

  render () {
    return (
      <div>
        <p>
          <button
            type='submit'
            className='smallAction red'
            disabled='true'
          >delete account</button>
        </p>
      </div>
    );
  }
}