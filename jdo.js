/**
 * jdo Version: 1.0.0.7
 * libreria para operar con los elementos del documento
 * @param {*} arg recibe clase, id, elemento ó fragmento a crear
 * @author Dairo Carrasquilla (c) 2022
 */
function jdo(arg) {

    return new class {

        __element__ = null;
        __http__ = undefined;
        __OUT_TAG__ = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "LABEL", "TH", "TD", "TEXTAREA", "A", "LI", "B", "I", "SPAN", "BUTTON", "OPTION"];
        __IN_TAG__ = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "LABEL", "TH", "TD", "TEXTAREA", "A", "LI", "B", "I", "SPAN", "BUTTON", "CODE"];
    
        constructor() {
    
            try {
    
                if (typeof arg == "undefined") {
    
                    throw new Error("Elemento no encontrado");
                }
                else if (typeof arg == "object") {
    
                    this.__element__ = arg;
                }
                else if (String(arg).startsWith("#")) {
    
                    this.__element__ = document.querySelector(arg);
                }
                else if (String(arg).startsWith('.')) {
    
                    return document.querySelectorAll(arg);
                }
                else if (arg == "fragment") {
    
                    this.__element__ = document.createDocumentFragment();
                }
                else if (arg == "file") {
    
                    this.__element__ = document.createElement("input");
                    this.__element__.type = "file";
                    this.setProps({"accept": ".*", "multiple": false});
                }
                else if (arg == "ajax") {

                    this.__http__ = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                }
                else {
    
                    this.__element__ = document.createElement(arg);
                }
            }
            catch (err) {
    
                console.error("[-] Elemento no encontrado:", err);
            }
        }
    
        father() {
    
            return jdo(this.__element__.parentElement);
        }
    
        brother(order = "next") {
    
            return (order == "next") ? jdo(this.__element__.nextElementSibling) : jdo(this.__element__.previousElementSibling);
        }
    
        exists() {
    
            if (this.__element__ == null) {
    
                return false;
            }
            else {
    
                return true;
            }
        }
    
        value(...arg) {
    
            if (arg.length == 0) {
                
                if (this.__OUT_TAG__.includes(this.getType())) {
    
                    return this.__element__.textContent;
                }
                else {
    
                    return this.__element__.value;
                }
            }
            else {
    
                if (this.__IN_TAG__.includes(this.getType())) {
    
                    this.__element__.textContent = arg[0];
                }
                else if (this.getType() == "INPUT") {
    
                    this.__element__.value = arg[0];
                }
                else if (this.getType() == "OPTION") {
    
                    this.__element__.value = arg[0];
                    this.__element__.textContent = arg[1] ? arg[1] : arg[0];
                }
                else if (this.getType() == "SELECT") {
    
                    let str = String(arg[0]);
    
                    if(/[0-9]/.test(str)) {
    
                        this.__element__.value = str;
                    }
                    else {
    
                        let item = this.children().find((item) => item.value() == str);
                        let index = (item) ? item.getAtt("value") : 0;
                        this.__element__.value = index;
                    }
                }
                else {
    
                    this.__element__.innerHTML = arg[0];
                }
    
                return this;
            }
        }
    
        textSelected() {
    
            let text = String(this.__element__.options[this.__element__.selectedIndex].text);
    
            return text;
        }
    
        addAtt(arg) {
    
            for (let att in arg) {
    
                this.__element__.setAttribute(att, arg[att]);
            }
    
            return this;
        }
    
        getAtt(arg) {
    
            return this.__element__.getAttribute(arg);
        }
    
        rmAtt(arg) {
    
            if (this.__element__.hasAttribute(arg)) {
    
                this.__element__.removeAttribute(arg);
            }
    
            return this;
        }
    
        add(...arg) {
    
            arg.forEach((item) => {
    
                this.__element__.appendChild(item.__me__());
            });
    
            return this;
        }
    
        delete(...arg) {
    
            arg.forEach((item) => {
    
                this.__element__.removeChild(item.__me__());
            });
    
            return this;
        }
    
        addClass(...arg) {
    
            this.__element__.classList.add(...arg);
    
            return this;
        }
    
        rmClass(...arg) {
    
            arg.forEach((item) => {
    
                if (this.__element__.classList.contains(item)) {
    
                    this.__element__.classList.remove(item);
                }
            });
    
            return this;
        }
    
        styles(arg) {

            if (typeof arg == "string") {

                return this.__element__.style[arg];
            }

            for (let props in arg) {
    
                this.__element__.style[props] = arg[props];
            }
    
            return this;
        }
    
        empty() {
    
            if (this.getType() == "INPUT") {
    
                this.__element__.value = ""
            }
            else if (this.getType() == "SELECT") {
    
                this.__element__.value = "0";
            }
            else {
    
                this.__element__.textContent = "";
            }
    
            return this;
        }
    
        clear() {
    
            this.__element__.innerHTML = "";
    
            return this;
        }
    
        event(tp, callback) {
    
            this.__element__.addEventListener(tp, callback);
    
            return this;
        }
    
        destroyEvent(tp, callback) {
    
            this.__element__.removeEventListener(tp, callback);
    
            return this;
        }
    
        __me__() {
    
            return this.__element__;
        }
    
        children(arg = null) {
    
            let ch = this.__element__.children;
            let elements = [];
            
            if (!arg) {
                if (ch.length > 1) {
    
                    for (let child of ch) {
    
                        elements.push(jdo(child));
                    }
    
                    return elements;
                }
                else {
    
                    return jdo(ch[0]);
                }
            }
            else {
    
                return jdo(ch[parseInt(arg) - 1]);
            }
        }
    
        getType() {
    
            return String(this.__element__.tagName);
        }
    
        click() {
    
            this.__element__.click();
    
            return this;
        }
    
        hide() {
    
            this.__element__.style.display = "none";
    
            return this;
        }
    
        show() {
    
            this.__element__.style.removeProperty("display");
    
            return this;
        }
    
        html(arg) {
    
            if (typeof arg == "undefined") {
                
                let html = this.__element__.outerHTML;
                let range = document.createRange();
                let node = range.createContextualFragment(html);

                return node.cloneNode(false);
            }
            else {
                let range = document.createRange();
                let node = range.createContextualFragment(arg);
                this.__element__.innerHTML = null;
                this.__element__.appendChild(node);

                return this;
            }
        }
    
        setProps(props) {
    
            for (let prop in props) {
    
                this.__element__[prop] = props[prop];
            }
    
            return this;
        }
    
        getProp(prop) {
    
            return this.__element__[prop];
        }
    
        post(url = "", data = null, callback = null) {
    
            let response = new Promise((resolve, reject) => {
    
                let http = this.__http__;
                let form = null;
                
                if (data) {
    
                    form = new FormData();
                    for (let dt in data) form.append(dt, data[dt]);
                }
    
                http.addEventListener("load", () => resolve(http.response));
                http.open("POST", url);
                http.setRequestHeader('X-Requested-With', 'XMLHTTPRequest');
                http.send(form || "");
            });
    
            if (callback) {
    
                response.then((xhr) => callback(xhr));
            }
            else {
    
                return response;
            }
        }
    
        get(url = "", data = null, callback = null) {
    
            let response = new Promise((resolve, reject) => {
    
                let http = this.__http__;
                let query = [];
                
                if (data) {
    
                    for (let dt in data) query.push(`${dt}=${data[dt]}`);
                }
    
                http.addEventListener("load", () => resolve(http.response));
                http.open("GET", `${url}?${query.join("&")}`);
                http.send();
            });
    
            if (callback) {
    
                response.then((xhr) => callback(xhr));
            }
            else {
    
                return response;
            }
        }
    }
}
