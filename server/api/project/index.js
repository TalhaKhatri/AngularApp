'use strict';
import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./project.controller');
var issueController = require('../issue/issue.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/:id/users', auth.isAuthenticated(), controller.showUsers);
router.get('/:id/issues', auth.isAuthenticated(), issueController.showProjectIssues);

module.exports = router;
