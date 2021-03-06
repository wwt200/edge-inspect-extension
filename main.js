/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    // Modules
    var inspect                 = require("inspect"),
        inspectToolbarHtml      = require("text!htmlContent/inspect-toolbar.html"),
        Strings                 = require("strings");

    var AppInit                 = brackets.getModule("utils/AppInit"),
        ExtensionUtils          = brackets.getModule("utils/ExtensionUtils");
    
    AppInit.appReady(function () {
        var $toolbarIcon,
            root = require.toUrl('./');
        
        ExtensionUtils.loadStyleSheet(module, "styles/inspect.css");

        function makeHiDPIURLBackground(loDPI, hiDPI) {
            return "background: no-repeat -webkit-image-set(url('" + root +
                "img/" + loDPI + "') 1x, url('" + root + "img/" + hiDPI + "') 2x);";
        }

        ExtensionUtils.addEmbeddedStyleSheet(".inspect-content .toggleon {" +
            makeHiDPIURLBackground(Strings.TOGGLE_ON_IMG, Strings.TOGGLE_ON_IMG_HIDPI) + "}");
        
        ExtensionUtils.addEmbeddedStyleSheet(".inspect-content .toggleoff {" +
            makeHiDPIURLBackground(Strings.TOGGLE_OFF_IMG, Strings.TOGGLE_OFF_IMG_HIDPI) + "}");

        // Add the toolbar icon to the toolbar in a disabled state       
        $toolbarIcon = $(Mustache.render(inspectToolbarHtml, Strings))
            .addClass("inactive")
            .appendTo("#main-toolbar > .buttons")
            .attr("title", Strings.INSPECT_BUTTON);
        
        // Initialize the Inspect administrator
        inspect.initAdmin()
            .done(function () {
                // Change the state of the toolbar to enabled if successful
                $toolbarIcon.removeClass("inactive");
                $toolbarIcon.on("click", inspect.handleInspectControls);
            })
            .fail(function (err) {
                console.log("Edge Inspect initialization failed: " + err);
            });
    });
    
    // for unit testing
    exports.inspect = inspect;
});
