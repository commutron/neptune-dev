### Initial Setup

A new instance requires an organization entry in MongoDB collection 'AppDB' and 
a user account in MongoDB collection 'Meteor.users'.
 
The base app configuration is under 'addFirstSetting' in 'server/dbCRUD/appMethods'.

The initial account configuration is under 'Accounts.onCreateUser' in 'server/dbCRUD/userMethods'.

The user account must be linked to organization by matching "org" and "orgKey" keys and 
added to Roles "active" and "admin".

This setup can be initiated with Neptune.

1. Un-comment 'addFirstSetting' in 'server/dbCRUD/appMethods'.
2. Un-comment 'initialsetup' in 'client/components/routes'.
3. Deploy
4. Navigate to [host]/initialsetup
5. Click "First Account"
6. Click "Setup"

The first account will be created as:
- username: 'administrator'
- password: 'theonlywaterintheforestistheriver'

### Email Setup

To enable email add enviroment variable:

MAIL_URL="smtps://[email address]:[password]@[email server]:[outgoing port]"

and enable "Enable Email" in Neptune Settings/Notifications