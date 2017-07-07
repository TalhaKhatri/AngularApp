/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Issue from '../api/issue/issue.model';
import Project from '../api/project/project.model';
import Comment from '../api/comment/comment.model';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    Thing.find({}).remove()
      .then(() => {
        let thing = Thing.create({
          name: 'Development Tools',
          info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
                + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
                + 'Stylus, Sass, and Less.'
        }, {
          name: 'Server and Client integration',
          info: 'Built with a powerful and fun stack: MongoDB, Express, '
                + 'AngularJS, and Node.'
        }, {
          name: 'Smart Build System',
          info: 'Build system ignores `spec` files, allowing you to keep '
                + 'tests alongside code. Automatic injection of scripts and '
                + 'styles into your index.html'
        }, {
          name: 'Modular Structure',
          info: 'Best practice client and server structures allow for more '
                + 'code reusability and maximum scalability'
        }, {
          name: 'Optimized Build',
          info: 'Build process packs up your templates as a single JavaScript '
                + 'payload, minifies your scripts/css/images, and rewrites asset '
                + 'names for caching.'
        }, {
          name: 'Deployment Ready',
          info: 'Easily deploy your app to Heroku or Openshift with the heroku '
                + 'and openshift subgenerators'
        });
        return thing;
      })
      .then(() => console.error('finished populating things'))
      .catch(err => console.log('error populating things', err));

    User.find({}).remove()
      .then(() => {
        User.create({
          provider: 'local',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test'
        }, {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin'
        })
        .then(() => { 
          console.error('finished populating users');
          Project.find({}).remove()
          .then(() => {
            User.findOne({'name': 'Admin'}).exec(function (err, user) {
              if(err) return console.log("Error retrieving user", err);
              else {
                var project = new Project({title: 'New Project', owner: user._id});
                console.log('The user id found is: '+ user._id);
                project.save(function(err) {
                  if(err) {
                    console.error('Error while saving Project', err);
                  } else {
                    console.log('Project saved successfully!');
                  }
                });
              }
            });
          });
        })
        .catch(err => console.log('error populating users', err));
      });
    
    
  }
}
