/*
    Copyright  Salesforce.com 2015
    Copyright 2010 Meebo Inc.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
var SFIDWidget_loginHandler, SFIDWidget_logoutHandler;
window.sfdcAlert = window.sfdcAlert || window.alert;
var SFIDWidget = function () {
    function e(e) {
        return SFIDWidget.config.expid && (-1 === e.indexOf("?")
            ? e += "?expid=" + encodeURIComponent(SFIDWidget.config.expid) : e += "&expid="
            + encodeURIComponent(SFIDWidget.config.expid)), e
    }

    function t(e) {
        return SFIDWidget.config.locale && (-1 === e.indexOf("?")
            ? e += "?locale=" + SFIDWidget.config.locale : e += "&locale=" + SFIDWidget.config.locale), e
    }
    function n(n) {
        null != n && (n.innerHTML = ""); var o = document.createElement("div");

        if ("modal" === SFIDWidget.config.mode ? o.id = "sfid-content" : "inline" === SFIDWidget.config.mode &&
            (o.id = "sfid-inline-content"), SFIDWidget.config.useCommunityBackgroundColor &&
            (o.style.backgroundColor = SFIDWidget.authconfig.LoginPage.BackgroundColor),
            "modal" === SFIDWidget.config.mode && null != SFIDWidget.authconfig.LoginPage.LogoUrl) {
            var d = document.createElement("div"); d.id = "sfid-logo_wrapper", d.className = "sfid-standard_logo_wrapper sfid-mt12";
            var a = document.createElement("img");
            a.src = SFIDWidget.authconfig.LoginPage.LogoUrl, a.className = "sfid-standard_logo", a.alt = "Salesforce", d.appendChild(a);
            var r = document.createElement("h2");
            r.id = "dialogTitle";
            var c = document.createTextNode("Salesforce Login");
            r.appendChild(c), o.setAttribute("role", "dialog"), o.setAttribute("aria-labelledby", r.id),
                o.tabIndex = "-1", o.addEventListener("keydown", function (e) { 27 === e.keyCode && SFIDWidget.cancel() }, !0), o.appendChild(d)
        }
        var l = document.createElement("div");
        if (l.className = "sfid-mb1", l.id = "sfid-error", l.innerHTML = "We can\'t log you in. Make sure your username and password are correct.",
            l.style.display = "none", l.setAttribute("role", "alert"), o.appendChild(l), SFIDWidget.authconfig.LoginPage.UsernamePasswordEnabled) {
            var s = !0, g = !1, u = !1;
            if (SFIDWidget.authconfig.LoginPageType && SFIDWidget.authconfig.LoginPageTypeConfigs &&
                SFIDWidget.authconfig.LoginPageTypeConfigs.ApplyToEmbeddedLogin &&
                (g = "discoverable" == SFIDWidget.authconfig.LoginPageType, u = "custom" == SFIDWidget.authconfig.LoginPageType, s = !(g || u)),
                !(s || g || u)) return; var m, f, p, S, I = document.createElement("form");
            I.setAttribute("onSubmit", "SFIDWidget.authenticate();return false;"), (s || g) &&
                ((m = document.createElement("input")).className = "sfid-wide sfid-mb12", m.type = "text", m.name = "username",
                    m.id = "sfid-username", m.setAttribute("autofocus", "autofocus"),
                    (f = document.createElement("LABEL")).htmlFor = m.id, f.className = "sfid-button-label"), s ? (f.innerText = "Username",
                        (p = document.createElement("input")).className = "sfid-wide sfid-mb12",
                        p.type = "password", p.name = "password", p.id = "sfid-password",
                        (S = document.createElement("LABEL")).innerText = "Password", S.htmlFor = p.id, S.className = "sfid-button-label") : g &&
                    (f.innerText = SFIDWidget.authconfig.LoginPageTypeConfigs.LoginPrompt),
                (H = document.createElement("input")).className = "sfid-button sfid-wide sfid-mb16", H.type = "submit", H.id = "sfid-submit",
                H.value = "Log In", SFIDWidget.config.useCommunityPrimaryColor && (H.style.backgroundColor = SFIDWidget.authconfig.LoginPage.PrimaryColor),
                (s || g) && (I.appendChild(f), I.appendChild(m)), s && (I.appendChild(S), I.appendChild(p)), I.appendChild(H), o.appendChild(I)
        }
        var D, W, F = document.createElement("div");
        if (F.id = "sfid-selfreg-password", "true" === SFIDWidget.config.forgotPasswordEnabled) {
            var h = document.createElement("a");
            h.id = "sfid-forgot-password";
            var v = e(t(SFIDWidget.authconfig.LoginPage.ForgotPasswordUrl));
            h.href = decodeURIComponent(v), h.text = "Forgot your password?", F.appendChild(h)
        }
        if (SFIDWidget.authconfig.LoginPage.SelfRegistrationEnabled && "true" === SFIDWidget.config.selfRegistrationEnabled) {
            var b = document.createElement("a");
            b.id = "sfid-self-registration";
            var y = e(t(SFIDWidget.authconfig.LoginPage.SelfRegistrationUrl));
            b.href = (D = y, W = "/services/oauth2/authorize?response_type=token&client_id=" + SFIDWidget.config.client_id +
                "&redirect_uri=" + encodeURIComponent(SFIDWidget.config.redirect_uri),
                "true" === SFIDWidget.config.addStartUrlToSelfReg &&
                (-1 === D.indexOf("?") ? D += "?startURL=" + encodeURIComponent(W) : D += "&startURL=" + encodeURIComponent(W)), D),
                b.text = "Not a member?", F.appendChild(b)
        } F.children.length > 0 && o.appendChild(F);
        var w = SFIDWidget.authconfig.LoginPage.UsernamePasswordEnabled, C = SFIDWidget.authconfig.AuthProviders.length,
            R = SFIDWidget.authconfig.SamlProviders.length;
        if (w && (C > 0 || R > 0)) {
            var k = document.createElement("br");
            (L = document.createElement("p")).className = "sfid-small", L.innerHTML = "",
                o.appendChild(k), o.appendChild(L)
        } 
         else if (!w && (C > 0 || R > 0)) {
            var L;
            (L = document.createElement("p")).className = "sfid-small sfid-mb16", L.innerHTML = "Choose an authentication provider.", o.appendChild(L)
        }
     /*   if (SFIDWidget.authconfig.AuthProviders.length > 0) {
            (O = document.createElement("div")).id = "sfid-social";
            for (var U = document.createElement("ul"), _ = 0;
                _ < SFIDWidget.authconfig.AuthProviders.length; _++) {
                var E = document.createElement("li"), x = SFIDWidget.authconfig.AuthProviders[_].IconUrl, T = SFIDWidget.authconfig.AuthProviders[_].SsoUrl;
                -1 === T.indexOf("?") ? T += "?startURL=" + encodeURIComponent(SFIDWidget.config.authorizeURL)
                    : T += "&startURL=" + encodeURIComponent(SFIDWidget.config.authorizeURL);
                var A = SFIDWidget.authconfig.AuthProviders[_].Name;
                if (E.className = "sfid-button-ap", E.id = "sfid-button-ap-" + A, null != x) {
                    var P = document.createElement("img");
                    P.className = "sfid-social-buttonimg", P.src = x, P.alt = "Login with " + A;
                    var N = document.createElement("a");
                    N.href = T, N.appendChild(P), N.title = A, E.appendChild(N)
                }
                else {
                    (H = document.createElement("button")).setAttribute("onclick", "location.href='" + T + "';");
                    var q = document.createTextNode(A); H.appendChild(q), E.appendChild(H)
                }
                U.appendChild(E)
            } O.appendChild(U), o.appendChild(O)
        }

        if (SFIDWidget.authconfig.SamlProviders.length > 0) {
            var O; (O = document.createElement("div")).id = "sfid-social";
            U = document.createElement("ul");
            for (var M in SFIDWidget.authconfig.SamlProviders) {
                E = document.createElement("li");

                var H = document.createElement("button"), B = i(SFIDWidget.authconfig.SamlProviders[M].SsoUrl, "RelayState"),
                    z = "&RelayState=" + encodeURIComponent(SFIDWidget.config.authorizeURL), J = SFIDWidget.authconfig.SamlProviders[M].Name;
                E.className = "sfid-button-saml", E.id = "sfid-button-saml-" + J, H.setAttribute("onclick", "location.href='" + B + z + "';");
                q = document.createTextNode(J);

                H.appendChild(q), E.appendChild(H), U.appendChild(E)
            } O.appendChild(U), o.appendChild(O)
        } */
        if ("modal" === SFIDWidget.config.mode) {
            var X = document.createElement("div");
            X.className = "sfid-lightbox", X.id = "sfid-login-overlay", X.setAttribute("onClick", "SFIDWidget.cancel()");
            var Q = document.createElement("div"); Q.id = "sfid-wrapper", Q.onclick = function (e) { (e = e || window.event).stopPropagation ? e.stopPropagation() : e.cancelBubble = !0 },
                Q.appendChild(o), X.appendChild(Q), document.body.appendChild(X)
        } else n.appendChild(o)
    }
    function i(e, t) {
        var n = e.split("?"); if (n.length >= 2) {
            for (var i = encodeURIComponent(t) + "=", o = n[1].split(/[&;]/g), d = o.length; d-- > 0;)-1 !== o[d].lastIndexOf(i, 0) && o.splice(d, 1);
            return e = n[0] + (o.length > 0 ? "?" + o.join("&") : "")
        } return e
    }
    function o(e) {
        var t; "string" == typeof e.data && (t = JSON.parse(e.data)), t && t.cmd && "string" == typeof t.cmd &&
            ("sfdcCallback::extendDone" === t.cmd ? function (e) {
                var t = e.origin.split("://")[1].split("/")[0], n = JSON.parse(e.data);
                if (!n) return; if (t !== location.host && !function (e) {
                    if (!e || !SFIDWidget.config.allowedDomains) return !1;
                    for (var t = 0; t < SFIDWidget.config.allowedDomains.length; t += 1) {
                        var n = SFIDWidget.config.allowedDomains[t]; if (n === e) return !0;
                        if (0 === n.indexOf("*.")) {
                            var i = n.substring(2, n.length);
                            if (d = i, -1 !== (o = e).indexOf(d, o.length - d.length)) return !0
                        }
                    }
                    var o, d; return !1
                }(t)) return void console.log("message from host not allowed : " + t);
                window.location = n.redirectUri
            }(e) : function (e) {
                var t = e.origin.split("://")[1].split("/")[0];
                if (t !== SFIDWidget.config.domain) return void console.log("doesnt match domain: " + t + " : " + SFIDWidget.config.domain);
                var n = JSON.parse(e.data);
                if (!n) return;
                if ("sfdcxauth::ready" === n.cmd) return postWindow = iframe.contentWindow, void setTimeout(d, 0);
                var i = openRequests[n.id];
                i && (i.callback && i.callback(n), delete openRequests[n.id])
            }(e))
    }
    function d() { for (var e = 0; e < requestQueue.length; e++)a(openRequests[requestQueue.shift()]) }
    function a(e) { document.getElementById("sfid_xdomain").contentWindow.postMessage(JSON.stringify(e), SFIDWidget.XAuthServerUrl) }
    function r(e) {
        unsupported || (e.id = requestId, openRequests[requestId++] = e, iframe && postWindow ? a(e) :
            (requestQueue.push(e.id), function () {
                if (!iframe && !postWindow) {
                    var e = win.document;
                    iframe = e.createElement("iframe"), iframe.id = "sfid_xdomain", iframe.style.display = "none", win.addEventListener ?
                        win.addEventListener("message", o, !1) : win.attachEvent && win.attachEvent("onmessage", o), e.body.appendChild(iframe),
                        iframe.src = SFIDWidget.XAuthServerUrl
                }
            }()))
    }
    function c(e) {
        e.alive && !SFIDWidget.openid_response ? (console.log("you got logged in"), SFIDWidget.init()) :
            !e.alive && SFIDWidget.openid_response && (console.log("you got logged out"), SFIDWidget.logout())
    }
    function l(e) {
        var t = e.identityServiceResponses;
        for (var i in t) {
            var o = t[i].identityServiceResponse, d = atob(o);
            SFIDWidget.openid_response = JSON.parse(d)
        }
        if (SFIDWidget.openid_response) window[SFIDWidget_loginHandler](SFIDWidget.openid_response);
        else if ("modal" === SFIDWidget.config.mode || "inline" === SFIDWidget.config.mode || "popup" === SFIDWidget.config.mode) {
            var a = new XMLHttpRequest; a.onreadystatechange = function () {
                var e = this.DONE || 4;
                this.readyState === e && (SFIDWidget.authconfig = JSON.parse(this.responseText), function () {
                    var e = ""; e = "popup" === SFIDWidget.config.mode ? encodeURIComponent(SFIDWidget_loginHandler)
                        : SFIDWidget.config.startURL ? encodeURIComponent(SFIDWidget.config.startURL) : ""; var t = "token";
                    SFIDWidget.config.serverCallback && (t = "code");
                    SFIDWidget.config.authorizeURL = "/services/oauth2/authorize", SFIDWidget.config.expid &&
                        (SFIDWidget.config.authorizeURL += "/expid_" + encodeURIComponent(SFIDWidget.config.expid));
                    SFIDWidget.config.authorizeURL += "?response_type=" + t + "&client_id=" +
                        SFIDWidget.config.client_id + "&redirect_uri=" + encodeURIComponent(SFIDWidget.config.redirect_uri) +
                        "&state=" + e, "inline" === SFIDWidget.config.mode ? n(document.querySelector(SFIDWidget.config.target)) :
                            function (e) {
                                e.innerHTML = "";
                                var t = document.createElement("button"); t.id = "sfid-login-button", t.className = "sfid-button",
                                    t.innerHTML = "Log in", t.setAttribute("onClick", "SFIDWidget.login()"),
                                    SFIDWidget.config.useCommunityPrimaryColor &&
                                    (t.style.backgroundColor = SFIDWidget.authconfig.LoginPage.PrimaryColor), e.appendChild(t)
                            }
                                (document.querySelector(SFIDWidget.config.target))
                }())
            };
            var r = SFIDWidget.config.communityURL + "/.well-known/auth-configuration";
            SFIDWidget.config.expid && (r += "?expid=" + encodeURIComponent(SFIDWidget.config.expid)),
                a.open("GET", r, !0), a.send(null)
        } setInterval("SFIDWidget.isAlive()", 3e3)
    }
    function s() { document.getElementById("sfid-error").style.display = "inline" }
    this.config = null, this.access_token = null, this.openid = null, this.openid_response = null,
        this.win = window, this.unsupported = !(this.win.postMessage && function (e) {
            try { var t = window[e], n = "__storage_test__"; return t.setItem(n, n), t.removeItem(n), !0 }
            catch (e) {
                return e instanceof DOMException && (22 === e.code || 1014 === e.code
                    || "QuotaExceededError" === e.name || "NS_ERROR_DOM_QUOTA_REACHED" === e.name) && 0 !== t.length
            }
        }(
            "localStorage") && this.win.JSON), this.XAuthServerUrl = null, this.iframe = null, this.postWindow = null,
        this.openRequests = {}, this.requestId = 0, this.requestQueue = []; function g() { SFIDWidget.getToken({ callback: l }) }
    return {
        init:
            function () {
                SFIDWidget.config = {}, SFIDWidget.config.startURL = location;
                var e = function (e) {
                    e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var t = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(location.search);
                    return null === t ? null : decodeURIComponent(t[1].replace(/\+/g, " "))
                }("locale");
                SFIDWidget.config.locale = null !== e ? e : "us";
                var t = document.querySelector('meta[name="salesforce-expid"]');
                null !== t && (SFIDWidget.config.expid = t.content);
                var n = document.querySelector('meta[name="salesforce-use-min-js"]');
                null !== n && (SFIDWidget.config.nonMinifiedJS = "false" === n.content);
                var i = document.querySelector('meta[name="salesforce-cache-max-age"]');
                null !== i && (SFIDWidget.config.salesforceCacheMaxAge = i.content), SFIDWidget.config.logoutOnBrowserClose = !0;
                var o = document.querySelector('meta[name="salesforce-logout-on-browser-close"]');
                null !== o && (SFIDWidget.config.logoutOnBrowserClose = "true" === o.content);

                var d = document.querySelector('meta[name="salesforce-use-login-page-background-color"]');
                null !== d && (SFIDWidget.config.useCommunityBackgroundColor = "true" === d.content);
                var a = document.querySelector('meta[name="salesforce-use-login-page-login-button"]');
                null !== a && (SFIDWidget.config.useCommunityPrimaryColor = "true" === a.content);
                var r = document.querySelector('meta[name="salesforce-community"]');
                if (null !== r) {
                    SFIDWidget.config.communityURL = r.content,
                        SFIDWidget.config.domain = SFIDWidget.config.communityURL.split("://")[1].split("/")[0],
                        SFIDWidget.XAuthServerUrl = SFIDWidget.config.communityURL +
                        "/servlet/servlet.loginwidgetcontroller?type=javascript_xauth&host="
                        + window.location.host, SFIDWidget.config.expid && (SFIDWidget.XAuthServerUrl
                            += "&expid=" + encodeURIComponent(SFIDWidget.config.expid)),
                        SFIDWidget.config.nonMinifiedJS && (SFIDWidget.XAuthServerUrl += "&min=false"),
                        SFIDWidget.config.salesforceCacheMaxAge && (SFIDWidget.XAuthServerUrl += "&cacheMaxAge=" +
                            encodeURIComponent(SFIDWidget.config.salesforceCacheMaxAge));
                    var c = document.querySelector('meta[name="salesforce-server-callback"]');
                    null === c || "false" === c.content ? SFIDWidget.config.serverCallback = !1 :
                        "true" === c.content && (SFIDWidget.config.serverCallback = !0);
                    var l = document.querySelector('meta[name="salesforce-allowed-domains"]');
                    null !== l && (SFIDWidget.config.allowedDomains = l.content.split(","));

                    var s = document.querySelector('meta[name="salesforce-mode"]');
                    if (null !== s) { if (SFIDWidget.config.mode = s.content, "popup-callback" === SFIDWidget.config.mode || "modal-callback" === SFIDWidget.config.mode || "inline-callback" === SFIDWidget.config.mode) { if (null === l) return void window.sfdcAlert("Enter the trusted domains, for example, localhost, @.somedomain.com."); var u = document.querySelector('meta[name="salesforce-save-access-token"]'); return null === u || "false" === u.content ? SFIDWidget.config.saveToken = !1 : "true" === u.content && (SFIDWidget.config.saveToken = !0), void SFIDWidget.handleLoginCallback() } var m = document.querySelector('meta[name="salesforce-mask-redirects"]'); SFIDWidget.config.maskRedirects = m ? m.content : "true"; var f = document.querySelector('meta[name="salesforce-client-id"]'); if (null !== f) { SFIDWidget.config.client_id = f.content; var p = document.querySelector('meta[name="salesforce-redirect-uri"]'); if (null !== p) { SFIDWidget.config.redirect_uri = p.content; var S = document.querySelector('meta[name="salesforce-forgot-password-enabled"]'); SFIDWidget.config.forgotPasswordEnabled = !!S && S.content; var I = document.querySelector('meta[name="salesforce-self-register-enabled"]'); SFIDWidget.config.selfRegistrationEnabled = !!I && I.content; var D = document.querySelector('meta[name="salesforce-login-handler"]'); if (null !== D) { SFIDWidget_loginHandler = D.content; var W = document.querySelector('meta[name="salesforce-target"]'); if (null !== W) { SFIDWidget.config.target = W.content; var F = document.querySelector('meta[name="salesforce-logout-handler"]'); null !== F && (SFIDWidget_logoutHandler = F.content); var h = document.querySelector('meta[name="salesforce-self-register-starturl-enabled"]'); SFIDWidget.config.addStartUrlToSelfReg = !!h && h.content, "popup" !== SFIDWidget.config.mode && "modal" !== SFIDWidget.config.mode && "inline" !== SFIDWidget.config.mode || (null === document.body ? function (e) { document && document.addEventListener ? document.addEventListener("DOMContentLoaded", e) : window.attachEvent("onload", e) }(function () { g() }) : g()) } else window.sfdcAlert("Enter the target on the webpage, for example, a sign-in link, to perform the login.") } else window.sfdcAlert("Enter the name of the JavaScript function to call on a successful login event for the salesforce-login-handler metatag.") } else window.sfdcAlert("Enter the Callback URL for your client-side callback page, for example, https://:logindemo.herokuapp.com/_callback.php.") } else window.sfdcAlert("Enter the Consumer Key of the OAuth connected app which issues the access token.") } else window.sfdcAlert("Enter the mode for the salesforce-mode metatag, either inline, modal, or popup.")
                } else window.sfdcAlert("Enter the URL for your Salesforce community for the salesforce-community metatag.")
            }, login: function () { if (null != SFIDWidget.config) { if ("popup" === SFIDWidget.config.mode) { var e = window.open(SFIDWidget.config.communityURL + SFIDWidget.config.authorizeURL, "Login Window", "height=580,width=450"); return window.focus && e.focus(), !1 } "modal" === SFIDWidget.config.mode && n() } }, authenticate: function () { document.getElementById("sfid-error").style.display = "none", document.getElementById("sfid-submit").disabled = !0, document.getElementById("sfid-submit").className = "sfid-disabled sfid-wide sfid-mb16"; var e = "", t = "", n = !0, i = !1, o = !1; if (SFIDWidget.authconfig.LoginPageType && SFIDWidget.authconfig.LoginPageTypeConfigs && SFIDWidget.authconfig.LoginPageTypeConfigs.ApplyToEmbeddedLogin && (i = "discoverable" == SFIDWidget.authconfig.LoginPageType, o = "custom" == SFIDWidget.authconfig.LoginPageType, n = !(i || o)), (n || i) && (e = document.getElementById("sfid-username").value), n && (t = document.getElementById("sfid-password").value), n && e && t) { var d = new XMLHttpRequest; d.withCredentials = !0, d.open("POST", SFIDWidget.config.communityURL + "/servlet/servlet.loginwidgetcontroller?type=login", !0), d.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), d.onreadystatechange = function () { var e = this.DONE || 4; if (this.readyState === e) { var t = JSON.parse(d.responseText); if ("invalid" === t.result) s(), document.getElementById("sfid-submit").disabled = !1, document.getElementById("sfid-submit").className = "sfid-button sfid-wide sfid-mb16", document.getElementById("sfid-password").value = ""; else if ("true" === SFIDWidget.config.maskRedirects) { var n = document.createElement("iframe"); n.setAttribute("src", t.result), n.className = "sfid-callback", n.id = "sfid-callback", document.body.appendChild(n) } else window.location.replace(t.result) } }, d.send("username=" + encodeURIComponent(e) + "&password=" + encodeURIComponent(t) + "&startURL=" + encodeURIComponent(SFIDWidget.config.authorizeURL) + "&mode=" + encodeURIComponent(SFIDWidget.config.mode) + "&maskRedirects=" + encodeURIComponent(SFIDWidget.config.maskRedirects)) } else if (i && e) { var a = SFIDWidget.config.communityURL + "/login?login_hint=" + encodeURIComponent(e) + "&un=" + encodeURIComponent(e) + "&startURL=" + encodeURIComponent(SFIDWidget.config.authorizeURL); if ("true" === SFIDWidget.config.maskRedirects) (r = document.createElement("iframe")).setAttribute("src", a), r.className = "sfid-callback", r.id = "sfid-callback", document.body.appendChild(r); else window.location.replace(a) } else if (o) { var r; a = SFIDWidget.authconfig.LoginPageTypeConfigs.LoginEndpointUrl + "&startURL=" + encodeURIComponent(SFIDWidget.config.authorizeURL); if ("true" === SFIDWidget.config.maskRedirects) (r = document.createElement("iframe")).setAttribute("src", a), r.className = "sfid-callback", r.id = "sfid-callback", document.body.appendChild(r); else window.location.replace(a) } else s(), document.getElementById("sfid-submit").className = "sfid-button sfid-wide sfid-mb16", document.getElementById("sfid-submit").disabled = !1 }, cancel: function () { !function () { var e = document.getElementById("sfid-login-overlay"); e.style.display = "none"; var t = document.getElementById("sfid-login-button"); e.parentNode && e.parentNode.removeChild(e), t && t.focus() }() }, handleLoginCallback: function () { if (SFIDWidget.config.serverCallback) { var e = document.querySelector('meta[name="salesforce-server-starturl"]'); SFIDWidget.config.startURL = null === e ? "/" : e.content; var t = document.querySelector('meta[name="salesforce-server-response"]'); if (null === t) return void window.sfdcAlert("The server didn\'t provide a response to the callback."); SFIDWidgetHandleOpenIDCallback(JSON.parse(atob(t.content))) } else if (window.location.hash) { var n = window.location.hash.substr(1).split("&"); for (var i in n) { var o = n[i].split("="); "id" === o[0] ? SFIDWidget.openid = decodeURIComponent(o[1]) : "access_token" === o[0] ? SFIDWidget.access_token = o[1] : "state" === o[0] && null !== o[1] && ("popup-callback" === SFIDWidget.config.mode ? null != o[1] && (SFIDWidget_loginHandler = decodeURIComponent(o[1])) : SFIDWidget.config.startURL = decodeURIComponent(o[1])) } for (var d = SFIDWidget.openid.split("/"), a = SFIDWidget.config.communityURL, r = 3; r < d.length; r += 1)a += "/" + d[r]; SFIDWidget.openid = a; var c = document.createElement("script"); c.setAttribute("src", SFIDWidget.openid + "?version=latest&format=jsonp&callback=SFIDWidgetHandleOpenIDCallback&access_token=" + SFIDWidget.access_token), document.head.appendChild(c) } }, redirectToStartURL: function () { if ("popup-callback" === SFIDWidget.config.mode) window.close(); else if ("modal-callback" === SFIDWidget.config.mode || "inline-callback" === SFIDWidget.config.mode) { var e = { cmd: "sfdcCallback::extendDone", redirectUri: SFIDWidget.config.startURL }; window.parent.postMessage(JSON.stringify(e), location.protocol + "//" + location.host + "/") } }, logout: function () { if (SFIDWidget.openid_response && SFIDWidget.openid_response.access_token) { var e = SFIDWidget.config.communityURL + "/services/oauth2/revoke?callback=SFIDWidgetHandleRevokeCallback&token=" + SFIDWidget.openid_response.access_token, t = document.createElement("script"); t.setAttribute("src", e), document.head.appendChild(t) } SFIDWidget.expireToken({ callback: SFIDWidgetHandleExpireCallback }); var n = document.createElement("iframe"); n.setAttribute("src", SFIDWidget.config.communityURL + "/secur/logout.jsp"), n.className = "sfid-logout", n.onload = function () { this.parentNode.removeChild(this), console.log("idp session was invalidated") }, document.body.appendChild(n) }, setToken: function (e) { e && r({ cmd: "sfdcxauth::extend", uid: e.uid || null, oid: e.oid || null, identity: e.identity || null, identityServiceResponse: e.identityServiceResponse || "", expire: e.expire || 0, allowedDomains: e.allowedDomains || [], widgetSession: e.widgetSession, callback: e.callback || null, communityURL: SFIDWidget.config.communityURL, active: e.active, community: e.community, mydomain: e.mydomain, activeonly: e.activeonly, retainhint: e.retainhint }) }, getToken: function (e) { e || (e = {}), r({ cmd: "sfdcxauth::retrieve", retrieve: e.retrieve || null, callback: e.callback || null }) }, expireToken: function (e) { e || (e = {}); var t = null; SFIDWidget.openid_response && SFIDWidget.openid_response.organization_id && SFIDWidget.openid_response.user_id && (t = SFIDWidget.openid_response.organization_id.substring(0, 15) + SFIDWidget.openid_response.user_id.substring(0, 15)), r({ cmd: "sfdcxauth::expire", callback: e.callback || null, storageKey: t }) }, isAlive: function (e) { e || (e = {}), r({ cmd: "sfdcxauth::alive", retrieve: e.retrieve || null, callback: e.callback || c }) }, disabled: unsupported
    }
}();
function SFIDWidgetHandleOpenIDCallback(e) {
    e.user_id = e.user_id.substring(0, 15), e.organization_id = e.organization_id.substring(0, 15), SFIDWidget.openid_response = e, console.log(SFIDWidget.openid_response),
    SFIDWidget.config.saveToken && !SFIDWidget.config.serverCallback && (SFIDWidget.openid_response.access_token = SFIDWidget.access_token);
    var t = btoa(JSON.stringify(e)), n = {};
    n.uid = e.user_id, n.username = e.username, n.thumbnail = e.photos ? e.photos.thumbnail : "", n.oid = e.organization_id, n.instance = SFIDWidget.config.communityURL,
        n.ll = e.is_lightning_login_user, SFIDWidget.setToken({
            uid: e.user_id, oid: e.organization_id, callback: SFIDWidget.redirectToStartURL,
            identity: n, expire: (new Date).getTime() + 1e5, active: !1, mydomain: !!e.urls.custom_domain,
            community: !0, activeonly: !0, retainhint: !1, widgetSession: SFIDWidget.config.logoutOnBrowserClose, allowedDomains: SFIDWidget.config.allowedDomains, identityServiceResponse: t
        })
}
function SFIDWidgetHandleRevokeCallback(e) { null != e.error ? console.log("access token was already invalid") : console.log("access token was revoked") }
function SFIDWidgetHandleExpireCallback(e) {
    console.log("xauth token was expired: " + e),
    SFIDWidget.access_token = null, SFIDWidget.openid = null, SFIDWidget.openid_response = null, SFIDWidget.config = null, SFIDWidget.authconfig = null,
    window[SFIDWidget_logoutHandler]()
} SFIDWidget.init();