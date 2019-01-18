import React, {Component} from 'react';
//import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// requires Data
// action : a string to determine which method to use
// title : a string of the thing you want to delete
// check : a string for a conformation
// entry : the object to be deleted
export default class Remove extends Component	{
  
  remove(e) {
    e.preventDefault();
    this.cut.disabled = true;
    const confirm = this.confirm.value.trim();
      if(this.props.action === 'group') {
        Meteor.call('deleteGroup', this.props.entry, confirm, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/overview?request=groups');
          }else{
            toast.error('Rejected by Server');
            this.cut.disabled = false;
          }
        });
      }else if(this.props.action === 'widget') {
        Meteor.call('deleteWidget', this.props.entry, confirm, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/overview?request=groups');
          }else{
            toast.error('Rejected by Server');
            this.cut.disabled = false;
          }
        });
      }else if(this.props.action === 'batch') {
        Meteor.call('deleteBatch', this.props.entry._id, confirm, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            FlowRouter.go('/data/overview?request=batches');
            toast.success('Entry in BatchDB removed');
          }else{
            toast.error('Rejected by Server');
            this.cut.disabled = false;
          }
        });
      }else if(this.props.action === 'xbatch') {
        Meteor.call('deleteBatchX', this.props.entry, confirm, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/overview?request=batches');
          }else{
            toast.error('Rejected by Server');
            this.cut.disabled = false;
          }
        });
      }else if(this.props.action === 'item') {
        Meteor.call('deleteItem', this.props.entry._id, this.props.title, confirm, (error, reply)=>{
          if(error)
            console.log(error);
          if(reply === 'inUse') {
            toast.warning('Cannot do this, entry is in use');
          }else if(reply) {
            toast.success('Entry removed');
            FlowRouter.go('/data/batch?request=' + this.props.entry.batch);
          }else{
            toast.error('Rejected by Server');
            this.cut.disabled = false;
          }
        });
      }else {
        toast.error('Server Error');
        console.log('this component is not wired properly');
      }
  }

  render() {

    let title = this.props.title;
    let check = this.props.check.split('T')[0];
    const auth = Roles.userIsInRole(Meteor.userId(), 'remove');

    return (
      <Model
        button='Delete'
        title={'delete "' + title + '" from database'}
        color='redT'
        icon='fa-minus-circle'
        lock={!auth}
        noText={this.props.noText}>
        <div className='actionBox redT'>
          <br />
          <p>Are you sure you want to try to delete "{title}"?</p>
          <p>This cannot be undone and could cause unexpected consequences.</p>
          <br />
          <p>Enter "<i className='noCopy'>{check + ' '}</i>" to confirm.</p>
          <br />
          <form onSubmit={this.remove.bind(this)} className='inlineForm'>
            <input
              type='text'
              ref={(i)=> this.confirm = i}
              placeholder={check}
              autoFocus='true'
              className='noCopy redIn'
              required />
            <button
              className='smallAction clearRed'
              type='submit'
              ref={(i)=> this.cut = i}
              disabled={false}>DELETE</button>
          </form>
          <br />
        </div>
      </Model>
    );
  }
}