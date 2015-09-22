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

    it('should return false where extras None', function () {
      model.setExtrasProductCode(Model.EXTRAS_NONE);
      assert(!model.isExtrasProductSelected());
    });

    it('should return false when null extras', function () {
      model.set('ProductSelection.Extras', null);
      assert(!model.isExtrasProductSelected());
    });

  });

  describe('.isCombinedProductSelected()', function() {

    it('should return true', function () {
      model.setCombinedProductCode(Model.COMBINED_KICKSTARTER);
      assert(model.isCombinedProductSelected());
    });

    it('should return false where combined None', function () {
      model.setExtrasProductCode(Model.COMBINED_NONE);
      assert(!model.isCombinedProductSelected());
    });

    it('should return false when null combined', function () {
      model.set('ProductSelection.Combined', null);
      assert(!model.isCombinedProductSelected());
    });

  });

  describe('.hasHospitalComponent()', function() {

    it('should return true', function () {
      model.setHospitalProductCode(Model.HOSPITAL_BASIC);
      assert(model.hasHospitalComponent());
    });

    it('should return true where combined is true', function () {
      model.setCombinedProductCode(Model.COMBINED_KICKSTARTER);
      assert(model.hasHospitalComponent());
    });

    it('should return false where hospital None', function () {
      model.setHospitalProductCode(Model.HOSPITAL_NONE);
      assert(!model.hasHospitalComponent());
    });

    it('should return true where hospital None, but combined is true', function () {
      model.setHospitalProductCode(Model.HOSPITAL_NONE);
      model.setCombinedProductCode(Model.COMBINED_KICKSTARTER);
      assert(model.hasHospitalComponent());
    });

  });

});