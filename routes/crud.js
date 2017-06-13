var log = require('../libs/log')(module);
var PhotoModel = require('../libs/mongoose').PhotoModel;
var passport = require('passport');
var formidable = require('formidable');
var fs = require('fs');
var uuid = require('node-uuid');
var path = require('path');


module.exports = function(app) {


  app.get('/crud', function(req, res) {
    log.info('Redirecting to CRUD');
    res.render('crud');
  });

  app.get('/', function(req, res) {

    log.info('Redirecting to home page');
    res.render('index');

  });

  app.get('/user', ensureAuthenticated, function(req, res) {
    log.info('Getting current user: ' + req.user.username);
    res.json(req.user.username);
  });

  // GET request:
  // Getting records by given query params with the same VkId as record's owner
  // query params such as limit and page allow to limit records amount
  app.get('/api/photos', ensureAuthenticated, function(req, res) {
    var page;
    var limit;
    if (req.query.page) {
      page = parseInt(req.query.page);
    } else {
      page = 0;
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    } else {
      limit = 10;
    }
    return PhotoModel.find({vkID: req.user.vkID}, null, {
      skip: page * limit,
      limit: limit,
      sort: {
        name: 1,
      },
    }, function(err, photos) {
      if (!err) {
        log.info('Getting the records by GET request');
        return res.json(photos);
      } else {
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        return res.json({error: 'Server error'}, 500);
      }
    })
  });

  // POST request:
  // Add the record to database
  app.post('/api/photos', ensureAuthenticated, function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (!files.file) {
        log.error('File input is not found');
        return res.send(409, 'File input is not found');
      }
      if (!fields.name) {
        log.error('Name input is not found');
        return res.send(409, 'Name input is not found');
      }
      if (!fields.description) {
        log.error('Description input is not found');
        return res.send(409, 'Description input is not found');
      }
      var oldpath = files.file.path;
      var newpath = './uploads/' + uuid.v1() + files.file.name;
      var ext = path.extname(newpath);
      if (ext != '.jpeg' && ext != '.png' && ext != '.jpg' && ext != '.gif') {
        log.error('Wrong extensions');
        return res.json({error: 'Wrong extension'}, 415);
      }

      fs.rename(oldpath, newpath, function(err) {
        if (err) {
          log.error(err);
          return res.json({error: err}, 409);
        }
        var photo = new PhotoModel({
          name: fields.name,
          path: newpath,
          description: fields.description,
          vkID: req.user.vkID,
        });
        photo.save(function(err) {
          if (!err) {
            log.info('Photo created by POST request');
            return res.json({message: 'Photo created', photo: photo}, 200);
          } else {
            log.error(err);
            res.json({error: 'Server error'}, 500);
          }
          log.error('Internal error(%d): %s', res.statusCode, err.message);

        })
      });


    });


  });

  // GET request:
  // Getting the one record with the params.id
  // Аnd with the same vkID as record's owner
  app.get('/api/photos/:id', ensureAuthenticated, function(req, res) {
    return PhotoModel.findById(req.params.id, function(err, photo) {
      if (!photo) {
        log.error('No photos found with this ID');
        return res.send(404, 'Not found');
      }
      if (photo.vkID != req.user.vkID) {
        log.error('This photo belongs to another user');
        return res.send(401, 'This photo belongs to another user');
      }
      if (!err) {
        log.info('Getting the record by GET request')
        return res.json({photo: photo}, 200);
      } else {
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        return res.json({error: 'Server error'}, 500);
      }
    });
  });

  // PUT request:
  // Update the record to given query params and params.id
  // And with the same vkId as record's owner
  app.put('/api/photos/:id', function(req, res, next) {
    return PhotoModel.findById(req.params.id, function(err, photo) {
      if (!photo) {
        log.error('No photos found with this ID');
        return res.send(404, 'Not found');
      }
      if (photo.vkID != req.user.vkID) {
        log.error('This photo belongs to another user');
        return res.send(401, 'This photo belongs to another user');
      }

      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {


        if (!files.file) {
          log.error('File input is not found');
          return res.send(409, 'File input is not found');
        }
        if (!fields.name) {
          log.error('Name input is not found');
          return res.send(409, 'Name input is not found');
        }
        if (!fields.description) {
          log.error('Description input is not found');
          return res.send(409, 'Description input is not found');
        }


        fs.unlink(photo.path, function(err) {
          if (err) {
            log.error(err);
            return res.json({error: err}, 149);
          }
        });

        var oldpath = files.file.path;
        var newpath = './uploads/' + uuid.v1() + files.file.name;
        var ext = path.extname(newpath);
        if (ext != '.jpeg' && ext != '.png' && ext != '.jpg' && ext != '.gif') {
          log.error('Wrong extensions');
          return res.json({error: 'Wrong extension'}, 415);
        }
        fs.rename(oldpath, newpath, function(err) {
          if (err) {
            log.error(err);
          }


          photo.name = fields.name;
          photo.path = newpath;
          photo.description = fields.description;


          return photo.save(function(err) {
            if (!err) {
              log.info('Photo updated by PUT request');
              return res.json({
                message: 'Photo updated',
                photo: photo,
              }, 200);
            } else {
              res.send(500, 'Server error');
              log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
          });
        });

      });
    })
  });

  // DELETE request:
  // deleting the record with param.id and with the same vkId as record's owner
  app.delete('/api/photos/:id', ensureAuthenticated, function(req, res) {
    return PhotoModel.findById(req.params.id, function(err, photo) {
      if (!photo) {
        log.error('No photos found with this ID');
        return res.send(404, 'Not found');
      }
      if (photo.vkID != req.user.vkID) {
        log.error('This photo belongs to another user');
        return res.send(401, 'This photo belongs to another user');
      }
      fs.unlink(photo.path, function(err) {
        if (err) {
          log.error(err);
        }

      });
      return photo.remove(function(err) {
        if (!err) {
          log.info('Photo removed by DELETE request');
          return res.json({message: 'Photo removed'}, 200);
        } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          res.send(500, 'Server error');
        }
      });
    });
  });
  // Checks user's authentication
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    log.error('You are not authorized ');
    res.json({error: 'Permission denied'}, 401);
  }
}
