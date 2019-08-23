import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

// requires
// widgetData={widgetData} end={a.lastTrack} rootWI={a.instruct}

export default class VersionForm extends Component	{

  constructor() {
    super();
    this.state = {
      instruct: '...'
   };
  }

  save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const wId = this.props.widgetData._id;
    
    const edit = this.props.versionData;
    const vKey = edit ? edit.versionKey : false;
    
    const version = this.rev.value.trim();
    const live = this.live ? this.live.checked : false;
    const wiki = this.wiki.value.trim().toLowerCase();
    const unit = this.unit.value.trim();
    
    if(edit) {
      Meteor.call('editVersion', wId, vKey, version, live, wiki, unit, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          toast.success('Saved');
          FlowRouter.go('/data/widget?request=' + this.props.widgetData.widget + '&specify=' + version);
        }else{
          toast.error('Server Error');
          this.go.disabled = false;
        }
      });
    }else{
      Meteor.call('addVersion', wId, version, wiki, unit, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          toast.success('Saved');
        }else{
          toast.error('Server Error');
          this.go.disabled = false;
        }
      });
    }
  }

  render() {
    
    const app = this.props.app;
    
    let e = this.props.versionData;
    let name = e ? `edit ${Pref.version}` : `new ${Pref.version}`;
    let eV = e ? e.version : null;
    let eU = e ? e.units : null;
    let eL = e ? e.live : null;
    
    const instruct = !e ? app.instruct : e.wiki;

    return (
      <Model
        button={name}
        title={name}
        color='greenT'
        icon='fa-cube fa-rotate-90'
        smIcon={this.props.small}
        lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}
        noText={this.props.noText}>

      <div className='split'>

        <div className='half space edit'>
          <form onSubmit={this.save.bind(this)}>
            <p>
              <input
                type='text'
                id='widgetId'
                defaultValue={this.props.widgetData.widget}
                disabled={true} />
              <label htmlFor='widgetId'>{Pref.widget} ID</label>
            </p>
            <p>
              <input
                type='text'
                id='prodiption'
                defaultValue={this.props.widgetData.describe}
                disabled={true} />
              <label htmlFor='prodiption'>{Pref.widget} Description</label>
            </p>
            <p>
              <input
                type='text'
                ref={(i)=> this.rev = i}
                id='rv'
                defaultValue={eV}
                placeholder='1a'
                inputMode='numeric'
                required />
              <label htmlFor='rv'>Version</label>
            </p>
            <p>
              <input
                type='number'
                ref={(i)=> this.unit = i}
                id='cln'
                pattern='[0-999]*'
                maxLength='3'
                minLength='1'
                max='100'
                min='1'
                defaultValue={eU}
                placeholder='1-100'
                inputMode='numeric'
                required />
              <label htmlFor='cln'>{Pref.unit} Quantity</label>
            </p>
            <hr />
            <p>
              <input
                type='url'
                id='wikdress'
                ref={(i)=> this.wiki = i}
                defaultValue={instruct}
                placeholder='Full Address'
                 />{/*this.state.instruct*/}
              <label htmlFor='wikdress'>Work Instructions</label>
            </p>
            <br />
            {e ?
              <fieldset>
                <input
                  type='checkbox'
                  ref={(i)=> this.live = i}
                  defaultChecked={eL} />
                <label htmlFor='actv'>{Pref.live} {Pref.widget}</label>
              </fieldset>
            : null}
            <br />
            <button
              type='submit'
              className='action clearGreen'
              ref={(i) => this.go = i}
              disabled={false}>SAVE</button>
          </form>
        </div>

        <div className='half'>
          <iframe
            id='instructMini'
            src={instruct}
            height='600'
            width='100%' />
        </div>

      </div>
    </Model>
    );
  }
}

export class VersionRemove extends Component	{
  
  remove(e) {
    e.preventDefault();
    const wId = this.props.widgetId;
    const vKey = this.props.versionKey;
    const confirm = this.confirm.value.trim();
    
    Meteor.call('deleteVersion', wId, vKey, confirm, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === 'inUse') {
        toast.warning('Cannot be removed, entry is in use');
      }else if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Rejected by Server');
      }
    });
  }
  
  render() {
    
    return(
      <Model
        button='Delete'
        title={'Delete ' + Pref.version}
        color='redT'
        icon='fa-minus-circle'
        smIcon={this.props.small}
        lock={!Roles.userIsInRole(Meteor.userId(), 'remove')}>
        
        <div className='centre'>
          <p>To remove enter:</p>
          <p className='noCopy'>{this.props.lock}</p>
          <br />
          <form className='inlineForm' onSubmit={this.remove.bind(this)}>
            <input 
              type='text' 
              className='noCopy' 
              ref={(i)=> this.confirm = i}
              placeholder={this.props.lock} />
            <button
              type='submit'
              ref={(i)=> this.cut = i}
              className='smallAction clear redT'
            >delete</button>
          </form>
        </div>
      </Model>
    );
  }
}