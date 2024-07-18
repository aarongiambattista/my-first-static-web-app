/**
 * Define eb_tokenizer class.
 * This handles loading the CardPointe tokenizer modal, handling the message events, closing the modal etc.
 * Implements promise, When done() is called on this, it returns the "event.data" which is basically what is returned by the window...postMessage on tokenizer html
 * @class eb_tokenizer
 * */
var eb_tokenizer = eb_tokenizer || {};

var doStopTokenizer = false;

eb_tokenizer.loadTokenizerModal = function () {
    var defer = eBusinessJQObject.Deferred();


    eBusinessJQObject.get(eb_Config.cardPointeHostedTokenizerTemplatePath).done(function (data) {


        //Get the tokenizer bootstrap modal
        var divTokenizer = eBusinessJQObject("#eb-iFrame-Tokenizer");
        // Add response in Modal body
        eBusinessJQObject(divTokenizer).find('.modal-body').html(data);

        var tokenizerModal = new bootstrap.Modal(divTokenizer, ({
            backdrop: 'static',
            keyboard: false
        }));

        function MessageEventListener(event) {

            if (event.origin.toLowerCase() === new URL(eb_Config.SitePath).origin.toLowerCase()) {
                if (event.data != "close") {
                    if (event.data.message != undefined && event.data.message != "" && !doStopTokenizer) {
                        doStopTokenizer = true;
                        var token = event.data.message;
                        var expiryDate = event.data.expiry;
                        var saveForFutureUse = event.data.saveForFutureUse;

                        doStopTokenizer = false;
                        tokenizerModal.hide();
                        defer.resolve(event.data);
                    }
                }
                else {
                    doStopTokenizer = false;
                    tokenizerModal.hide();
                    defer.reject("close");
                }
            }
        }

        window.removeEventListener(
            'message',
            MessageEventListener
        );
        window.addEventListener(
            'message',
            MessageEventListener,
            {
                once: false
            }
        );

        tokenizerModal.show();

       // defer.resolve(data);
    }).fail(function (data, msg, jhr) {
        defer.reject(data, msg, jhr);
    });

    return defer.promise();
};