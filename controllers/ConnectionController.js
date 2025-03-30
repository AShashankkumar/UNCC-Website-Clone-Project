const { model } = require('../model/connection');
const {rsvp} = require('../model/rsvp');


exports.connection = (req, res, next) => {
    const title = "Connection"
    const connectionId = req.params.id;

    //check if connectionId is valid mongoose id
    if (!connectionId.match(/^[0-9a-fA-F]{24}$/)) {
        const error = new Error('Invalid connection id - ' + connectionId);
        error.status = 400;
        return next(error);
    }


    Promise.all([
    model.findById(connectionId).populate('hostName', 'firstName lastName'),
    rsvp.find({ connection:connectionId, rsvp:'yes'})
    ])
        .then((result) => {
            const [connection, rsvpRes] = result;
            if (connection)
                return res.render('connection/connection', { title, connection, isAuthor: req.session.user == connection.hostName._id, rsvp: rsvpRes.length });
            else {
                const error = new Error('Cannot locate connection - ' + connectionId);
                error.status = 404;
                next(error);
            }
        })
        .catch((err) => {
            console.log(err);
            next(err)
        })

};

exports.connections = (req, res) => {
    const title = "Connections"

    try {
        model.find()
            .then((connections) => {
                let topics = new Set();
                connections.forEach(connection => {
                    topics.add(connection.topic);
                })
                // sort topics
                topics = Array.from(topics).sort();

                res.render('connection/connections', { title, connections, topics });
            })
            .catch((err) => {
                console.log(err);
                next(err)
            })
    }
    catch (err) {
        console.log(err);
    }

};

exports.newConnection = (req, res) => {
    const title = "newConnection"
    res.render('connection/newConnection', { title });
}

exports.addConnection = (req, res, next) => {
    let connection = new model(req.body);

    connection.hostName = req.session.user;

    connection.save()
        .then(() => {
            res.redirect('/connections');
        })
        .catch((err) => {
            console.log(err);
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            next(err)
        })
}



exports.updateConnection = (req, res, next) => {
    const connectionId = (req.params.id);

    //check connectionId
    if (!connectionId.match(/^[0-9a-fA-F]{24}$/)) {
        const error = new Error('Invalid connection id - ' + connectionId);
        error.status = 400;
        return next(error);
    }

    const updatedConnection = req.body;
    model.findByIdAndUpdate(connectionId, updatedConnection, { runValidators: true })
        .then((connection) => {
            if (connection) {
                return res.redirect('/connections/' + connectionId);
            } else {
                const err = new Error("Unable to update the connection");
                err.status = 404;
                next(err);

            }
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            console.log(err);
            next(err);
        });

};


exports.editConnection = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        const error = new Error('Invalid connection id - ' + id);
        error.status = 400;
        return next(error);
    }
    const title = 'edit connection';
    model.findById(id)
        .then((connection) => {
            if (Object.keys(connection).length > 0) {
                res.render('./connection/editConnection', { connection, title });
            } else {
                let err = new Error(`Cannot find connection with ID: ${id}`);
                err.status = 404;
                next(err);
            }
        })
        .catch((err) => {
            console.log(err);
            next(err)
        })

};


exports.deleteConnection = (req, res, next) => {
    const connectionId = (req.params.id);

    // valid id
    if (!connectionId.match(/^[0-9a-fA-F]{24}$/)) {
        const error = new Error('Invalid connection id - ' + connectionId);
        error.status = 400;
        return next(error);
    }


    Promise.all([
    model.findByIdAndDelete(connectionId),
    rsvp.deleteMany({ connection: connectionId }),
    ])
        .then((connection) => {
            if (connection) {
                res.redirect("/connections");
            } else {
                const err = new Error("Cannot find connection with id - " + connectionId);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            console.log(err);
            next(err);
        })
}

exports.updateRsvp = (req, res, next) => {
    let connectionId = req.params.id;
    console.log('calleing rsvp')
    rsvp.findOne({ connection: connectionId, user: req.session.user })
      .then(resultRSVP => {
        if (resultRSVP) {
          //update
          rsvp.findByIdAndUpdate(resultRSVP._id, { rsvp: req.body.rsvp }, {
            runValidators: true,
            useFindAndModify: false,
          })
            .then(() => {
              req.flash('success', ' updated successfully');
              return res.redirect('/users/profile');
            })
            .catch(err => {
              console.log(err);
              if (err.name === "ValidationError") {
                req.flash('error', err.message);
                return res.redirect('back');
              }
              return next(err);
            })
        } else {
          let newRsvp = new rsvp({
            connection: connectionId,
            rsvp: req.body.rsvp,
            user: req.session.user
          });
          newRsvp.save()
            .then(() => {
              req.flash('success', 'created successfully');
              return res.redirect('/users/profile');
            })
            .catch(err => {
              console.log(err);
              if (err.name === "ValidationError") {
                req.flash('error', err.message);
                return res.redirect('back');
              }
              return next(err);
            })
        }
      })
  
  }

