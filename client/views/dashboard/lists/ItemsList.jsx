import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';

export default class ItemsList extends Component	{
  
  filter() {
    const b = this.props.batchData;
    let ipList = [];
    let scList = [];
    if(b) {
      b.items.map( (entry)=>{
        // check if item is done
        if(entry.finishedAt === false) {
          ipList.push(entry.serial);
        }else{
          // check for scrap items
          for(let v of entry.history) {
            v.type === 'scrap' ? scList.push(entry.serial) : null;
          }
        }
      });
     return [ipList, scList];
   }else{null}
 }

  render() {
    
    const b = this.props.batchData;
    
    const filter = this.filter();
    const active = b ? filter[0] : [];
    const scrap = b ? filter[1] : [];

    return (
      <AnimateWrap type='cardTrans'>
        <div className='card centre' key={1}>
        {this.props.listTitle ? <h2 className='up'>{b.batch}</h2> : null}
            { b.items.map( (entry, index)=> {
            let style = active.includes(entry.serial) ? 'action clear wide greenT' : 
                        scrap.includes(entry.serial) ? 'action clear wide redT' : 
                        'action clear wide';
              return (
                <JumpButton
                  key={index} 
                  title={entry.serial} 
                  sub='' 
                  sty={style}
                />
              );
            })}
  			</div>
			</AnimateWrap>
    );
  }
}