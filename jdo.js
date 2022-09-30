/**
 * Esta obra está licenciada bajo la Licencia Creative Commons Atribución 4.0 Internacional. 
 * Para ver una copia de esta licencia, visite http://creativecommons.org/licenses/by/4.0/ 
 * o envíe una carta a Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 * libreria para operar con los elementos del documento
 * @version 1.0.0.9
 * @product jdo
 * @param {*} arg recibe una clase, id, elemento a buscar ó fragmento a elemento crear
 * @author Dairo Carrasquilla (cc) 2022
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

    	/**
		* Obtiene el elemento padre del elemento actual
		* @returns jdo
		*/
        father() {
    
            return jdo(this.__element__.parentElement);
        }
    
		/**
		* Obtiene el elemento hermando del elemento actual
		* se puede indicar el hermano siguiente con next o anterior con preview
		* @param {*} order next ó preview
		* @returns jdo
		*/
        brother(order = "next") {
    
            return (order == "next") ? jdo(this.__element__.nextElementSibling) : jdo(this.__element__.previousElementSibling);
        }
   
		/**
		* Verifica si el elemento a buscar existe o no en el DOM
		* @returns  false ó true
		*/
        exists() {
    
            if (this.__element__ == null) {
    
                return false;
            }
            else {
    
                return true;
            }
        }
    
		/**
		* Obtiene o establece un valor del elemento actual en el DOM
		* @param  {...any} arg recibe dos valores para los elementos tipo option y uno para los demas tipos de elementos
		* @returns jdo
		*/
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
    
		/**
		 * Seleccciona el texto en cuadro de un elemento tipo Select
		 * @returns string
		 */
        textSelected() {
    
            let text = String(this.__element__.options[this.__element__.selectedIndex].text);
    
            return text;
        }
    
		/**
		 * Agrega atributos a el elemento actual
		 * @param {*} arg recibe un objecto clave:valor con los atributos
		 * @returns jdo
		 */
        addAtt(arg) {
    
            if (typeof arg == "string") {

                this.__element__.setAttribute(arg, "");
                return this;
            }
            else if (arg == null) {

                return this;
            }

            for (let att in arg) {
    
                this.__element__.setAttribute(att, arg[att]);
            }
    
            return this;
        }
    
		/**
		 * Obtiene los atributos del elemenot actual
		 * @param {*} arg retorna un string
		 * @returns string
		 */
        getAtt(arg) {
    
            return this.__element__.getAttribute(arg);
        }
    
		/**
		 * remueve un atributo en el elemento actual
		 * @param {*} arg recibe el nombre del atributo
		 * @returns jdo
		 */
        rmAtt(arg) {
    
            if (this.__element__.hasAttribute(arg)) {
    
                this.__element__.removeAttribute(arg);
            }
    
            return this;
        }
    
		/**
		 * Agrega uno o varios elementos al elemento atual
		 * @param  {...any} arg recibe un array de elementos jdo
		 * @returns jdo
		 */
        add(...arg) {
    
            arg.forEach((item) => {
    
                this.__element__.appendChild(item.__me__());
            });
    
            return this;
        }
    
		/**
		 * Elimina uno ó varios elementos que estén dentro del elemento actual.
		 * @param  {...any} arg recibe como argumento un array de elementos jdo
		 * @returns jdo
		 */
        delete(...arg) {
    
            arg.forEach((item) => {
    
                this.__element__.removeChild(item.__me__());
            });
    
            return this;
        }
    
		/**
		 * Agrega una clase de estilos css al elemento actual
		 * @param  {...any} arg recibe como argumento un array con los nombres de las clases
		 * @returns jdo
		 */
        addClass(...arg) {
    
            this.__element__.classList.add(...arg);
    
            return this;
        }
    
		/**
		 * Remueve las clases que se le indiquen en el elemento actual
		 * @param  {...any} arg recibe como argumento un arraya con los nombres de las clases
		 * @returns jdo
		 */
        rmClass(...arg) {
    
            arg.forEach((item) => {
    
                if (this.__element__.classList.contains(item)) {
    
                    this.__element__.classList.remove(item);
                }
            });
    
            return this;
        }
    
		/**
		 * Establece los estilos css a un elemnto
		 * @param {*} arg recibe como argumento un ojecto clave:valor con los estilos css
		 * @returns jdo
		 */
        styles(arg) {

            if (typeof arg == "string") {

                return this.__element__.style[arg];
            }

            for (let props in arg) {
    
                this.__element__.style[props] = arg[props];
            }
    
            return this;
        }
    
		/**
		 * Limpia texto o valor de el elemto actual
		 * @returns jdo
		 */
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
    
		/**
		 * Borra el contenido del elemnto actual. como texo, valores o elementos dentro del elemento actual
		 * @returns jdo
		 */
        clear() {
    
            this.__element__.innerHTML = "";
    
            return this;
        }
    
		/**
		 * Establece un evento al elemento actual
		 * @param {*} tp tipo de evento; ejemplo. click, change, mousedom, keyup ...
		 * @param {*} callback funcion que se desencadena cuando se dispara el evento
		 * @returns jdo
		 */
        event(tp, callback) {
    
            this.__element__.addEventListener(tp, callback);
    
            return this;
        }
    
		/**
		 * Destruye el evento relacionado con el elemento actual
		 * @param {*} tp tipo de evento establecido al elemento
		 * @param {*} callback funcion establecida al evento
		 * @returns jdo
		 */
        destroyEvent(tp, callback) {
    
            this.__element__.removeEventListener(tp, callback);
    
            return this;
        }
    
        __me__() {
    
            return this.__element__;
        }
    
		/**
		 * Obtiene los elementos hijos del elemento actual, si no recibe argumento la funcion, esta devuelve
		 * todos los elementos hijos
		 * @param {*} arg recibe la posicion del elemento hijo comenzando desde el 1 ... N.
		 * @returns Array de jdo o un hijo jdo
		 */
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
    
		/**
		 * Devuelve el tipo del elemto actual, ej: H1, P, A, INPUT...
		 * @returns String
		 */
        getType() {
    
            return String(this.__element__.tagName);
        }
    
		/**
		 * Desencadena el evento click
		 * @returns jdo
		 */
        click() {
    
            this.__element__.click();
    
            return this;
        }
    
		/**
		 * Oculta el elemnto acual
		 * @returns jdo
		 */
        hide() {
    
            this.__element__.classList.add("hidden");
    
            return this;
        }
    
		/**
		 * Muestra al elemento actual si está oculto
		 * @returns jdo
		 */
        show() {
    
            this.__element__.classList.remove("hidden");
    
            return this;
        }
    
		/**
		 * Establece o devuelve el contenido del elemnto, en formato html o texto
		 * @param {*} arg recibe un string
		 * @returns jdo o node del contendio
		 */
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
    
		/**
		 * Establece propiedades del objecto html.
		 * @param {*} props Recibe objecto clave:valor
		 * @returns 
		 */
        setProps(props) {
    
            for (let prop in props) {
    
                this.__element__[prop] = props[prop];
            }
    
            return this;
        }
    
		/**
		 * Obtiene la propiedad del elemento actual
		 * @param {*} prop recibe el valor de la propiedad indicada
		 * @returns string
		 */
        getProp(prop) {
    
            return this.__element__[prop];
        }
    
		/**
		 * Peticion XMLHTTPRequest post.
		 * @param {*} url string del url de la petición
		 * @param {*} data objecto clave:valor de los datos a enviar
		 * @param {*} callback funcion que se ejecuta cuando la peticion recibida
		 * @returns respuesta XMLHTTPRequest
		 */
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
    
		/**
		 * Petición XMLHTTPRequest get.
		 * @param {*} url string url de la petición
		 * @param {*} data objecto clave:valor de los datos a enviar
		 * @param {*} callback funcion que se ejecuta al recibir la petición
		 * @returns respuesta XMLHTTPRequest
		 */
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
