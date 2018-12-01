import React from 'react';
import {mount} from 'react-mounter';
import Pref from '/client/global/pref.js';

import { PublicLayout } from './layouts/MainLayouts.jsx';
import { SplashLayout } from './layouts/MainLayouts.jsx';
import { CleanLayout } from './layouts/MainLayouts.jsx';
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

// Client Side Colllections
AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');
XBatchDB = new Mongo.Collection('xbatchdb');

FlowRouter.notFound = {
  action() {
    mount(PublicLayout, {
      content: (<p className='centreText'>Page Not Found</p>),
      title: '404'
    });
  }
};

const exposedRoutes = FlowRouter.group({});

exposedRoutes.route('/login', {
  name: 'login',
  action() {
    mount(PublicLayout, {
       content: (<Login />),
       title: 'User Login'
    });
  }
});

exposedRoutes.route('/meta', {
  name: 'meta',
  action() {
    mount(SplashLayout, {
      content: (
        <div className='centreSpash'>
          <div>
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
      ),
      title: Pref.neptuneIs
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
       content: (<ActivateUser />),
       title: 'User Activation'
    });
  }
});
/*
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
      ),
      title: 'Initial App Setup'
    });
  }
});
*/
privlegedRoutes.route('/', {
  name: 'home',
  action() {
    mount(SplashLayout, {
       content: (<LandingWrap />),
       title: Pref.neptuneIs
    });
  }
});

privlegedRoutes.route('/activity', {
  name: 'activity',
  action() {
    mount(CleanLayout, {
      content: (<ActivityData />)
    });
  }
});

privlegedRoutes.route('/production', {
  action() {
    mount(CleanLayout, {
      content: (<ProdData />)
    });
  }
});

privlegedRoutes.route('/starfish', {
  action() {
    mount(CleanLayout, {
      content: (<CompSearchPanel />)
    });
  }
});

privlegedRoutes.route('/app', {
  action() {
    mount(CleanLayout, {
       content: (<AppData />)
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
          request.includes('sales') &&
          request.includes('fulfill') &&
          request.includes('quant')
        ) {
          mount(LabelLayout, {
            content: (<GeneralLabel batch={params.batch} data={queryParams} />)
          });
        }else{
          mount(SplashLayout, {
            content: (<p>Cannot Generate this page. Incomplete information</p>),
            title: 'Error'
          });
        }
      }else{
        mount(SplashLayout, {
          content: (<p>Page Not Found</p>),
          title: '404'
        });
      }
    },
    name: 'print'
});


// Explore Routing

privlegedRoutes.route('/data', {
  action() {
    mount(CleanLayout, {
      content: (<DataData />)
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
    mount(CleanLayout, {
      content: (<DataData
                  view={params.view}
                  request={queryParams.request}
                  specify={queryParams.specify}
                  subLink={params.view + queryParams.request} />
                )
    });
  },
});