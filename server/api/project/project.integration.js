'use strict';

/* globals describe, expect, it, before, after, beforeEach, afterEach */

var app = require('../..');
import User from '../user/user.model';
import Project from '../project/project.model';
import Issue from '../issue/issue.model';
import request from 'supertest';

var newProject;

describe('Project API:', function() {
  var user;
  var token;
  var initProject;
  var issue;

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
        initProject = new Project({
          title: 'New Project',
          owner: user._id,
          users: [user._id]
        });
        return initProject.save();
      });
    }, function(err) {
      if(err) console.log('Error saving project', err);
    })
    .then(() => {
      return Issue.remove().then(function() {
        issue = new Issue({
          title: 'New Issue',
          description: 'Issue description',
          project: initProject._id,
          assignee: user._id,
          creator: user._id
        });
        return issue.save();
      });
    }, function(err) {
      if(err) console.log('Error saving issue', err);
    });
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
    return User.remove().then(Project.remove().then(Issue.remove()));
  });
  describe('GET /api/projects', function() {
    var projects;

    beforeEach(function(done) {
      request(app)
        .get('/api/projects')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          projects = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      projects.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/projects', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/projects')
        .set('authorization', `Bearer ${token}`)
        .send({
          title: 'New Project',
          owner: user._id,
          users: [user._id]
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProject = res.body;
          done();
        });
    });

    it('should respond with the newly created project', function() {
      newProject.title.should.equal('New Project');
      newProject.owner.should.equal(user._id.toString());
      newProject.users.should.eql([user._id.toString()]);
    });
  });

  describe('GET /api/projects/:id', function() {
    var project;

    beforeEach(function(done) {
      request(app)
        .get(`/api/projects/${newProject._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          project = res.body;
          done();
        });
    });

    afterEach(function() {
      project = {};
    });

    it('should respond with the requested project', function() {
      project.title.should.equal('New Project');
      project.owner.should.equal(user._id.toString());
      project.users.should.eql([user._id.toString()]);
    });
  });

  describe('GET /api/projects/:id/users', function() {
    var users;

    beforeEach(function(done) {
      request(app)
        .get(`/api/projects/${newProject._id}/users`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          users = res.body;
          done();
        });
    });

    afterEach(function() {
      users = {};
    });

    it('should respond with the requested users belonging to the project', function() {
      users.should.eql({'users':[user._id.toString()]});
    });
  });

  describe('GET /api/projects/:id/issues', function() {
    var issues;
    beforeEach(function(done) {
      request(app)
        .get(`/api/projects/${initProject._id}/issues`)
        .set('authorization', `Bearer ${token}`)
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

    afterEach(function() {
      issues = {};
    });

    it('should respond with the issues belonging to the project', function() {
      issues[0]._id.should.equal(issue._id.toString());
    });

    it('should respond with a 404 when an issue does not exist in a project', function(done) {
      request(app)
        .get(`/api/projects/${newProject._id}/issues`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if(err) {
            console.log(err);
            return done(err);
          }
          done();
        });
    });
  });

  describe('PUT /api/projects/:id', function() {
    var updatedProject;

    beforeEach(function(done) {
      request(app)
        .put(`/api/projects/${newProject._id}`)
        .set('authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Project',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProject = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProject = {};
    });

    it('should respond with the updated project', function() {
      updatedProject.title.should.equal('Updated Project');
    });

    it('should respond with the updated project on a subsequent GET', function(done) {
      request(app)
        .get(`/api/projects/${newProject._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let project = res.body;
          project.title.should.equal('Updated Project');
          done();
        });
    });
  });

  describe('DELETE /api/projects/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/projects/${newProject._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when project does not exist', function(done) {
      request(app)
        .delete(`/api/projects/${newProject._id}`)
        .set('authorization', `Bearer ${token}`)
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
