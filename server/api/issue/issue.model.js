'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './issue.events';

var IssueSchema = new mongoose.Schema({
  title: String,
  description: String,
  project: mongoose.Schema.Types.ObjectId,
  asignee: mongoose.Schema.Types.ObjectId,
  creator: mongoose.Schema.Types.ObjectId,
  state: {type: String, default: 'pending'},
}, {
  timestamps: true
});

registerEvents(IssueSchema);
export default mongoose.model('Issue', IssueSchema);
