'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './issue.events';

var IssueSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(IssueSchema);
export default mongoose.model('Issue', IssueSchema);
