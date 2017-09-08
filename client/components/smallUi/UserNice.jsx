import React, {Component} from 'react';

export default class UserNice extends Component {
  
  find() {
    const name = Meteor.users.findOne({_id : this.props.id});
    let nice = 'not found';
    name ? nice = name.username : false;
    return nice;
  }

  render() {

    return (
      <i className='cap'>{this.find()}</i>
    );
  }
}