import React, {Component} from 'react';

export default class ActivateUser extends Component	{

  key(e) {
    e.preventDefault();
    pIn = this.pIn.value.trim();
    Meteor.call('activate', pIn, (err, reply)=>{
      if (err)
        console.log(err);
      !reply ? alert('Incorrect PIN') : false;
    });
  }
  
  render() {
    return(
      <form onSubmit={this.key.bind(this)} autoComplete='off'>
        <input
          type='password'
          ref={(i)=> this.pIn = i}
          id='pIn'
          pattern='[0000-9999]*'
          maxLength='4'
          minLength='4'
          cols='4'
          placeholder='Administrator PIN'
          inputMode='numeric'
          autoComplete='new-password'
          required
        />
      </form>
      );
  }
}