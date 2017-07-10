'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './issue.events';

var IssueSchema = new mongoose.Schema({
  title: String,
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  asignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  state: {type: String, default: 'pending'},
}, {
  timestamps: true
});

registerEvents(IssueSchema);
export default mongoose.model('Issue', IssueSchema);
