import React, {Component} from 'react';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';

// props
/// id={b._id}
/// nonCons={nonCons}

export default class NCTributary extends Component {
  render() {
    return(
      <InOutWrap type='ncTrans' add='grid'>
        {this.props.nonCons.map( (entry)=>{
          return (
            <NCStream key={entry.key} entry={entry} id={this.props.id} />
          )})}
      </InOutWrap>
    );
  }
}

export class NCStream extends Component {

    handleFix() {
			const id = this.props.id;
      const ncKey = this.props.entry.key;
        Meteor.call('fixNC', id, ncKey, (error)=> {
					if(error)
					  console.log(error);
				});
				let findBox = document.getElementById('find');
				findBox.focus();
        }

	  handleInspect() {
      const id = this.props.id;
      const ncKey = this.props.entry.key;
        Meteor.call('inspectNC', id, ncKey, (error)=> {
					if(error)
					  console.log(error);
				});
				let findBox = document.getElementById('find');
				findBox.focus();
        }
        
        
  render () {
    
    const fixed = this.props.entry.fix;
  
    const same = this.props.entry.fix.who === Meteor.userId();
    const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
    const lockI = fixed ? !same && inspector ? false : true : false;
    let skip = this.props.entry.skip;
    let style = !skip ? !fixed ? 'cap gridRow darkRed' : 'cap gridRow darkOrange' : 'cap gridRow yellow';

    return (
      <div className={style}>
        <div className='gridCell up'>{this.props.entry.ref}</div>
        <div className='gridCell'>{this.props.entry.type}</div>
        <div className='gridCell'>
          {skip ?
            <i>Skipped</i>
          :
            fixed ?
              <button 
                ref={(i)=> this.inspectline = i}
                className='pebble green'
                readOnly={true}
                onClick={this.handleInspect.bind(this)}
                disabled={lockI}>
              <img src='/inspectMini.svg' className='pebbleSVG' />Inspect</button>
          :
              <button 
                ref={(i)=> this.fixline = i}
                className='pebble greenBorder'
                readOnly={true}
                onClick={this.handleFix.bind(this)}
                disabled={false}>
              <img src='/repair.svg' className='pebbleSVG' />Repair</button>
          }
        </div>
      </div>
    );
  }
}