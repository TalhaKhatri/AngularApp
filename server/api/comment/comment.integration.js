'use strict';

/* globals describe, expect, it, before, after, beforeEach, afterEach */

import app from '../..';
import User from '../user/user.model';
import Issue from '../issue/issue.model';
import Project from '../project/project.model';
import request from 'supertest';

var newComment;

describe('Comment API:', function() {
  var user;
  var token;
  var issue;
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
    .then(() => {
      return Issue.remove().then(function() {
        issue = new Issue({
          title: 'New Issue',
          description: 'Issue description',
          project: project._id,
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
    return User.remove()
      .then(Project.remove()
        .then(Issue.remove()));
  });
  describe('GET /api/comments', function() {
    var comments;

    beforeEach(function(done) {
      request(app)
        .get('/api/comments')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          comments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      comments.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/comments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/comments')
        .set('authorization', `Bearer ${token}`)
        .send({
          content: 'New Comment',
          commentedOn: issue._id,
          postedBy: user._id
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newComment = res.body;
          done();
        });
    });

    it('should respond with the newly created comment', function() {
      newComment.content.should.equal('New Comment');
      newComment.commentedOn.should.equal(issue._id.toString());
      newComment.postedBy.should.equal(user._id.toString());
    });
  });

  describe('GET /api/comments/:id', function() {
    var comment;

    beforeEach(function(done) {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          comment = res.body;
          done();
        });
    });

    afterEach(function() {
      comment = {};
    });

    it('should respond with the requested comment', function() {
      comment.content.should.equal('New Comment');
      comment.commentedOn.should.equal(issue._id.toString());
      comment.postedBy.should.equal(user._id.toString());
    });
  });

  describe('PUT /api/comments/:id', function() {
    var updatedComment;

    beforeEach(function(done) {
      request(app)
        .put(`/api/comments/${newComment._id}`)
        .set('authorization', `Bearer ${token}`)
        .send({
          content: 'Updated Comment'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedComment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedComment = {};
    });

    it('should respond with the updated comment', function() {
      updatedComment.content.should.equal('Updated Comment');
    });

    it('should respond with the updated comment on a subsequent GET', function(done) {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let comment = res.body;
          comment.content.should.equal('Updated Comment');
          done();
        });
    });
  });

  describe('DELETE /api/comments/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when comment does not exist', function(done) {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
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
