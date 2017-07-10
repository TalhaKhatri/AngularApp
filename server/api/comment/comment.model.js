'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './comment.events';


var CommentSchema = new mongoose.Schema({
  content: String,
  commentedOn: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

registerEvents(CommentSchema);
export default mongoose.model('Comment', CommentSchema);
