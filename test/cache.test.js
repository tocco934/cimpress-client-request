/**
 * This test calls an API that expects a client credentials grant and confirms that the cache was hit.
 */
var cimpress_client_request = require('../'),
  expect = require("chai").expect,
  chai = require("chai"),
  assert = require("assert-plus");

describe('Given an alternative cache', function () {
var request;
var cache;
var cachedValue;
var testing_what_we_claim_to_test;
var old_cache = cimpress_client_request.credential_cache;


  beforeEach(function() {
    testing_what_we_claim_to_test = false;
    cache = {
      flushAll: function(){cachedValue = null;},
      set: function(key, value, ttl){
        testing_what_we_claim_to_test = true;
        cachedValue = value;},
      get: function(key){return cachedValue;}
    }
    cimpress_client_request.set_credential_cache(cache);
    cimpress_client_request.credential_cache.flushAll();
    request = cimpress_client_request;
  });

  var config = {
    authorization_server: "https://cimpress.auth0.com/oauth/token",
    audience: "https://api.cimpress.io/",
    client_id: process.env.CIMPRESS_IO_CLIENT_ID,
    client_secret: process.env.CIMPRESS_IO_CLIENT_SECRET
  };

  afterEach(function(){
    cimpress_client_request.set_credential_cache(old_cache);
  })

  it('Should store the access token in the provided cache', function(done) {

    request({
      auth: config,
      url: process.env.API_THAT_SUPPORTS_CLIENT_GRANTS
    }, function(err, res, body) {
      expect(err).to.be.null;
      expect(res.statusCode).not.to.equal(401);
      expect(testing_what_we_claim_to_test).to.equal(true);
      expect(cachedValue).to.not.be.null;
      done();
    });
  });
});