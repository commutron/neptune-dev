import React, {Component} from 'react';

import NCAdd from '../river/NCAdd.jsx';
import FirstAdd from '../river/FirstAdd.jsx';

// batchData, itemData, app, action

export default class FormBar extends Component	{
  
  constructor() {
    super();
    this.state = {
      showNC: true,
    };
  }
  
  render() {
    
    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    const v = this.props.versionData;
    const users = this.props.users;
    const app = this.props.app;
    
    return(
      <div className='dashAction'>
        <div className='footLeft'>
          
        </div>
        <div className='footCent'>
          {b && i ?
            this.state.showNC ?
              <NCAdd 
                id={b._id}
                barcode={i.serial}
                app={app} />
            :
              <FirstAdd
                id={b._id}
                barcode={i.serial}
                riverKey={b.river}
                riverAltKey={b.riverAlt}
                allFlows={w.flows}
                users={users}
                app={app} />
          :null}
        </div>
        <div className='footRight'>
        
          <span className='radioLabelPair'>
            <input
              type='radio'
              id='ncselect'
              name='formbarselect'
              onChange={()=> this.setState({showNC: !this.state.showNC})}
              defaultChecked />
            <label htmlFor='ncselect'>
              <i className='fas fa-bug fa-2x'></i>
            </label>
          </span>
          <span className='radioLabelPair'>
            <input
              type='radio'
              id='firstselect'
              name='formbarselect'
              onChange={()=> this.setState({showNC: !this.state.showNC})}
              disabled={b.finishedAt !== false || i.finishedAt !== false} />
            <label htmlFor='firstselect'>
              <i className='fas fa-flag-checkered fa-2x'></i>
            </label>
          </span>
        
        </div>
      </div>
    );
  }
}