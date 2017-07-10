'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './project.events';

var ProjectSchema = new mongoose.Schema({
  title: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true
});

ProjectSchema.set('toObject', { getters: true });

registerEvents(ProjectSchema);
export default mongoose.model('Project', ProjectSchema);
