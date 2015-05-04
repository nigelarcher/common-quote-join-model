/* global describe, beforeEach, it */
var assert  = require('assert');
var Model   = require('common-quote-join-model');

var model;
var preBundledExtrasProducts = {
  "Core": {
    "Code": "Bundles",
    "BaseBundle": "Core",
    "Bundles": []
  },
  "CorePlus": {
    "Code": "Bundles",
    "BaseBundle": "CorePlus",
    "Bundles": []
  },
  "Top": {
    "Code": "Top",
    "BaseBundle": "Top",
    "Bundles": []
  },
  "Wellbeing": {
    "Code": "Bundles",
    "BaseBundle": "Core",
    "Bundles": [
      "Wellbeing"
    ]
  }
};

describe('Model: Product methods', function() {

  beforeEach(function() {
    model = new Model({
      preBundledExtrasProducts: preBundledExtrasProducts
    });
  });

  describe('.getHospitalProductCode()', function() {

    it('should get the correct value', function() {

      assert.equal(null, model.getHospitalProductCode());
      model.set('ProductSelection.Hospital.Code', Model.HOSPITAL_BASIC);
      assert.equal(Model.HOSPITAL_BASIC, model.getHospitalProductCode());

    });

  });

  describe('.setHospitalProductCode()', function() {

    it('should set the mapped property for valid values', function() {

      model.setHospitalProductCode(Model.HOSPITAL_NONE);
      assert.equal(Model.HOSPITAL_NONE, model.get('ProductSelection.Hospital.Code'));

      model.setHospitalProductCode(Model.HOSPITAL_BASIC);
      assert.equal(Model.HOSPITAL_BASIC, model.get('ProductSelection.Hospital.Code'));

      model.setHospitalProductCode(Model.HOSPITAL_MID);
      assert.equal(Model.HOSPITAL_MID, model.get('ProductSelection.Hospital.Code'));

      model.setHospitalProductCode(Model.HOSPITAL_TOP);
      assert.equal(Model.HOSPITAL_TOP, model.get('ProductSelection.Hospital.Code'));

      model.setHospitalProductCode(Model.HOSPITAL_TOP_WITH_PREGNANCY);
      assert.equal(Model.HOSPITAL_TOP_WITH_PREGNANCY, model.get('ProductSelection.Hospital.Code'));

    });

    it('should throw an error', function() {
      assert.throws(function() {
        model.setHospitalProductCode('foobar');
      }, Error, 'message');
      assert.equal(null, model.get('ProductSelection.Hospital.Code'));
    });

    it('should fire an event', function(done) {
      model
        .on('change:HospitalCode', function() {
          done();
        })
        .setHospitalProductCode(Model.HOSPITAL_BASIC)
      ;
    });

  });

  describe('.isHospitalProductSelected()', function() {

    it('should return true', function () {
      model.setHospitalProductCode(Model.HOSPITAL_BASIC);
      assert(model.isHospitalProductSelected());
    });

    it('should return false', function () {
      model.setHospitalProductCode(Model.HOSPITAL_NONE);
      assert(!model.isHospitalProductSelected());
    });

  });

  describe('.getExtrasProductCode()', function() {

    it('should be CorePlus', function() {

      assert.equal(null, model.getExtrasProductCode());
      model.set('ProductSelection.Extras', {
        Code:         'Bundles',
        BaseBundle:   'CorePlus',
        Bundles:      []
      });
      assert.equal(Model.EXTRAS_CORE_PLUS, model.getExtrasProductCode());

    });

    it('should be TOP', function() {

      assert.equal(null, model.getExtrasProductCode());
      model.set('ProductSelection.Extras', {
        Code:         'Top',
        BaseBundle:   'Top',
        Bundles:      []
      });
      assert.equal(Model.EXTRAS_TOP, model.getExtrasProductCode());

    });

  });

  describe('.setExtrasProductCode()', function() {

    it('should set the mapped property for valid values', function() {

      model.setExtrasProductCode(Model.EXTRAS_NONE);
      assert.deepEqual({
        "Code": "None",
        "BaseBundle": null,
        "Bundles": []
      }, model.get('ProductSelection.Extras'));

      model.setExtrasProductCode(Model.EXTRAS_CORE);
      assert.deepEqual(preBundledExtrasProducts[Model.EXTRAS_CORE], model.get('ProductSelection.Extras'));

      model.setExtrasProductCode(Model.EXTRAS_TOP);
      assert.deepEqual(preBundledExtrasProducts[Model.EXTRAS_TOP], model.get('ProductSelection.Extras'));

    });

    it('should throw an error', function() {
      assert.throws(function() {
        model.setExtrasProductCode('foobar');
      }, Error, 'message');
      assert.equal(null, model.get('ProductSelection.Extras'));
    });

    it('should fire an event', function(done) {
      model
        .on('change:ExtrasCode', function() {
          done();
        })
        .setExtrasProductCode(Model.EXTRAS_CORE)
      ;
    });

  });

  describe('.isExtrasProductSelected()', function() {

    it('should return true', function () {
      model.setExtrasProductCode(Model.EXTRAS_CORE);
      assert(model.isExtrasProductSelected());
    });

    it('should return false', function () {
      model.setExtrasProductCode(Model.EXTRAS_NONE);
      assert(!model.isExtrasProductSelected());
    });

    it('should return false', function () {
      model.set('ProductSelection.Extras', null);
      assert(!model.isExtrasProductSelected());
    });

  });

});