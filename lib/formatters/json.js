// Copyright 2012 Mark Cavage, Inc.  All rights reserved.

'use strict';

///--- Exports

/**
 * JSON formatter. Will look for a toJson() method on the body. If one does not
 * exist then a JSON.stringify will be attempted.
 * @public
 * @function formatJSON
 * @param    {Object} req  the request object (not used)
 * @param    {Object} res  the response object
 * @param    {Object} body response body
 * @returns  {String}
 */
function formatJSON(req, res, body) {

    var newBody = {};

    // UGLY: if the payload is an Error object, do some custom serialization
    // here. errors that are created by restify-errors are ok, because they've
    // defined a custom toJSON method. if we don't do this, when res.send(new
    // Error('boom')) is called, an empty object is returned.  also, if the
    // error is a domain error, then the err.domain property will fail
    // serializtion due to circular refs. this block is really only for errors
    // not created by restify-errors.
    if (!body.toJSON && body instanceof Error) {
        newBody = {
            name: body.name,
            message: (body.toString) ? body.toString() : body.message
        };
    } else {
        // in the happy case, just serialize the incoming object
        newBody = body;
    }

    var data = (newBody) ? JSON.stringify(newBody) : 'null';
    // Setting the content-length header is not a formatting feature and should
    // be separated into another module
    res.setHeader('Content-Length', Buffer.byteLength(data));

    return data;
}

module.exports = formatJSON;
