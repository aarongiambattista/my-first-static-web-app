/*
Copyright (C) 2016 Vantiv. All Rights Reserved.

Adapted from EmporiumWeb:
https://developer.apple.com/library/content/samplecode/EmporiumWeb/Introduction/Intro.html
 
Abstract:
The main client-side JS. Handles displaying the Apple Pay button and requesting a payment.
*/

/**
* This method is called when the page is loaded.
* We use it to show the Apple Pay button as appropriate.
* Here we're using the ApplePaySession.canMakePayments() method,
* which performs a basic hardware check. 
*
* If we wanted more fine-grained control, we could use
* ApplePaySession.canMakePaymentsWithActiveCards() instead.
*/
document.addEventListener('DOMContentLoaded', () => {
	if (window.ApplePaySession) {
		if (ApplePaySession.canMakePayments) {
			showApplePayButton();
		}
	}
});

var paymentControl = null;

function showApplePayButton() {
	HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
	const button = document.getElementById("apple-pay-button");
	if (button != null || button != undefined) {
		button.className += " visible";
    }
}

var applePayPriceSettings = {
	subTotal: "0.00",
	tax: "0.00",
	totalPrice: "0.00",
	currencySymbol: "$",
	label: "Total"
};

/**
* Apple Pay Logic
* Our entry point for Apple Pay interactions.
* Triggered when the Apple Pay button is pressed
*/
function applePayButtonClicked() {
	const paymentRequest = {
		//countryCode: 'US',
		currencyCode: getCurrencyCode(applePayPriceSettings.currencySymbol) || "USD",
		total: {
			label: applePayPriceSettings.label,
			amount: applePayPriceSettings.totalPrice,
		},
		supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
		merchantCapabilities: ['supports3DS'],
	};

	const session = new ApplePaySession(1, paymentRequest);

	/**
	* Merchant Validation
	* We call our merchant session endpoint, passing the URL to use
	*/
	session.onvalidatemerchant = (event) => {
		console.log("Validate merchant");
		const validationURL = event.validationURL;
		getApplePaySession(validationURL).then(function (response) {
			console.log(response);
			session.completeMerchantValidation(JSON.parse(response.outputToken));
		});
	};

	/**
	* Shipping Method Selection
	* If the user changes their chosen shipping method we need to recalculate
	* the total price. We can use the shipping method identifier to determine
	* which method was selected.
	*/
	//session.onshippingmethodselected = (event) => {
	//	const shippingCost = event.shippingMethod.identifier === 'free' ? '0.00' : '5.00';
	//	const totalCost = event.shippingMethod.identifier === 'free' ? '8.99' : '13.99';

	//	const lineItems = [
	//		{
	//			label: 'Shipping',
	//			amount: shippingCost,
	//		},
	//	];

	//	const total = {
	//		label: 'Apple Pay Example',
	//		amount: totalCost,
	//	};

	//	session.completeShippingMethodSelection(ApplePaySession.STATUS_SUCCESS, total, lineItems);
	//};

	/**
	* Payment Authorization
	* Here you receive the encrypted payment data. You would then send it
	* on to your payment provider for processing, and return an appropriate
	* status in session.completePayment()
	*/
	session.onpaymentauthorized = (event) => {
		// Send payment for processing...
		const payment = event.payment;
		const paymentData = payment.token.paymentData.data + "&ectype=apple&ecsig=" + payment.token.paymentData.signature + "&eckey=" + payment.token.paymentData.header.ephemeralPublicKey + "&ectid=" + payment.token.paymentData.header.transactionId + "&echash=&ecpublickeyhash=" + payment.token.paymentData.header.publicKeyHash;
		this.paymentControl.live.parentControl.payByApplePay(paymentData);
		session.completePayment(ApplePaySession.STATUS_SUCCESS);
	}
	session.oncancel = (event) => {
		console.log(event);
	}


	// All our handlers are setup - start the Apple Pay payment
	session.begin();
}

/*
Copyright(C) 2016 Apple Inc.All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
A helper function that requests an Apple Pay merchant session using a promise.
*/

function getApplePaySession(url) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', eb_Config.ServicePathV1 + '/getApplePaySession');
		
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				resolve(JSON.parse(xhr.response));
			} else {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			}
		};
		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		};
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify({ sessionUrl: url }));
	});
}

function getCurrencyCode(currencySymbol) {
	const currencyTable = {
		"$": "USD",
		"€": "EUR",
		"£": "STE",
		"¥": "YEN",
		"MEX$": "MEX",
		"CAN$": "CAN"
	}
	return currencyTable[currencySymbol];
}