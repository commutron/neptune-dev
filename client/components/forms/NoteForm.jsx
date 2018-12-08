import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// required data
//// Order Data or Customer Data as props.data
//// widget key as props.widgetKey
//// type as props.type === batch || widget
export default class NoteForm extends Component {

	saveNote(e) {
    e.preventDefault();
    this.go.disabled = true;
    const id = this.props.id;
    const versionKey = this.props.versionKey;
    const content = this.mess.value.trim();
    const choose = versionKey ? true : false;

    if(!choose) {
      if(this.props.xBatch) {
        Meteor.call('setBatchNoteX', id, content, (error)=>{
          error && console.log(error);
          this.out.value = 'saved';
        });
      }else{
        Meteor.call('setBatchNote', id, content, (error)=>{
          if(error)
            console.log(error);
          this.out.value = 'saved';
        });
      }
    }else if(choose) {
      Meteor.call('setVersionNote', id, versionKey, content, (error)=>{
        if(error)
          console.log(error);
        this.out.value = 'saved';
      });
    }else{
      console.log('NoteForm component not wired up corectly');
      toast.error('Server Error');
    }
  }
  
  goOp() {
    this.go.disabled = false;
    this.out.value = '';
  }
  

  render() {
    
    const now = this.props.content ? this.props.content : '';
    const choose = this.props.versionKey ? Pref.widget : Pref.batch;
    const unlock = !this.props.versionKey ? 
                   !Roles.userIsInRole(Meteor.userId(), 'run') : 
                   !Roles.userIsInRole(Meteor.userId(), 'edit');

    return (
      <Model
        button=''
        title={choose + ' notes'}
        color='blueT'
        icon='fa-edit'
        smIcon={this.props.small}
        lock={unlock}>
        <form
          className='centre'
          onSubmit={this.saveNote.bind(this)}
          onChange={this.goOp.bind(this)}>
          <br />
          <p>
            <textarea
              id='con'
              ref={(i)=> this.mess = i}
              cols='40'
              rows='10'
              placeholder='comments, alerts, messages'
              defaultValue={now}
              autoFocus='true'></textarea>
            <label htmlFor='con'>Note</label>
          </p>
          <p>
            <button
              ref={(i)=> this.go = i}
              disabled={true}
              className='action clearGreen'
              type='submit'>Save</button>
          </p>
          <br />
          <p><output ref={(i)=> this.out = i} value='' /></p>
        </form>
      </Model>
    );
  }
}