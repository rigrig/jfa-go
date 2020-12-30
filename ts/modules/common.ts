declare var window: Window;

export function createEl(html: string): HTMLElement {
    let div = document.createElement('div') as HTMLDivElement;
    div.innerHTML = html;
    return div.firstElementChild as HTMLElement;
}

export function serializeForm(id: string): Object {
    const form = document.getElementById(id) as HTMLFormElement;
    let formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        const el = form.elements[i];
        if ((el as HTMLInputElement).type == "submit") {
            continue;
        }
        let name = (el as HTMLInputElement).name;
        if (!name) {
            name = el.id;
        }
        switch ((el as HTMLInputElement).type) {
            case "checkbox":
                formData[name] = (el as HTMLInputElement).checked;
                break;
            case "text":
            case "password":
            case "email":
            case "number":
                formData[name] = (el as HTMLInputElement).value;
                break;
            case "select-one":
            case "select":
                let val: string = (el as HTMLSelectElement).value.toString();
                if (!isNaN(val as any)) {
                    formData[name] = +val;
                } else {
                    formData[name] = val;
                }
                break;
        }
    }
    return formData;
}

export const rmAttr = (el: HTMLElement, attr: string): void => {
    if (el.classList.contains(attr)) {
        el.classList.remove(attr);
    }
};

export const addAttr = (el: HTMLElement, attr: string): void => el.classList.add(attr);
export const _get = (url: string, data: Object, onreadystatechange: (req: XMLHttpRequest) => void): void => {
    let req = new XMLHttpRequest();
    req.open("GET", window.URLBase + url, true);
    req.responseType = 'json';
    req.setRequestHeader("Authorization", "Bearer " + window.token);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.onreadystatechange = () => {
        if (req.status == 0) {
            window.notifications.connectionError();
            return;
        } else if (req.status == 401) {
            window.notifications.customError("401Error", "Unauthorized. Try logging back in.");
        }
        onreadystatechange(req);
    };
    req.send(JSON.stringify(data));
};

export const _post = (url: string, data: Object, onreadystatechange: (req: XMLHttpRequest) => void, response?: boolean): void => {
    let req = new XMLHttpRequest();
    req.open("POST", window.URLBase + url, true);
    if (response) {
        req.responseType = 'json';
    }
    req.setRequestHeader("Authorization", "Bearer " + window.token);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.onreadystatechange = () => {
        if (req.status == 0) {
            window.notifications.connectionError();
            return;
        } else if (req.status == 401) {
            window.notifications.customError("401Error", "Unauthorized. Try logging back in.");
        }
        onreadystatechange(req);
    };
    req.send(JSON.stringify(data));
};

export function _delete(url: string, data: Object, onreadystatechange: (req: XMLHttpRequest) => void): void {
    let req = new XMLHttpRequest();
    req.open("DELETE", window.URLBase + url, true);
    req.setRequestHeader("Authorization", "Bearer " + window.token);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.onreadystatechange = () => {
        if (req.status == 0) {
            window.notifications.connectionError();
            return;
        } else if (req.status == 401) {
            window.notifications.customError("401Error", "Unauthorized. Try logging back in.");
        }
        onreadystatechange(req);
    };
    req.send(JSON.stringify(data));
}

export function toClipboard (str: string) {
    const el = document.createElement('textarea') as HTMLTextAreaElement;
    el.value = str;
    el.readOnly = true;
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
}

export class notificationBox implements NotificationBox {
    private _box: HTMLDivElement;
    private _errorTypes: { [type: string]: boolean } = {};
    timeout: number;
    constructor(box: HTMLDivElement, timeout?: number) { this._box = box; this.timeout = timeout || 5; }

    private _error = (message: string): HTMLElement => {
        const noti = document.createElement('aside');
        noti.classList.add("aside", "~critical", "!normal", "mt-half", "notification-error");
        noti.innerHTML = `<strong>Error:</strong> ${message}`;
        const closeButton = document.createElement('span') as HTMLSpanElement;
        closeButton.classList.add("button", "~critical", "!low", "ml-1");
        closeButton.innerHTML = `<i class="icon ri-close-line"></i>`;
        closeButton.onclick = () => { this._box.removeChild(noti); };
        noti.appendChild(closeButton);
        return noti;
    }
    
    connectionError = () => { this.customError("connectionError", "Couldn't connect to jfa-go"); }

    customError = (type: string, message: string) => {
        this._errorTypes[type] = this._errorTypes[type] || false;
        const noti = this._error(message);
        noti.classList.add("error-" + type);
        const previousNoti: HTMLElement | undefined = this._box.querySelector("aside.error-" + type);
        if (this._errorTypes[type] && previousNoti !== undefined && previousNoti != null) {
            previousNoti.remove();
        }
        this._box.appendChild(noti);
        this._errorTypes[type] = true;
        setTimeout(() => { if (this._box.contains(noti)) { this._box.removeChild(noti); this._errorTypes[type] = false; } }, this.timeout*1000);
    }
}

export const whichAnimationEvent = () => {
    const el = document.createElement("fakeElement");
    if (el.style["animation"] !== void 0) {
        return "animationend";
    }
    return "webkitAnimationEnd";
}
