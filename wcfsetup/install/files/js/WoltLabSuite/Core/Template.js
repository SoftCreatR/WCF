/**
 * Provides a high level wrapper around the Template/Compiler.
 *
 * @author  Tim Duesterhus
 * @copyright  2001-2019 WoltLab GmbH
 * @license  GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module  WoltLabSuite/Core/Template
 */
define(["require", "exports", "tslib", "./Language/Store", "./StringUtil", "./Template/Compiler"], function (require, exports, tslib_1, LanguageStore, StringUtil, Compiler_1) {
    "use strict";
    LanguageStore = tslib_1.__importStar(LanguageStore);
    StringUtil = tslib_1.__importStar(StringUtil);
    // @todo: still required?
    // work around bug in AMD module generation of Jison
    /*function Parser() {
      this.yy = {};
    }
    
    Parser.prototype = parser;
    parser.Parser = Parser;
    parser = new Parser();*/
    const pluralRules = new Intl.PluralRules(document.documentElement.lang);
    /**
     * Returns the value for a `plural` element used in the template.
     *
     * @see    wcf\system\template\plugin\PluralFunctionTemplatePlugin::execute()
     */
    function selectPlural(parameters) {
        if (!Object.hasOwn(parameters, "value")) {
            throw new Error("Missing parameter value");
        }
        if (!parameters.other) {
            throw new Error("Missing parameter other");
        }
        let value = parameters.value;
        if (Array.isArray(value)) {
            value = value.length;
        }
        // handle numeric attributes
        const numericAttribute = Object.keys(parameters).find((key) => {
            return key.toString() === parseInt(key).toString() && key.toString() === value.toString();
        });
        if (numericAttribute) {
            return numericAttribute;
        }
        let category = pluralRules.select(value);
        if (parameters[category] === undefined) {
            category = "other";
        }
        const string = parameters[category];
        if (string.includes("#")) {
            return string.replace("#", StringUtil.formatNumeric(value));
        }
        return string;
    }
    class Template {
        compiled;
        constructor(template) {
            try {
                this.compiled = (0, Compiler_1.compile)(template);
            }
            catch (e) {
                console.debug(e.message);
                throw e;
            }
        }
        /**
         * Evaluates the Template using the given parameters.
         */
        fetch(v) {
            return this.compiled(StringUtil, LanguageStore, selectPlural, v);
        }
    }
    return Template;
});
