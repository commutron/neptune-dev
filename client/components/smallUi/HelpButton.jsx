import React, {Component} from 'react';

// in progress //

export default class ProWrap extends Component	{

  constructor() {
    super();
    this.state = {
      help: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  //// Help Popup \\\\
    handleClick() {
      this.setState({ help: !this.state.help });
    }


  //// Split Screen Layout \\\\
  render () {

    return (
      <div id='view'>
          <div>
            <button className='helpIcon' onClick={this.handleClick}>?</button>
            { this.state.help ?
              <div className='helpPop'>
                <p>You can find many things here.</p>
                <ul>
                  <li>Boards</li>
                  <li>Work Orders</li>
                  <li>Customers</li>
                  <li>Products</li>
                </ul>
                <p>A customer can be found by thier full name or by thier abbreviation. As in "international road dynamics" or "ird".</p>
                <p>A product can only be found by its exact ID. That means "185017-01" will work but "185017" or "ird 17" or "isinc w3" will not.</p>
                <p>If you can't remember a product's ID don't worry, just enter the customer and all thier products will be listed.</p>
                <p>To create a new board, first you need to find the product.</p>
                <p>To create a new customer or product, enter "new"</p>
                <p>For just the Wiki, enter "wiki" <i>currently not woking</i></p>
                
                <div className='helpPop'>
              <p>You can find many things here.</p>
              <ul>
                <li>{Pref.item}s</li>
                <li>{Pref.batch}s</li>
                <li>{Pref.group}s</li>
                <li>{Pref.widget}s</li>
              </ul>
              <p>A customer can be found by thier full name or by thier abbreviation. As in "international road dynamics" or "ird".</p>
              <p>A product can only be found by its exact ID. That means "185017-01" will work but "185017" or "ird 17" or "isinc w3" will not.</p>
              <p>If you can't remember a product's ID don't worry, just enter the customer and all thier products will be listed.</p>
              <p>To create a new board, first you need to find the product.</p>
            </div>
            
            
              </div>
              : null }

          </div>
      </div>
    );
  }
}