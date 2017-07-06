'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './project.events';

var ProjectSchema = new mongoose.Schema({
  title: String,
  owner: mongoose.Schema.Types.ObjectId,
  users: [mongoose.Schema.Types.ObjectId],
}, {
  timestamps: true
});

registerEvents(ProjectSchema);
export default mongoose.model('Project', ProjectSchema);
