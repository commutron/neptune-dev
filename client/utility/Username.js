function find(id) {
  const user = Meteor.users.findOne({_id : id});
  let nice = 'not found';
  user ? nice = user.username : false;
  return nice;
}
    
const UserName = ({ id }) => (
  find(id)
);

export default UserName;