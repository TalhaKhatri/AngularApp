'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var issueCtrlStub = {
  index: 'issueCtrl.index',
  show: 'issueCtrl.show',
  create: 'issueCtrl.create',
  upsert: 'issueCtrl.upsert',
  patch: 'issueCtrl.patch',
  destroy: 'issueCtrl.destroy'
};

var commentCtrlStub = {
  showComments: 'commentCtrl.showComments'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var issueIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './issue.controller': issueCtrlStub,
  '../comment/comment.controller': commentCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Issue API Router:', function() {
  it('should return an express router instance', function() {
    issueIndex.should.equal(routerStub);
  });

  describe('GET /api/issues', function() {
    it('should route to issue.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'issueCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/issues/:id', function() {
    it('should route to issue.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'issueCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/issues', function() {
    it('should route to issue.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'issueCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/issues/:id', function() {
    it('should route to issue.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'issueCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/issues/:id', function() {
    it('should route to issue.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'issueCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/issues/:id', function() {
    it('should route to issue.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'issueCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/issues/:id/comments', function() {
    it('should route to comment.controller.showComments', function() {
      routerStub.get
        .withArgs('/:id/comments', 'authService.isAuthenticated', 'commentCtrl.showComments')
        .should.have.been.calledOnce;
    });
  });
});
