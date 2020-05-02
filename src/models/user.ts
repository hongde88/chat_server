import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passcode: {
    type: Number
  },
  isVerified: {
    type: Boolean
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.set('useCreateIndex', true);

const User = mongoose.model('users', UserSchema);

export default User;
