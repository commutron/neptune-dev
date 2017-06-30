import React, {Component} from 'react';

// props
/// id={b._id}
/// bar={i.serial}
/// nonCons={nc}
/// ncOps={a.nonConOption}

export default class NCTributary extends Component {
  
  render() {
    return(
      <div>
        <div className='grid'>
          {this.props.nonCons.map( (entry, index)=>{
            return (
              <NCStream key={index} entry={entry} id={this.props.id} />
            )})}
        </div>
      </div>
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
    let style = !skip ? 'cap gridRow fadeRed' : 'cap gridRow fadeYellow';

    return (
      <div className={style}>
        <div className='gridCell'>{this.props.entry.ref}</div>
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
              <img src='/inspectMini.svg' className='pebbleSVG' />Inspected</button>
          :
              <button 
                ref={(i)=> this.fixline = i}
                className='pebble green'
                readOnly={true}
                onClick={this.handleFix.bind(this)}
                disabled={false}>
              <img src='/repair.svg' className='pebbleSVG' />Repaired</button>
          }
        </div>
      </div>
    );
  }
}