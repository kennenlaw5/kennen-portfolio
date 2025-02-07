(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_pages_Contact_tsx"],{

/***/ "./resources/sass/ContactForm.module.scss":
/*!************************************************!*\
  !*** ./resources/sass/ContactForm.module.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"contactForm":"ContactForm-module__contactForm__qLWkH","formGroup":"ContactForm-module__formGroup__WEJQE","label":"ContactForm-module__label__ZCGDP","input":"ContactForm-module__input__hYdy3","textarea":"ContactForm-module__textarea__izlRq","buttonContainer":"ContactForm-module__buttonContainer__xLhoD","button":"ContactForm-module__button__FrTN3"});

/***/ }),

/***/ "./resources/js/components/Section.tsx":
/*!*********************************************!*\
  !*** ./resources/js/components/Section.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);


const Section = ({ children, className, header, subheader }) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", { className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('mb-8', className) },
    header || subheader ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex flex-wrap mb-4' },
        header ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", { className: "text-3xl font-bold" }, header) : null,
        subheader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", { className: "text-2xl text-gray-500 ml-4" }, subheader) : null)) : null,
    children));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Section);


/***/ }),

/***/ "./resources/js/components/contact/ContactForm.tsx":
/*!*********************************************************!*\
  !*** ./resources/js/components/contact/ContactForm.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Sass/ContactForm.module.scss */ "./resources/sass/ContactForm.module.scss");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);



const ContactForm = () => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].contactForm },
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].formGroup },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].label, htmlFor: "name" }, "Name"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].input, id: "name", type: "text", placeholder: "Your Name" })),
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].formGroup },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].label, htmlFor: "email" }, "Email"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].input, id: "email", type: "email", placeholder: "Your Email" })),
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].formGroup },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].label, htmlFor: "message" }, "Message"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", { className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].input, Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].textarea), id: "message", placeholder: "Your Message" })),
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].buttonContainer },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { className: Sass_ContactForm_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].button, type: "submit" }, "Send Message"))));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContactForm);


/***/ }),

/***/ "./resources/js/pages/Contact.tsx":
/*!****************************************!*\
  !*** ./resources/js/pages/Contact.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.mjs");
/* harmony import */ var Components_Section__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/Section */ "./resources/js/components/Section.tsx");
/* harmony import */ var Components_contact_ContactForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/contact/ContactForm */ "./resources/js/components/contact/ContactForm.tsx");
/* harmony import */ var Constants_contact__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Constants/contact */ "./resources/js/constants/contact.ts");





const Contact = () => {
    const contactInfo = [
        { icon: react_icons_fa__WEBPACK_IMPORTED_MODULE_4__.FaPhone, text: Constants_contact__WEBPACK_IMPORTED_MODULE_3__.PHONE, link: `tel:${Constants_contact__WEBPACK_IMPORTED_MODULE_3__.PHONE}` },
        { icon: react_icons_fa__WEBPACK_IMPORTED_MODULE_4__.FaEnvelope, text: Constants_contact__WEBPACK_IMPORTED_MODULE_3__.EMAIL, link: `mailto:${Constants_contact__WEBPACK_IMPORTED_MODULE_3__.EMAIL}` },
        { icon: react_icons_fa__WEBPACK_IMPORTED_MODULE_4__.FaLinkedin, text: 'LinkedIn Profile', link: Constants_contact__WEBPACK_IMPORTED_MODULE_3__.LINKEDIN_URL }, // Replace
        { icon: react_icons_fa__WEBPACK_IMPORTED_MODULE_4__.FaGithub, text: 'GitHub Profile', link: Constants_contact__WEBPACK_IMPORTED_MODULE_3__.GITHUB_URL }, // Replace, Optional
        { icon: react_icons_fa__WEBPACK_IMPORTED_MODULE_4__.FaMapMarkerAlt, text: 'Littleton, CO', link: 'https://www.google.com/maps/place/littleton+CO' },
    ];
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_Section__WEBPACK_IMPORTED_MODULE_1__["default"], { header: "Contact Me", subheader: "Get in touch with me!" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", { className: "text-xl font-bold mb-4" }, "Contact Details"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", { className: "space-y-4" }, contactInfo.map((item, index) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", { key: index, className: "flex items-center" },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-blue-500" }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(item.icon, null)),
                        item.link ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", { href: item.link, className: "ml-3 text-gray-700 hover:text-blue-500", target: "_blank", rel: "noopener noreferrer" }, item.text)) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "text-gray-700" }, item.text)))))),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "mt-8" },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", { className: "text-xl font-bold mb-4" }, "Frequently Asked Questions"),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("details", { className: "bg-white p-4 rounded shadow mb-2" },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("summary", { className: "cursor-pointer select-none" }, "What's your preferred method of communication?"),
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", { className: "mt-3 text-gray-600" }, "Email is usually best, but I'm also responsive on LinkedIn.")),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("details", { className: "bg-white p-4 rounded shadow mb-2" },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("summary", { className: "cursor-pointer select-none" }, "Are you open to freelance work?"),
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", { className: "mt-3 text-gray-600" }, "Yes, I'm always interested in discussing new opportunities.")))),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", { className: "text-xl font-bold mb-4" }, "Send a Message"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_contact_ContactForm__WEBPACK_IMPORTED_MODULE_2__["default"], null))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Contact);


/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ })

}]);
//# sourceMappingURL=resources_js_pages_Contact_tsx.js.map