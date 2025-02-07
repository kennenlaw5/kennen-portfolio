(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_pages_home_Home_tsx"],{

/***/ "./resources/sass/Skill.module.scss":
/*!******************************************!*\
  !*** ./resources/sass/Skill.module.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"skill":"Skill-module__skill__vGIkf"});

/***/ }),

/***/ "./resources/sass/SkillFilter.module.scss":
/*!************************************************!*\
  !*** ./resources/sass/SkillFilter.module.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"skillFilter":"SkillFilter-module__skillFilter__ra5JG","skillFilterButton":"SkillFilter-module__skillFilter__button__SAYNc","skillFilterButtonSelected":"SkillFilter-module__skillFilter__button--selected__KAqy7","skillFilterButtonUnselected":"SkillFilter-module__skillFilter__button--unselected__RU8hY"});

/***/ }),

/***/ "./resources/js/components/Card.tsx":
/*!******************************************!*\
  !*** ./resources/js/components/Card.tsx ***!
  \******************************************/
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


const Card = ({ children, className, header, subheader }) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('p-4 bg-white shadow rounded select-none cursor-default', className) },
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex flex-row mb-2' },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", { className: "font-bold text-xl" }, header),
        subheader ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", { className: "text-lg text-gray-500 ml-2" }, subheader) : null),
    children));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Card);


/***/ }),

/***/ "./resources/js/components/Certificates.tsx":
/*!**************************************************!*\
  !*** ./resources/js/components/Certificates.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/Card */ "./resources/js/components/Card.tsx");
/* harmony import */ var Components_Section__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/Section */ "./resources/js/components/Section.tsx");



const certificatesData = [
    { image: '/images/CompTIA-Security-Plus.png', text: "In-Progress", alt: 'Security+ Certification Logo' },
    { image: '/images/CompTIA-Network-Plus.png', text: "Todo", alt: 'Network+ Certification Logo' },
    { image: '/images/CompTIA-A-Plus.png', text: "Todo", alt: 'A+ Certification Logo' },
];
const Certificates = () => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_Section__WEBPACK_IMPORTED_MODULE_2__["default"], { header: "Certificates" },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_Card__WEBPACK_IMPORTED_MODULE_1__["default"], { header: "CompTIA", subheader: "- Curiosity-Driven IT Exploration" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "grid grid-cols-3 items-center justify-center" }, certificatesData.map((certificate, index) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { key: index, className: 'flex flex-col items-center' },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", { src: certificate.image, alt: certificate.alt, className: "w-24 h-24 object-contain" }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", { className: "text-center text-gray-700" }, certificate.text)))))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Certificates);


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

/***/ "./resources/js/components/Skill.tsx":
/*!*******************************************!*\
  !*** ./resources/js/components/Skill.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Sass_Skill_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Sass/Skill.module.scss */ "./resources/sass/Skill.module.scss");


const Skill = ({ children }) => (
// <span className="cursor-default bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{children}</span>
react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: Sass_Skill_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].skill }, children));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Skill);


/***/ }),

/***/ "./resources/js/components/SkillFilter.tsx":
/*!*************************************************!*\
  !*** ./resources/js/components/SkillFilter.tsx ***!
  \*************************************************/
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
/* harmony import */ var Constants_skills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Constants/skills */ "./resources/js/constants/skills.ts");
/* harmony import */ var Sass_SkillFilter_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Sass/SkillFilter.module.scss */ "./resources/sass/SkillFilter.module.scss");




const SkillFilter = ({ selectedType, onClick, className }) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(Sass_SkillFilter_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].skillFilter, className) }, Object.values(Constants_skills__WEBPACK_IMPORTED_MODULE_2__.SKILL_TYPES).map((type) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { key: type, className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(Sass_SkillFilter_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].skillFilterButton, {
        [Sass_SkillFilter_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"]['skillFilterButtonSelected']]: selectedType === type,
        [Sass_SkillFilter_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"]['skillFilterButtonUnselected']]: selectedType !== type
    }), onClick: () => onClick(type) }, type.toUpperCase())))));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SkillFilter);


/***/ }),

/***/ "./resources/js/constants/skills.ts":
/*!******************************************!*\
  !*** ./resources/js/constants/skills.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SKILLS: () => (/* binding */ SKILLS),
/* harmony export */   SKILL_TYPES: () => (/* binding */ SKILL_TYPES)
/* harmony export */ });
const SKILL_TYPES = {
    ALL: 'all',
    BACKEND: 'backend',
    CLOUD: 'cloud',
    FRONTEND: 'frontend',
};
const SKILLS = {
    PHP: {
        name: "PHP",
        type: SKILL_TYPES.BACKEND
    },
    LARAVEL: {
        name: "Laravel",
        type: SKILL_TYPES.BACKEND
    },
    JAVASCRIPT: {
        name: "JavaScript",
        type: SKILL_TYPES.FRONTEND
    },
    TYPESCRIPT: {
        name: "TypeScript",
        type: SKILL_TYPES.FRONTEND
    },
    REACT: {
        name: "React",
        type: SKILL_TYPES.FRONTEND
    },
    JQUERY: {
        name: "Jquery",
        type: SKILL_TYPES.FRONTEND
    },
    SQL: {
        name: "SQL",
        type: SKILL_TYPES.BACKEND
    },
    GIT: {
        name: "Git",
        type: SKILL_TYPES.BACKEND
    },
    AWS_ECOSYSTEM: {
        name: "AWS Ecosystem",
        type: SKILL_TYPES.CLOUD
    },
    JIRA: {
        name: "Jira",
        type: SKILL_TYPES.CLOUD
    },
    BITBUCKET: {
        name: "Bitbucket",
        type: SKILL_TYPES.CLOUD
    },
    GITHUB: {
        name: "GitHub",
        type: SKILL_TYPES.CLOUD
    },
    HTML: {
        name: "HTML",
        type: SKILL_TYPES.FRONTEND
    },
    CSS_SCSS: {
        name: "CSS/SCSS",
        type: SKILL_TYPES.FRONTEND
    },
    MICROSERVICES: {
        name: "Microservices",
        type: SKILL_TYPES.BACKEND
    },
    NODEJS: {
        name: "Node.js",
        type: SKILL_TYPES.BACKEND
    },
    COMPOSER: {
        name: "Composer",
        type: SKILL_TYPES.BACKEND
    },
    DOCKER: {
        name: "Docker",
        type: SKILL_TYPES.BACKEND
    },
    VALET: {
        name: "Valet",
        type: SKILL_TYPES.BACKEND
    },
    JAVA: {
        name: "Java",
        type: SKILL_TYPES.BACKEND
    },
    C_PLUS_PLUS: {
        name: "C++",
        type: SKILL_TYPES.BACKEND
    },
    PYTHON: {
        name: "Python",
        type: SKILL_TYPES.BACKEND
    },
    WEBPACK: {
        name: "Webpack",
        type: SKILL_TYPES.FRONTEND
    },
};


/***/ }),

/***/ "./resources/js/pages/helpers.ts":
/*!***************************************!*\
  !*** ./resources/js/pages/helpers.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   downloadResume: () => (/* binding */ downloadResume)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const RESUME_URL = 'https://docs.google.com/document/d/14K7hLjViIuXXpuLgtiFRXHqMCbRjiwqoC5CeOnR1uDg/export?format=pdf';
const downloadResume = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(RESUME_URL, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Kennen Lawrence - Resume.pdf'); // Specify your custom filename here
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    catch (error) {
        console.error('Error downloading file', error);
    }
});


/***/ }),

/***/ "./resources/js/pages/home/Home.tsx":
/*!******************************************!*\
  !*** ./resources/js/pages/home/Home.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var Constants_routes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Constants/routes */ "./resources/js/constants/routes.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var JS_pages_home_sections_Skills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! JS/pages/home/sections/Skills */ "./resources/js/pages/home/sections/Skills.tsx");
/* harmony import */ var JS_pages_home_sections_AboutMe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! JS/pages/home/sections/AboutMe */ "./resources/js/pages/home/sections/AboutMe.tsx");
/* harmony import */ var Components_Certificates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Components/Certificates */ "./resources/js/components/Certificates.tsx");
/* harmony import */ var Components_Section__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! Components/Section */ "./resources/js/components/Section.tsx");







const Home = () => {
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Components_Section__WEBPACK_IMPORTED_MODULE_5__["default"], { className: "bg-white shadow rounded p-8" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "text-center" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h1", { className: "text-4xl font-bold mb-4" }, "Innovative Software Engineer & Technical Leader"),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", { className: "text-xl text-gray-700 mb-6" }, "Building scalable solutions and fostering collaboration through technology."),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Link, { to: Constants_routes__WEBPACK_IMPORTED_MODULE_0__.ROUTES.PROJECTS, className: "bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition" }, "View My Work"))),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Components_Certificates__WEBPACK_IMPORTED_MODULE_4__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("section", { className: "mb-8" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h2", { className: "text-3xl font-bold mb-4" }, "Featured Experience"),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "bg-white shadow rounded p-4" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h3", { className: "font-bold text-xl mb-2" }, "Amazon Autos Partnership"),
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", null, "Played a pivotal role in launching Amazon Autos at A2Z Sync, establishing the company as a market leader.")),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "bg-white shadow rounded p-4" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h3", { className: "font-bold text-xl mb-2" }, "Scalable React Libraries"),
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", null, "Designed reusable React components that optimized UI performance, reducing load times by up to 50%.")),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "bg-white shadow rounded p-4" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h3", { className: "font-bold text-xl mb-2" }, "Legacy Code Modernization"),
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", null, "Led efforts to refactor and modernize legacy systems, improving maintainability and performance.")))),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(JS_pages_home_sections_Skills__WEBPACK_IMPORTED_MODULE_2__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(JS_pages_home_sections_AboutMe__WEBPACK_IMPORTED_MODULE_3__["default"], null)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);


/***/ }),

/***/ "./resources/js/pages/home/sections/AboutMe.tsx":
/*!******************************************************!*\
  !*** ./resources/js/pages/home/sections/AboutMe.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var JS_pages_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! JS/pages/helpers */ "./resources/js/pages/helpers.ts");
/* harmony import */ var Components_Section__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Components/Section */ "./resources/js/components/Section.tsx");



const AboutMe = () => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_Section__WEBPACK_IMPORTED_MODULE_2__["default"], { header: "About Me", className: "bg-white shadow rounded p-8" },
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", { className: "mb-4" }, "I'm Kennen Lawrence from Denver, CO. I excel in fostering collaborative environments, leading high-impact projects, and aligning technical initiatives with business objectives."),
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "My experience spans from launching industry-first tools at A2Z Sync to modernizing legacy codebases. I am procient in engineering strategy and implementation, optimizing performance, enhancing system scalability, and ensuring software reliability. I continuously seek opportunities for growth through industry certications, staying up-to-date with emerging technologies, and leadership training. I continuously strive for excellence both in my professional career and through leadership roles, including my work with Excel Taekwondo."),
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: JS_pages_helpers__WEBPACK_IMPORTED_MODULE_1__.downloadResume, className: "inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition" }, "Download My Resume")));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AboutMe);


/***/ }),

/***/ "./resources/js/pages/home/sections/Skills.tsx":
/*!*****************************************************!*\
  !*** ./resources/js/pages/home/sections/Skills.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var Components_Skill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Components/Skill */ "./resources/js/components/Skill.tsx");
/* harmony import */ var Constants_skills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! Constants/skills */ "./resources/js/constants/skills.ts");
/* harmony import */ var Components_SkillFilter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Components/SkillFilter */ "./resources/js/components/SkillFilter.tsx");
/* harmony import */ var Components_Section__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Components/Section */ "./resources/js/components/Section.tsx");





const Skills = () => {
    const [selectedSkillType, setSelectedSkillType] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(Constants_skills__WEBPACK_IMPORTED_MODULE_2__.SKILL_TYPES.ALL);
    const handleTypeChange = (value) => {
        setSelectedSkillType(value);
    };
    const renderSubHeader = () => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_SkillFilter__WEBPACK_IMPORTED_MODULE_3__["default"], { selectedType: selectedSkillType, onClick: handleTypeChange, className: "ml-4" }));
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_Section__WEBPACK_IMPORTED_MODULE_4__["default"], { header: "Skills & Technologies", subheader: renderSubHeader() },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "flex flex-wrap gap-4" }, Object.values(Constants_skills__WEBPACK_IMPORTED_MODULE_2__.SKILLS).map(({ name, type }) => {
            const shouldShow = selectedSkillType === Constants_skills__WEBPACK_IMPORTED_MODULE_2__.SKILL_TYPES.ALL || selectedSkillType === type;
            return shouldShow ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Components_Skill__WEBPACK_IMPORTED_MODULE_1__["default"], { key: name }, name) : null;
        }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Skills);


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
//# sourceMappingURL=resources_js_pages_home_Home_tsx.js.map