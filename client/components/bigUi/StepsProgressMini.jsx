import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

// requires 
/// batchData
/// flow

export default class StepsProgressMini extends Component	{

  render() {

    const b = this.props.batchData;
    const flow = this.props.flow;
    
    const iSteps = flow.filter( x => x.type === 'inspect' || x.type === 'test' || x.type === 'build');
    
    const normItems = b.items.filter( x => x.history.filter( y => y.type === 'scrap' ).length === 0 );
    
    const fItems = normItems.filter(x => x.finishedAt !== false);
    
    const scrapCount = b.items.length - normItems.length;
    
    return (
      <div className='wide max750'>
        {iSteps.map( (entry, index)=>{
          return(
            <StepCounter
              key={index}
              step={entry.step}
              type={entry.type}
              items={normItems} />
          )})}
        <MiniBar step={'Finished'} total={normItems.length} value={fItems.length} />
        {scrapCount > 0 ? <b className='redT cap'>{Pref.scrap}: {scrapCount}</b> : null}
      </div>
    );
  }
}

export class StepCounter extends Component {
  
  render() {
    
    const items = this.props.items;
    const total = items.length;
    const step = this.props.step;
    const type = this.props.type;

    let complete = 0;

    for(var item of items) {
      if(item.finishedAt !== false) {
        complete += 1; // scraps? rmas?
      }else{
        for(var i of item.history) {
          if(type === 'inspect') {
            i.good && i.step === step && i.type === 'inspect' ? complete += 1 : false;
            i.good && i.step === step && i.type === 'first' ? complete += 1 : false;
          }else{
            i.good && i.step === step && i.type === type ? complete += 1 : false;
          }
        }
      }
    }

    return(
      <MiniBar step={step + ' ' + type} total={total} value={complete} />
    );
  }
}

export class MiniBar extends Component	{
  
  render() {
    
    const v = this.props.value;
    const t = this.props.total;
    
    let name = {
      position: 'relative',
      top: '0.75rem',
    };
    
    let bar = {
      width: '100%'
    };
    
    let num = {
      textAlign: 'right'
    };
    
    return(
      <span>
        <p style={name} className='cap'>{this.props.step}</p>
        <progress style={bar} className='proGood' value={v} max={t}></progress>
        <p style={num}>{v}/{t}</p>
      </span>
    );
  }
}