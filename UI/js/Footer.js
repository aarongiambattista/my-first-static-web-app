/**
 * Footer class.
 * @class eb_Footer
 * */
var eb_Footer = eb_Footer || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_Footer.SitePath
 * @type {String}
 * */
eb_Footer.SitePath = eb_Config.SitePath;

/**
 * Footer template path.
 * @property eb_Footer.TemplatePath
 * @type {String}
 * */
eb_Footer.TemplatePath = "html/Footer.html";

/**
* Render footer page.
* @method eb_Footer.render
* @param {any} options Array of required data.
* @param {String} options.templatePath Footer template URL.
* @return {String} Footer HTML template.
* */
eb_Footer.render = function (options) {
    var defer = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_Footer.SitePath + eb_Footer.TemplatePath;
        }

        if (!options.domElement) {
            throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
        }

        eBusinessJQObject.get(options.templatePath).done(function (data) {
            options.domElement.innerHTML = data;
            defer.resolve(data);
        }).fail(function (data, msg, jhr) {
            defer.reject(data, msg, jhr);
            console.info(msg);
        });
    }
    return defer.promise();
};

/**
 * Page DOM element.
 * @method eb_Footer.domElement
 * @param {object} domElement current DOM element.
 * */
eb_Footer.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};