'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var commentCtrlStub = {
  index: 'commentCtrl.index',
  show: 'commentCtrl.show',
  create: 'commentCtrl.create',
  upsert: 'commentCtrl.upsert',
  patch: 'commentCtrl.patch',
  destroy: 'commentCtrl.destroy'
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
var commentIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './comment.controller': commentCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Comment API Router:', function() {
  it('should return an express router instance', function() {
    commentIndex.should.equal(routerStub);
  });

  describe('GET /api/comments', function() {
    it('should route to comment.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'commentCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/comments/:id', function() {
    it('should route to comment.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'commentCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/comments', function() {
    it('should route to comment.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'commentCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/comments/:id', function() {
    it('should route to comment.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'commentCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/comments/:id', function() {
    it('should route to comment.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'commentCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/comments/:id', function() {
    it('should route to comment.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'commentCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
