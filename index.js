var moment      = require('moment');
var equals      = require('equals');
var observable  = require('observable');
var AGR         = require('aus-gov-rebate');

/**
 * A model
 * @constructor
 * @param   {Object} options
 * @param   {Object} options.agr                The AGR tier data
 * @param   {Object} options.lhc                The LHC data
 * @param   {Object} [options.attributes]       The initial model data
 * @param   {Object} [options.preBundledExtrasProducts]
 */
function Model(options) {
  var self  = this;
  options   = options || {};

  this.AGR = AGR(options.agr);
  this.LHC = options.lhc;

  this.set(options.attributes || {}, {silent: true});

  //set the model metadata
  if (options && options.preBundledExtrasProducts) {
    this.preBundledExtrasProducts = options.preBundledExtrasProducts;
  }

  //update the gender when the title changes
  this.on('change:PersonalDetails.PolicyHolder.Title', this.defaultPolicyHolderGender);
  this.on('change:PersonalDetails.Partner.Title', this.defaultPartnerHolderGender);

  //emit generic events to listen for data that may be mapped to multiple values
  this
    .on('change:PersonalDetails.Scale', function(value) {
      self.emit('change:Scale', value);
    })
    .on('change:ContactDetails.Address.State', function(value) {
      self.emit('change:State', value);
    })
    .on('change:ProductSelection.Hospital.Excess', function(value) {
      self.emit('change:Excess', value);
    })
    .on('change:ProductSelection.Hospital.Code', function(value) {
      self.emit('change:HospitalCode', value);
    })
    .on('change:ProductSelection.Extras', function(value) {
      self.emit('change:ExtrasCode', value);
    })
  ;

}
observable(Model.prototype);

/**
 * The properties that could cause the cart price to change
 * @type {Object}
 */
Model.PROPERTIES_THAT_COULD_AFFECT_PRICE = {
  'PersonalDetails.PolicyHolder.DateOfBirth':                                       true,
  'PersonalDetails.Partner.DateOfBirth':                                            true,
  'ContactDetails.Address':                                                         true,
  'ContactDetails.Address.State':                                                   true,
  'GovernmentDetails.PolicyHolderPreviousFundDetails.PreviouslyHadHealthInsurance': true,
  'GovernmentDetails.PartnerPreviousFundDetails.PreviouslyHadHealthInsurance':      true,
  'GovernmentDetails.ApplyGovernmentRebate':                                        true,
  'GovernmentDetails.IncomeTier':                                                   true,
  'FinancialDetails.PaymentFrequency':                                              true
};

/**
 * Get whether a property could affect the cart price
 * @param   {String} property
 * @returns {Boolean}
 */
Model.couldPropertyAffectPrice = function(property) {
  if (Model.PROPERTIES_THAT_COULD_AFFECT_PRICE.hasOwnProperty(property)) {
    return Model.PROPERTIES_THAT_COULD_AFFECT_PRICE[property];
  } else {
    return false;
  }
};

/* === Scale codes === */

Model.SCALE_SINGLE                = 'Single';
Model.SCALE_COUPLE                = 'Couple';
Model.SCALE_FAMILY                = 'Family';
Model.SCALE_SINGLE_PARENT_FAMILY  = 'SingleParentFamily';

Model.SCALE = [
  Model.SCALE_SINGLE,
  Model.SCALE_COUPLE,
  Model.SCALE_FAMILY,
  Model.SCALE_SINGLE_PARENT_FAMILY
];

/* === Hospital codes === */

Model.HOSPITAL_NONE               = 'None';
Model.HOSPITAL_BASIC              = 'BASIC';
Model.HOSPITAL_MID                = 'MID';
Model.HOSPITAL_TOP                = 'TOP_NO_OBS';
Model.HOSPITAL_TOP_WITH_PREGNANCY = 'TOP_WITH_OBS';

Model.HOSPITAL = [
  Model.HOSPITAL_NONE,
  Model.HOSPITAL_BASIC,
  Model.HOSPITAL_MID,
  Model.HOSPITAL_TOP,
  Model.HOSPITAL_TOP_WITH_PREGNANCY
];

/* === Extras codes === */

Model.EXTRAS_NONE                 = 'None';
Model.EXTRAS_CORE                 = 'Core';
Model.EXTRAS_CORE_PLUS            = 'CorePlus';
Model.EXTRAS_TOP                  = 'Top';
Model.EXTRAS_WELLBEING            = 'Wellbeing';
Model.EXTRAS_BUNDLED              = 'Bundles';

Model.EXTRAS = [
  Model.EXTRAS_NONE,
  Model.EXTRAS_CORE,
  Model.EXTRAS_CORE_PLUS,
  Model.EXTRAS_TOP,
  Model.EXTRAS_WELLBEING
];

//copy the static constants to the prototype for accessibility
for (var key in Model) {
  if (Model.hasOwnProperty(key)) {
    if (key.indexOf('HOSPITAL') === 0 || key.indexOf('EXTRAS') === 0 || key.indexOf('SCALE') === 0) {
      Model.prototype[key] = Model[key];
    }
  }
}

/**
 * Guess a gender from a person's title
 * @param   {String} value
 * @returns {Stirng}
 */
Model.getGenderFromTitle = function(value) {

  switch (value) {

    case 'Mr':
      return 'Male';

    case 'Miss':
    case 'Mrs':
    case 'Ms':
      return 'Female';

  }

  return null;
};

/**
 * Get the policy scale
 * @returns {string}
 */
Model.prototype.getScale = function() {
  return this.get('PersonalDetails.Scale');
};

/**
 * Set the policy scale
 * @returns {string}
 */
Model.prototype.setScale = function(scale) {

  //check the code is valid
  if (Model.SCALE.indexOf(scale) === -1) {
    throw new Error('Invalid scale "'+scale+'".');
  }

  this.set('PersonalDetails.Scale', scale);
  return this;
};

/**
 * Get the policy state
 * @returns {string}
 */
Model.prototype.getState = function() {
  return this.get('ContactDetails.Address.State');
};

/**
 * Set the policy state
 * @returns {string}
 */
Model.prototype.setState = function(state) {
  this.set('ContactDetails.Address.State', state);
  return this;
};

/**
 * Get whether the policy is for a single
 * @returns {boolean}
 */
Model.prototype.isSingle = function() {
  return this.getScale() === Model.SCALE_SINGLE;
};

/**
 * Get whether the policy is for a couple
 * @returns {boolean}
 */
Model.prototype.isCouple = function() {
  return this.getScale() === Model.SCALE_COUPLE;
};

/**
 * Get whether the policy is for a family
 * @returns {boolean}
 */
Model.prototype.isFamily = function() {
  return this.getScale() === Model.SCALE_FAMILY;
};

/**
 * Get whether the policy is for a single-parent-family
 * @returns {boolean}
 */
Model.prototype.isSingleParentFamily = function() {
  return this.getScale() === Model.SCALE_SINGLE_PARENT_FAMILY;
};

/**
 * Get the policy excess
 * @returns {string}
 */
Model.prototype.getExcess = function() {
  return this.get('ProductSelection.Hospital.Excess');
};

/**
 * Set the policy excess
 * @returns {string}
 */
Model.prototype.setExcess = function(excess) {
  this.set('ProductSelection.Hospital.Excess', excess);
  return this;
};

/**
 * Get the policy holder's first name
 * @returns {String}
 */
Model.prototype.getPolicyHolderFirstName = function() {
  return this.get('PersonalDetails.PolicyHolder.FirstName');
};

/**
 * Get the policy holder's last name
 * @returns {String}
 */
Model.prototype.getPolicyHolderLastName = function() {
  return this.get('PersonalDetails.PolicyHolder.FirstName');
};

/**
 * Get the policy holder's email address
 * @returns {String}
 */
Model.prototype.getPolicyHolderEmail = function() {
  return this.get('PersonalDetails.PolicyHolder.Email');
};

/**
 * Get the policy holder's age
 * @param   {String} [unit=years]
 * @returns {Number|null}
 */
Model.prototype.getPolicyHolderAge = function(unit) {
  var dateOfBirth = this.get('PersonalDetails.PolicyHolder.DateOfBirth');
  if (dateOfBirth) {
    var dob = moment(dateOfBirth, 'YYYY-MM-DD', true);
    return Math.floor(moment().diff(dob, unit || 'years', true));
  }
};

/**
 * Default the policy holder gender from the title
 * @returns {Model}
 */
Model.prototype.defaultPolicyHolderGender = function() {
  var newTitle  = this.get('PersonalDetails.PolicyHolder.Title');
  var oldGender = this.get('PersonalDetails.PolicyHolder.Gender');
  this.set('PersonalDetails.PolicyHolder.Gender', Model.getGenderFromTitle(newTitle) || oldGender);
  return this;
};

/**
 * Get the partner's age
 * @param   {String} [unit=years]
 * @returns {Number}
 */
Model.prototype.getPartnerAge = function(unit) {
  var partnerDateOfBirth = this.get('PersonalDetails.Partner.DateOfBirth');
  if (partnerDateOfBirth) {
    var dob = moment(partnerDateOfBirth, 'YYYY-MM-DD', true);
    return Math.floor(moment().diff(dob, unit || 'years', true));
  }
};

/**
 * Default the partner's gender from the title
 * @returns {Model}
 */
Model.prototype.defaultPartnerHolderGender = function() {
  var newTitle  = this.get('PersonalDetails.Partner.Title');
  var oldGender = this.get('PersonalDetails.Partner.Gender');
  this.set('PersonalDetails.Partner.Gender', Model.getGenderFromTitle(newTitle) || oldGender);
  return this;
};

/**
 * Get whether a hospital product is selected
 * @returns {Model}
 */
Model.prototype.isHospitalProductSelected = function() {
  switch(this.getHospitalProductCode()) {

    case Model.HOSPITAL_BASIC:
    case Model.HOSPITAL_MID:
    case Model.HOSPITAL_TOP:
    case Model.HOSPITAL_TOP_WITH_PREGNANCY:
      return true;

    default:
      return false;

  }
};

/**
 * Get the selected hospital product code
 * @returns {String}
 */
Model.prototype.getHospitalProductCode = function() {
  return this.get('ProductSelection.Hospital.Code');
};

/**
 * Set the selected hospital product code
 * @param   {String} code
 * @returns {Model}
 */
Model.prototype.setHospitalProductCode = function(code) {

  //check the code is valid
  if (Model.HOSPITAL.indexOf(code) === -1) {
    throw new Error('Invalid hospital code "'+code+'".');
  }

  //set the code
  this.set('ProductSelection.Hospital.Code', code);
  return this;
};

/**
 * Get whether an extras product is selected
 * @returns {Model}
 */
Model.prototype.isExtrasProductSelected = function() {
  return this.get('ProductSelection.Extras') && this.get('ProductSelection.Extras.Code') !== Model.EXTRAS_NONE;
};

/**
 * Get the selected extras product code
 * @returns {String}
 */
Model.prototype.getExtrasProductCode = function() {

  var extras = this.get('ProductSelection.Extras');

  for (var key in this.preBundledExtrasProducts) {
    if (this.preBundledExtrasProducts.hasOwnProperty(key)) {
      console.log('checking ',key)
      if (equals(extras, this.preBundledExtrasProducts[key])) {
        return key;
      }
    }
  }

  return null;
};

/**
 * Set the selected extras product code
 * @param   {String} code
 * @returns {Model}
 */
Model.prototype.setExtrasProductCode = function(code) {
  var extras;

  //check the code is valid
  if (Model.EXTRAS.indexOf(code) === -1) {
    throw new Error('Invalid extras code "'+code+'".');
  }

  //set the bundle structure
  if (code === Model.EXTRAS_NONE) {
    extras = {
      "Code": "None",
      "BaseBundle": null,
      "Bundles": []
    };
  } else {
    extras = this.preBundledExtrasProducts[code];
  }

  //set the code
  this.set('ProductSelection.Extras', extras);
  return this;
};

/**
 * Get the Australian Government Rebate tier information
 * @returns {Tier}
 */
Model.prototype.getAGRTier = function() {
  return this.AGR.getTier(this.get('GovernmentDetails.IncomeTier'));
};

/**
 * Get whether the Australian Government Rebate is applied to the quote
 * @returns {Boolean}
 */
Model.prototype.isAGRApplied = function() {
  return this.get('GovernmentDetails.ApplyGovernmentRebate');
};

/**
 * Get the Australian Government Rebate percentage
 * @returns {Number}
 */
Model.prototype.getAGRPercentage = function() {
  return this.getAGRTier().getPercentage(this.getPolicyHolderAge(), this.getPartnerAge());
};

/**
 * Get whether the Lifetime Health Cover loading is applied to the quote
 * @returns {Boolean}
 */
Model.prototype.isLHCApplied = function() {
  return (this.LHC.Loading > 0);
};

/**
 * Get the Lifetime Health Cover loading percentage applied to the quote
 * @returns {Number}
 */
Model.prototype.getLHCPercentage = function() {
  return this.LHC.Loading;
};

module.exports = Model;

