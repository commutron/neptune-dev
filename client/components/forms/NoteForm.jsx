import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

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
    const content = this.mess.value.trim().toLowerCase();
    const choose = versionKey ? true : false;

    if(!choose) {
      Meteor.call('setBatchNote', id, content, (error)=>{
        if(error)
          console.log(error);
        this.out.value = 'saved';
      });
    }else if(choose) {
      Meteor.call('setVersionNote', id, versionKey, content, (error)=>{
        if(error)
          console.log(error);
        this.out.value = 'saved';
      });
    }else{
      console.log('NoteForm component not wired up corectly');
      Bert.alert(Alert.danger);
    }
  }
  
  goOp() {
    this.go.disabled = false;
    this.out.value = '';
  }
  

  render() {
    
    const now = this.props.content ? this.props.content : '';
    const choose = this.props.versionKey ? Pref.widget : Pref.batch;

    return (
      <Model
        button={<i className='fa fa-pencil-square-o'></i>}
        title={choose + ' Notes'}
        type='miniAction big blueT'
      >
        <form className='centre' onSubmit={this.saveNote.bind(this)} onChange={this.goOp.bind(this)} >
          <p className='balance'><label htmlFor='con'>Note</label><br />
            <textarea
              id='con'
              ref={(i)=> this.mess = i}
              cols='40'
              rows='10'
              placeholder='comments, alerts, messages'
              defaultValue={now}
              autoFocus='true'
              required >
            </textarea>
          </p>
          <br />
          <p><button ref={(i)=> this.go = i} disabled={true} className='action clear greenT' type='submit'>Save</button></p>
          <p><output ref={(i)=> this.out = i} /></p>
        </form>
      </Model>
    );
  }
}