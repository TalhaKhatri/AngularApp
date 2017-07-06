'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './comment.events';


var CommentSchema = new mongoose.Schema({
  content: String,
  commentedOn: mongoose.Schema.Types.ObjectId,
  postedBy: mongoose.Schema.Types.ObjectId,
}, {
  timestamps: true
});

registerEvents(CommentSchema);
export default mongoose.model('Comment', CommentSchema);
