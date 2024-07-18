/**
 * Image Carousel Class.
 * This is Image Carousel control.
 * @class ebImageCarousel
 * */
var ebImageCarousel = ebImageCarousel || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property ebImageCarousel.SitePath
 * @type {String}
 * */
ebImageCarousel.SitePath = eb_Config.SitePath;

/**
 * Image carousel template path.
 * @property ebImageCarousel.TemplatePath
 * @type {String}
 * */
ebImageCarousel.TemplatePath = "html/ImageCarousel.html";

 /**
 * Render image carousel page.
 * @method ebImageCarousel.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Image Carousel template URL.
 * @return {String} Image Carousel HTML template.
 * */
ebImageCarousel.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = ebImageCarousel.SitePath + ebImageCarousel.TemplatePath;
        options.templatePath = finalPath;
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};
