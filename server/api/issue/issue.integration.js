'use strict';

/* globals describe, expect, it, before, after, beforeEach, afterEach */

var app = require('../..');
import User from '../user/user.model';
import Project from '../project/project.model';
import request from 'supertest';

var newIssue;

describe('Issue API:', function() {
  var user;
  var token;
  var project;

    // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    }, function(err) {
      if(err) console.log('Error saving user', err);
    })
    .then(() => {
      return Project.remove().then(function() {
        project = new Project({
          title: 'New Project',
          owner: user._id,
          users: [user._id]
        });
        return project.save();
      });
    }, function(err) {
      if(err) console.log('Error saving project', err);
    })
  });

  beforeEach(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
  });

  // Clear users after testing
  after(function() {
    return User.remove().then(Project.remove());
  });
  describe('GET /api/issues', function() {
    var issues;

    beforeEach(function(done) {
      request(app)
        .get('/api/issues')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          issues = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      issues.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/issues', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/issues')
        .send({
          name: 'New Issue',
          info: 'This is the brand new issue!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newIssue = res.body;
          done();
        });
    });

    it('should respond with the newly created issue', function() {
      newIssue.name.should.equal('New Issue');
      newIssue.info.should.equal('This is the brand new issue!!!');
    });
  });

  describe('GET /api/issues/:id', function() {
    var issue;

    beforeEach(function(done) {
      request(app)
        .get(`/api/issues/${newIssue._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          issue = res.body;
          done();
        });
    });

    afterEach(function() {
      issue = {};
    });

    it('should respond with the requested issue', function() {
      issue.name.should.equal('New Issue');
      issue.info.should.equal('This is the brand new issue!!!');
    });
  });

  describe('PUT /api/issues/:id', function() {
    var updatedIssue;

    beforeEach(function(done) {
      request(app)
        .put(`/api/issues/${newIssue._id}`)
        .send({
          name: 'Updated Issue',
          info: 'This is the updated issue!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedIssue = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedIssue = {};
    });

    it('should respond with the updated issue', function() {
      updatedIssue.name.should.equal('Updated Issue');
      updatedIssue.info.should.equal('This is the updated issue!!!');
    });

    it('should respond with the updated issue on a subsequent GET', function(done) {
      request(app)
        .get(`/api/issues/${newIssue._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let issue = res.body;

          issue.name.should.equal('Updated Issue');
          issue.info.should.equal('This is the updated issue!!!');

          done();
        });
    });
  });

  describe('PATCH /api/issues/:id', function() {
    var patchedIssue;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/issues/${newIssue._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Issue' },
          { op: 'replace', path: '/info', value: 'This is the patched issue!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedIssue = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedIssue = {};
    });

    it('should respond with the patched issue', function() {
      patchedIssue.name.should.equal('Patched Issue');
      patchedIssue.info.should.equal('This is the patched issue!!!');
    });
  });

  describe('DELETE /api/issues/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/issues/${newIssue._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when issue does not exist', function(done) {
      request(app)
        .delete(`/api/issues/${newIssue._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
