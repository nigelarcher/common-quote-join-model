/* global describe, it */
var assert    = require('assert');
var Model     = require('common-quote-join-model');
var moment    = require('moment');
var MockDate  = require('mockdate');

describe('model', function() {

  describe('new Model()', function() {

    it('should be empty', function() {

      var model1 = new Model();
      assert.deepEqual({}, model1.attributes);

      var model2 = new Model({});
      assert.deepEqual({}, model2.attributes);

    });

    it('should not be empty', function() {

      var model = new Model({ attributes: {name: 'John Smith'}});
      assert.deepEqual({name: 'John Smith'}, model.attributes);

    });

  });

  describe('.getPolicyHolderAge()', function() {

    it('should be 18 when the month has not passed', function() {
      MockDate.set(moment('2014-04-01', 'YYYY-MM-DD'));

      var model = new Model();
      model.set('PersonalDetails.PolicyHolder.DateOfBirth', '1995-09-01');

      assert.equal(model.getPolicyHolderAge(), 18);

      MockDate.reset();
    });

    it('should be 19 when the month has passed', function() {
      MockDate.set(moment('2014-11-01', 'YYYY-MM-DD'));

      var model = new Model();
      model.set('PersonalDetails.PolicyHolder.DateOfBirth', '1995-09-01');

      assert.equal(model.getPolicyHolderAge(), 19);

      MockDate.reset();
    });

  });

  describe('.isLHCApplied()', function() {

    it('should be true', function() {
      var values = [1, 2, 99];

      for (var i=0; i<values.length; ++i) {

        var model = new Model({
          lhc: {Loading: values[i]}
        });

        assert(model.isLHCApplied());

      }

    });

    it('should be false', function() {
      var values = [-1, 0];

      for (var i=0; i<values.length; ++i) {

        var model = new Model({
          lhc: {Loading: values[i]}
        });

        assert(!model.isLHCApplied());

      }

    });

  });

  describe('.getGenderFromTitle()', function() {

    it('should default to male', function() {
      assert.equal('Male', Model.getGenderFromTitle('Mr'));
    });

    it('should default to female', function() {
      assert.equal('Female', Model.getGenderFromTitle('Mrs'));
      assert.equal('Female', Model.getGenderFromTitle('Miss'));
      assert.equal('Female', Model.getGenderFromTitle('Ms'));
    });

    it('should not default', function() {
      assert.equal(null, Model.getGenderFromTitle('Dr'));
    });

  });

  describe('#change:PersonalDetails.PolicyHolder.Title', function() {

    it('should change gender to male', function() {
      var model = new Model();
      model.set('PersonalDetails.PolicyHolder.Title', 'Mr');
      assert.equal('Male', model.get('PersonalDetails.PolicyHolder.Gender'));
    });

    it('should change gender to female', function() {
      var model = new Model();
      model.set('PersonalDetails.PolicyHolder.Title', 'Mrs');
      assert.equal('Female', model.get('PersonalDetails.PolicyHolder.Gender'));
    });

    it('should not change gender when gender is null', function() {
      var model = new Model();
      model.set('PersonalDetails.PolicyHolder.Title', 'Dr');
      assert.equal(null, model.get('PersonalDetails.PolicyHolder.Gender'));
    });

    it('should not change gender when gender is not null', function() {
      var model = new Model();
      model.set('PersonalDetails.PolicyHolder.Gender', 'Male');
      model.set('PersonalDetails.PolicyHolder.Title', 'Dr');
      assert.equal('Male', model.get('PersonalDetails.PolicyHolder.Gender'));
    });

  });

  describe('#change', function() {

    it('should emit the `change` event when a property is updated', function(done) {

      var model = new Model();

      model.on('change', function() {
        done();
      });

      model.set('GovernmentDetails.PolicyHolderPreviousFundDetails.PreviouslyHadHealthInsurance', true);

    });

    it('should emit the `change:<property>` event when a property is updated', function(done) {

      var model = new Model();

      model.on('change:GovernmentDetails.PolicyHolderPreviousFundDetails.PreviouslyHadHealthInsurance', function() {
        done();
      });

      model.set('GovernmentDetails.PolicyHolderPreviousFundDetails.PreviouslyHadHealthInsurance', true);

    });

  });

});