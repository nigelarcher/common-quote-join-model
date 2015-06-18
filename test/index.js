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

  describe('.getScale()', function() {

    it('should return null when there is no scale is set', function() {
      var model = new Model();
      assert.equal(model.getScale(), null);
    });

    it('should return couple when the scale is set to couple', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_COUPLE);
      assert.equal(model.getScale(), Model.SCALE_COUPLE);
    });

  });

  describe('.setScale()', function() {

    it('should return scale when the scale is set', function() {
      var model = new Model();
      var scale = Model.SCALE_FAMILY;
      assert.notEqual(model.getScale(), scale);
      model.setScale(scale)
      assert.equal(model.getScale(), scale);
    });

    it('should return an error when the scale does not match model.scales', function() {
      var model = new Model();
      assert.throws(function() {
        model.setScale('asdfasdf');
      });
    });

    it('should emit scale change event', function(done) {
      var model = new Model();
      var scale = Model.SCALE_FAMILY;
      assert.notEqual(model.getScale(), scale);
      model
        .on('change:Scale', function(value) {
          assert.equal(value, scale);
          done();
        })
        .setScale(scale)
      ;
    });

  });

  describe('.getState()', function() {

    it('should return null when there is no scale is set', function() {
      var model = new Model();
      assert.equal(model.getState(), null);
    });

    it('should return NSW when the state is set to NSW', function() {
      var model = new Model();
      model.set('ContactDetails.Address.State', 'NSW');
      assert.equal(model.getState(), 'NSW');
    });

  });

  describe('.setState()', function() {

    it('should return TAS when state is set', function() {
      var model = new Model();
      var state = 'TAS';
      assert.notEqual(model.getState(), state);
      model.setState(state);
      assert.equal(model.getState(), state);
    });

    it('should emit state change event', function(done) {
      var model = new Model();
      var state = 'TAS';
      assert.notEqual(model.getState(), state);
      model
        .on('change:State', function(value) {
          assert.equal(value, state);
          done();
        })
        .setState(state)
      ;
    });

  });

  describe('.isSingle()', function() {

    it('should return false when there is no scale is set', function() {
      var model = new Model();
      assert(!model.isSingle());
    });

    it('should return false when the scale is set to couple', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_COUPLE);
      assert(!model.isSingle());
    });

    it('should return true when the scale is set to single', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_SINGLE);
      assert(model.isSingle());
    });

  });

  describe('.isCouple()', function() {

    it('should return false when there is no scale is set', function() {
      var model = new Model();
      assert(!model.isCouple());
    });

    it('should return false when the scale is set to family', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_FAMILY);
      assert(!model.isCouple());
    });

    it('should return true when the scale is set to couple', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_COUPLE);
      assert(model.isCouple());
    });

  });

  describe('.isFamily()', function() {

    it('should return false when there is no scale is set', function() {
      var model = new Model();
      assert(!model.isFamily());
    });

    it('should return false when the scale is set to couple', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_COUPLE);
      assert(!model.isFamily());
    });

    it('should return true when the scale is set to family', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_FAMILY);
      assert(model.isFamily());
    });

  });

  describe('.isSingleParentFamily()', function() {

    it('should return false when there is no scale is set', function() {
      var model = new Model();
      assert(!model.isSingleParentFamily());
    });

    it('should return false when the scale is set to couple', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_COUPLE);
      assert(!model.isSingleParentFamily());
    });

    it('should return true when the scale is set to single-parent-family', function() {
      var model = new Model();
      model.set('PersonalDetails.Scale', Model.SCALE_SINGLE_PARENT_FAMILY);
      assert(model.isSingleParentFamily());
    });

  });

  describe('.getState()', function() {

    it('should return null when there is no scale is set', function() {
      var model = new Model();
      assert.equal(model.getState(), null);
    });

    it('should return NSW when the state is set to NSW', function() {
      var model = new Model();
      model.set('ContactDetails.Address.State', 'NSW');
      assert.equal(model.getState(), 'NSW');
    });

  });

  describe('.setExcess()', function() {

    it('should return 250 when state is set', function() {
      var model = new Model();
      var excess = 250;
      assert.notEqual(model.getExcess(), excess);
      model.setExcess(excess);
      assert.equal(model.getExcess(), excess);
    });

    it('should emit excess change event', function(done) {
      var model = new Model();
      var excess = 250;
      assert.notEqual(model.getExcess(), excess);
      model
        .on('change:Excess', function(value) {
          assert.equal(value, excess);
          done();
        })
        .setExcess(excess)
      ;
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

    it('should be null when policy holder date of birth null', function() {
      var model = new Model();
      model.set('PersonalDetails.PolicyHolder.DateOfBirth', null);

      console.log('getPolicyHolderAge', model.getPolicyHolderAge());
      assert.equal(model.getPolicyHolderAge(), null, model.getPolicyHolderAge());
    });

  });


  describe('.getAGRPercentage()', function() {

    it('should calculate AGR percentage based on policy holder and partner age', function() {
      var model = new Model();
      const incomeTier = 'Tier2';
      model.getPolicyHolderAge = function() {
        return 46;
      };
      model.getPartnerAge = function() {
        return 47;
      };

      model.set('GovernmentDetails.IncomeTier', incomeTier);

      model.AGR.getTier = function(tier) {
        assert.equal(tier, 'Tier2');
        return {
          getPercentage: function(age1, age2) {
            assert.equal(age1, 46);
            assert.equal(age2, 47);
            return 30;
          }
        };
      };

      assert.equal(model.getAGRPercentage(), 30);
    });

  });


  describe('.getPartnerAge()', function() {

    it('should be null when no partner', function() {
      MockDate.set(moment('2014-04-01', 'YYYY-MM-DD'));

      var model = new Model();
      model.set('PersonalDetails.Partner', null);

      assert.equal(model.getPartnerAge(), null);

      MockDate.reset();
    });

    it('should be null when no partner date of birth', function() {
      MockDate.set(moment('2014-04-01', 'YYYY-MM-DD'));

      var model = new Model();
      model.set('PersonalDetails.Partner.DateOfBirth', null);

      assert.equal(model.getPartnerAge(), null);

      MockDate.reset();
    });

    it('should be 18 when the month has not passed', function() {
      MockDate.set(moment('2014-04-01', 'YYYY-MM-DD'));

      var model = new Model();
      model.set('PersonalDetails.Partner.DateOfBirth', '1995-09-01');

      assert.equal(model.getPartnerAge(), 18);

      MockDate.reset();
    });

    it('should be 19 when the month has passed', function() {
      MockDate.set(moment('2014-11-01', 'YYYY-MM-DD'));

      var model = new Model();
      model.set('PersonalDetails.Partner.DateOfBirth', '1995-09-01');

      assert.equal(model.getPartnerAge(), 19);

      MockDate.reset();
    });

    it('should be null when partner date of birth null', function() {
      var model = new Model();
      model.set('PersonalDetails.Partner.DateOfBirth', null);
      assert.equal(model.getPartnerAge(), null);
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

  describe('#change:PersonalDetails.Partner.Title', function() {

    it('should change gender to male', function() {
      var model = new Model();
      model.set('PersonalDetails.Partner.Title', 'Mr');
      assert.equal('Male', model.get('PersonalDetails.Partner.Gender'));
    });

    it('should change gender to female', function() {
      var model = new Model();
      model.set('PersonalDetails.Partner.Title', 'Mrs');
      assert.equal('Female', model.get('PersonalDetails.Partner.Gender'));
    });

    it('should not change gender when gender is null', function() {
      var model = new Model();
      model.set('PersonalDetails.Partner.Title', 'Dr');
      assert.equal(null, model.get('PersonalDetails.Partner.Gender'));
    });

    it('should not change gender when gender is not null', function() {
      var model = new Model();
      model.set('PersonalDetails.Partner.Gender', 'Male');
      model.set('PersonalDetails.Partner.Title', 'Dr');
      assert.equal('Male', model.get('PersonalDetails.Partner.Gender'));
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
