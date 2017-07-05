'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './comment.events';

var CommentSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(CommentSchema);
export default mongoose.model('Comment', CommentSchema);
