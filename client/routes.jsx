import React from 'react';
import {mount} from 'react-mounter';
import Pref from '/client/global/pref.js';

import { PublicLayout } from './layouts/MainLayouts.jsx';
import { BasicLayout } from './layouts/MainLayouts.jsx';
import { LandingLayout } from './layouts/MainLayouts.jsx';
import { ProductionLayout } from './layouts/ProLayout.jsx';
import { ExploreLayout } from './layouts/DataExploreLayout.jsx';
import { LabelLayout } from './layouts/MainLayouts.jsx';

import Login from './views/Login.jsx';
import ActivateUser from '/client/components/forms/ActivateUser.jsx';
import InitialSetup from './views/InitialSetup.jsx';

import ActivityData from './views/activity/ActivityData.jsx';
import ProdData from './views/production/ProdData.jsx';
import DataData from './views/data/DataData.jsx';
import CompSearchPanel from './views/data/panels/CompSearchPanel.jsx';
import AppData from './views/app/AppData.jsx';

import GeneralLabel from './views/paper/GeneralLabel.jsx';

import LandingWrap from './LandingWrap.jsx';

import { ProductionNightlyLayout } from './views/proNightly/layout/ProNight.jsx';
import ProdNightData from './views/proNightly/ProdData.jsx';

// Client Side Colllections
AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');
XBatchDB = new Mongo.Collection('xbatchdb');

FlowRouter.notFound = {
  action() {
    mount(PublicLayout, {
      content: (<p>Page Not Found</p>),
      link: ''
    });
  }
};

const exposedRoutes = FlowRouter.group({});

exposedRoutes.route('/login', {
  name: 'login',
  action() {
    mount(PublicLayout, {
       content: (<Login />)
    });
  }
});

exposedRoutes.route('/meta', {
  name: 'meta',
  action() {
    mount(LandingLayout, {
      content: (
        <div className='centreContainer'>
          <div className='centrecentre'>
            <p className='centre'>
              <img src='/titleLogo.svg' className='shadow noCopy' height='400' />
            </p>
            <div className='monoFont centreText'>
              <p>Neptune {Pref.neptuneVersion}</p>
              <p>Copyright (c) 2016-present Commutron Industries <a href='https://www.commutron.ca' target='_blank'>https://www.commutron.ca</a></p>
              <p>Author 2016-present Matthew Andreas <a href='https://github.com/mattandwhatnot' target='_blank'>https://github.com/mattandwhatnot</a></p>
              <p>All Rights Reserved, No Public License</p>
              <p>Source avaliable <a href='https://github.com/commutron/neptune-dev' target='_blank'>https://github.com/commutron/neptune-dev</a></p>
            </div>
          </div>
        </div>
      )
    });
  }
});

const privlegedRoutes = FlowRouter.group({
  triggersEnter: [
    ()=> {
      let route = FlowRouter.current();
      if(Meteor.loggingIn() || route.route.name === 'login' || route.route.name === 'activate') {
        null;
      }else if(!Meteor.userId()) {
        Session.set('redirectAfterLogin', route.path);
        FlowRouter.go('login');
      }else if(!Roles.userIsInRole(Meteor.userId(), 'active')) {
        FlowRouter.go('activate');
      }else{
        Session.set('redirectAfterLogin', route.path);
      }
    }
  ]
});

privlegedRoutes.route('/activate', {
  name: 'activate',
  action() {
    mount(PublicLayout, {
       content: (<ActivateUser />)
    });
  }
});

privlegedRoutes.route('/initialsetup', {
  name: 'initialsetup',
  action() {
    mount(PublicLayout, {
       content: (
        <div>
          <Login />
          <hr />
          <InitialSetup />
        </div>
      )
    });
  }
});

privlegedRoutes.route('/', {
  name: 'home',
  action() {
    mount(LandingLayout, {
       content: (<LandingWrap />),
       link: false
    });
  }
});

privlegedRoutes.route('/activity', {
  action() {
    mount(BasicLayout, {
      content: (<ActivityData />),
      link: 'act'
    });
  }
});

/*
privlegedRoutes.route('/dashboard', {
  action() {
    mount(DashLayout, {
      content: (<DashData />),
      link: 'dash'
    });
  }
});
*/
privlegedRoutes.route('/production', {
  action() {
    mount(ProductionLayout, {
      content: (<ProdData />),
      link: 'prod'
    });
  }
});

privlegedRoutes.route('/nightly/production', {
  action() {
    mount(ProductionNightlyLayout, {
      content: (<ProdNightData />),
      link: 'pronight'
    });
  }
});

privlegedRoutes.route('/starfish', {
  action() {
    mount(BasicLayout, {
      content: (<CompSearchPanel />),
      link: 'comp'
    });
  }
});

privlegedRoutes.route('/app', {
  action() {
    mount(BasicLayout, {
       content: (<AppData />),
       link: 'app'
    });
  }
});

privlegedRoutes.route('/print/generallabel/:batch', {
    action: function(params, queryParams) {
      if(queryParams !== null && typeof queryParams === 'object') {
        const request = Object.keys(queryParams);
        if(
          request.includes('group') &&
          request.includes('widget') &&
          request.includes('ver') &&
          request.includes('desc') &&
          request.includes('quant') &&
          request.includes('date')
        ) {
          mount(LabelLayout, {
            content: (<GeneralLabel batch={params.batch} data={queryParams} />)
          });
        }else{
          mount(BasicLayout, {
            content: (<p>Cannot Generate this page. Incomplete information</p>),
            link: ''
          });
        }
      }else{
        mount(BasicLayout, {
          content: (<p>Page Not Found</p>),
          link: ''
        });
      }
    },
    name: 'print'
});


// Explore Routing

privlegedRoutes.route('/data', {
  action() {
    mount(ExploreLayout, {
      content: (<DataData />),
      link: 'data'
    });
  }
});

// FlowRouter.go('/data/my-post?comments=on&color=dark');

privlegedRoutes.route('/data/:view', {
  name: 'explore', // optional
  // do some action for this route
  action: function(params, queryParams) {
    //console.log("Params:", params);
    //console.log("Query:", queryParams);
    mount(ExploreLayout, {
      content: (<DataData
                  view={params.view}
                  request={queryParams.request}
                  specify={queryParams.specify} />
                ),
      link: 'data',
      subLink: params.view + queryParams.request
    });
  },
});