import { _get, _post, _delete, toClipboard } from "../modules/common.js";

export class DOMInvite implements Invite {
    
    // TODO
    updateNotify = () => {}; // SetNotify
    delete = () => {}; // deleteInvite
    
    private _code: string = "None";
    get code(): string { return this._code; }
    set code(code: string) {
        this._code = code;
        this._codeLink = window.location.href.split("#")[0] + "invite/" + code;
        const linkEl = this._codeArea.querySelector("a") as HTMLAnchorElement;
        linkEl.textContent = code.replace(/-/g, '-');
        linkEl.href = this._codeLink;
    }
    private _codeLink: string;

    private _expiresIn: string;
    get expiresIn(): string { return this._expiresIn }
    set expiresIn(expiry: string) {
        this._expiresIn = expiry;
        this._infoArea.querySelector("span.inv-expiry").textContent = expiry;
    }

    private _remainingUses: string = "1";
    get remainingUses(): string { return this._remainingUses; }
    set remainingUses(remaining: string) {
        this._remainingUses = remaining;
        this._middle.querySelector("strong.inv-remaining").textContent = remaining;
    }

    private _email: string = "";
    get email(): string { return this._email };
    set email(address: string) {
        this._email = address;
        const icon = this._infoArea.querySelector(".tooltip i");
        const chip = this._infoArea.querySelector(".tooltip span.inv-email-chip");
        const tooltip = this._infoArea.querySelector(".tooltip span.content") as HTMLSpanElement;
        if (address == "") {
            icon.classList.remove("ri-mail-line");
            icon.classList.remove("ri-mail-close-line");
            chip.classList.remove("~neutral");
            chip.classList.remove("~critical");
            chip.classList.remove("chip");
        } else {
            chip.classList.add("chip");
            if (address.includes("Failed to send to")) {
                icon.classList.remove("ri-mail-line");
                icon.classList.add("ri-mail-close-line");
                chip.classList.remove("~neutral");
                chip.classList.add("~critical");
            } else {
                address = "Sent to " + address;
                icon.classList.remove("ri-mail-close-line");
                icon.classList.add("ri-mail-line");
                chip.classList.remove("~critical");
                chip.classList.add("~neutral");
            }
        }
        tooltip.textContent = address;
    }

    private _usedBy: string[][];
    get usedBy(): string[][] { return this._usedBy; }
    set usedBy(uB: string[][]) {
        // ub[i][0]: username, ub[i][1]: date
        this._usedBy = uB;
        if (uB.length == 0) {
            this._right.classList.add("empty");
            this._userTable.innerHTML = `<p class="content">None yet!</p>`;
            return;
        }
        this._right.classList.remove("empty");
        let innerHTML = `
        <table class="table inv-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
        `;
        for (let user of uB) {
            innerHTML += `
                <tr>
                    <td>${user[0]}</td>
                    <td>${user[1]}</td>
                </tr>
            `;
        }
        innerHTML += `
            </tbody>
        </table>
        `;
        this._userTable.innerHTML = innerHTML;
    }

    private _created: string;
    get created(): string { return this._created; }
    set created(created: string) {
        this._created = created;
        this._middle.querySelector("strong.inv-created").textContent = created;
    }
    
    private _notifyExpiry: boolean = false;
    get notifyExpiry(): boolean { return this._notifyExpiry }
    set notifyExpiry(state: boolean) {
        this._notifyExpiry = state;
        (this._left.querySelector("input.inv-notify-expiry") as HTMLInputElement).checked = state;
    }

    private _notifyCreation: boolean = false;
    get notifyCreation(): boolean { return this._notifyCreation }
    set notifyCreation(state: boolean) {
        this._notifyCreation = state;
        (this._left.querySelector("input.inv-notify-creation") as HTMLInputElement).checked = state;
    }

    private _profile: string;
    get profile(): string { return this._profile; }
    set profile(profile: string) { this.loadProfiles(profile); }
    loadProfiles = (selected?: string) => {
        const select = this._left.querySelector("select") as HTMLSelectElement;
        let noProfile = false;
        if (selected === "") {
            noProfile = true; 
        } else {
            selected = selected || select.value;
        }
        let innerHTML = `<option value="noProfile" ${noProfile ? "selected" : ""}>No Profile</option>`;
        for (let profile of window.availableProfiles) {
            innerHTML += `<option value="${profile}" ${((profile == selected) && !noProfile) ? "selected" : ""}>${profile}</option>`;
        }
        select.innerHTML = innerHTML;
    };

    private _container: HTMLDivElement;

    private _header: HTMLDivElement;
    private _codeArea: HTMLDivElement;
    private _infoArea: HTMLDivElement;

    private _details: HTMLDivElement;
    private _left: HTMLDivElement;
    private _middle: HTMLDivElement;
    private _right: HTMLDivElement;
    private _userTable: HTMLDivElement;

    // whether the details card is expanded.
    get expanded(): boolean {
        return this._details.classList.contains("focused");
    }
    set expanded(state: boolean) {
        const toggle = (this._infoArea.querySelector("input.inv-toggle-details") as HTMLInputElement);
        if (state) {
            this._details.classList.remove("unfocused");
            this._details.classList.add("focused");
            toggle.previousElementSibling.classList.add("rotated");
            toggle.previousElementSibling.classList.remove("not-rotated");
        } else {
            this._details.classList.add("unfocused");
            this._details.classList.remove("focused");
            toggle.previousElementSibling.classList.remove("rotated");
            toggle.previousElementSibling.classList.add("not-rotated");
        }
    }

    constructor(invite: Invite) {
        // first create the invite structure, then use our setter methods to fill in the data.
        this._container = document.createElement('div') as HTMLDivElement;
        this._container.classList.add("inv");

        this._header = document.createElement('div') as HTMLDivElement;
        this._container.appendChild(this._header);
        this._header.classList.add("card", "~neutral", "!normal", "inv-header", "flex-expand", "mt-half");

        this._codeArea = document.createElement('div') as HTMLDivElement;
        this._header.appendChild(this._codeArea);
        this._codeArea.classList.add("inv-codearea");
        this._codeArea.innerHTML = `
        <a class="code monospace mr-1" href=""></a>
        <span class="button ~info !normal" title="Copy invite link"><i class="ri-file-copy-line"></i></span>
        `;
        (this._codeArea.querySelector("span.button") as HTMLSpanElement).onclick = () => { toClipboard(this._codeLink); };

        this._infoArea = document.createElement('div') as HTMLDivElement;
        this._header.appendChild(this._infoArea);
        this._infoArea.classList.add("inv-infoarea");
        this._infoArea.innerHTML = `
        <div class="tooltip left mr-1">
            <span class="inv-email-chip"><i></i></span>
            <span class="content sm"></span>
        </div>
        <span class="inv-expiry mr-1"></span>
        <span class="button ~critical !normal inv-delete">Delete</span>
        <label>
            <i class="icon ri-arrow-down-s-line not-rotated"></i>
            <input class="inv-toggle-details unfocused" type="checkbox">
        </label>
        `;
        
        (this._infoArea.querySelector(".inv-delete") as HTMLSpanElement).onclick = this.delete;

        const toggle = (this._infoArea.querySelector("input.inv-toggle-details") as HTMLInputElement);
        toggle.onchange = () => { this.expanded = !this.expanded; };

        this._details = document.createElement('div') as HTMLDivElement;
        this._container.appendChild(this._details);
        this._details.classList.add("card", "~neutral", "!normal", "mt-half", "inv-details");
        const detailsInner = document.createElement('div') as HTMLDivElement;
        this._details.appendChild(detailsInner);
        detailsInner.classList.add("inv-row", "flex-expand", "align-top");

        this._left = document.createElement('div') as HTMLDivElement;
        detailsInner.appendChild(this._left);
        this._left.classList.add("inv-profilearea");
        this._left.innerHTML = `
        <p class="supra mb-1 top">Profile</p>
        <div class="select ~neutral !normal inv-profileselect inline-block">
            <select>
                <option value="noProfile" selected>No Profile</option>
            </select>
        </div>
        <p class="label supra">Notify on:</p>
        <label class="switch block">
            <input class="inv-notify-expiry" type="checkbox">
            <span>On expiry</span>
        </label>
        <label class="switch block">
            <input class="inv-notify-creation" type="checkbox">
            <span>On user creation</span>
        </label>
        `;

        this._middle = document.createElement('div') as HTMLDivElement;
        detailsInner.appendChild(this._middle);
        this._middle.classList.add("block");
        this._middle.innerHTML = `
        <p class="supra mb-1 top">Created <strong class="inv-created"></strong></p>
        <p class="supra mb-1">Remaining uses <strong class="inv-remaining"></strong></p>
        `;

        this._right = document.createElement('div') as HTMLDivElement;
        detailsInner.appendChild(this._right);
        this._right.classList.add("card", "~neutral", "!low", "inv-created-users");
        this._right.innerHTML = `<strong class="supra table-header">Created users</strong>`;
        this._userTable = document.createElement('div') as HTMLDivElement;
        this._right.appendChild(this._userTable);


        this.expanded = false;
        this.update(invite);
    }

    update = (invite: Invite) => {
        this.code = invite.code;
        this.created = invite.created;
        this.email = invite.email;
        this.expiresIn = invite.expiresIn;
        this.notifyCreation = invite.notifyCreation;
        this.notifyExpiry = invite.notifyExpiry;
        this.profile = invite.profile;
        this.remainingUses = invite.remainingUses;
        this.usedBy = invite.usedBy;
    }

    asElement = (): HTMLDivElement => { return this._container; }

    remove = () => { this._container.remove(); }
}

// TODO:
// implement inviteList as a class
// inviteList has empty boolean value, set true adds an emptyInvite

export class inviteList implements inviteList {
    private _list: HTMLDivElement;
    private _empty: boolean;
    invites: { [code: string]: DOMInvite };

    constructor() {
        this._list = document.getElementById('invites') as HTMLDivElement;
        this.empty = true;
        this.invites = {};
    }

    get empty(): boolean { return this._empty; }
    set empty(state: boolean) {
        this._empty = state;
        if (state) {
            this.invites = {};
            this._list.classList.add("empty");
            this._list.innerHTML = `
            <div class="inv inv-empty">
                <div class="card ~neutral !normal inv-header flex-expand mt-half">
                    <div class="inv-codearea">
                        <span class="code monospace">None</span>
                    </div>
                </div>
            </div>
            `;
        } else {
            this._list.classList.remove("empty");
            if (this._list.querySelector(".inv-empty")) {
                this._list.textContent = '';
            }
        }
    }

    add = (invite: Invite) => {
        let domInv = new DOMInvite(invite);
        this.invites[invite.code] = domInv;
        if (this.empty) { this.empty = false; }
        this._list.appendChild(domInv.asElement());
    }

    reload = () => { _get("/invites", null, (req: XMLHttpRequest) => {
        if (req.readyState == 4) {
            let data = req.response;
            window.availableProfiles = data["profiles"];
            for (let code in this.invites) {
                this.invites[code].loadProfiles();
            }
            if (data["invites"] === undefined || data["invites"].length == 0) {
                this.empty = true;
                return;
            }
            // get a list of all current inv codes on dom
            // every time we find a match in resp, delete from list
            // at end delete all remaining in list from dom
            let invitesOnDOM: { [code: string]: boolean } = {};
            for (let code in this.invites) { invitesOnDOM[code] = true; }
            for (let inv of (data["invites"] as Array<any>)) {
                const invite = parseInvite(inv);
                if (invite.code in this.invites) {
                    this.invites[invite.code].update(invite);
                    delete invitesOnDOM[invite.code];
                } else {
                    this.add(invite);
                }
            }
            for (let code in invitesOnDOM) {
                this.invites[code].remove();
                delete this.invites[code];
            }
        }
    }) }
}
    

function parseInvite(invite: { [f: string]: string | number | string[][] | boolean }): Invite {
    let parsed: Invite = {};
    parsed.code = invite["code"] as string;
    parsed.email = invite["email"] as string || "";
    let time = "";
    const fields = ["days", "hours", "minutes"];
    for (let i = 0; i < fields.length; i++) {
        if (invite[fields[i]] != 0) {
            time += `${invite[fields[i]]}${fields[i][0]} `;
        }
    }
    parsed.expiresIn = `Expires in ${time.slice(0, -1)}`;
    parsed.remainingUses = invite["no-limit"] ? "∞" : String(invite["remaining-uses"])
    parsed.usedBy = invite["used-by"] as string[][] || [];
    parsed.created = invite["created"] as string || "Unknown";
    parsed.profile = invite["profile"] as string || "";
    parsed.notifyExpiry = invite["notify-expiry"] as boolean || false;
    parsed.notifyCreation = invite["notify-creation"] as boolean || false;
    return parsed;
}
    


/*
function addInvite(invite: Invite): void {
    const list = document.getElementById('invites') as HTMLDivElement;
    const container = document.createElement('div') as HTMLDivElement;
    container.classList.add("inv");
    container.id = "invite-" + invite.code;
    // invite header
    const header = document.createElement("div") as HTMLDivElement;
    (() => {
        header.classList.add("card", "~neutral", "!normal", "inv-header", "flex-expand", "mt-half");
        // code area (code, copy button, "sent to" message)
        const codeArea = document.createElement('div') as HTMLDivElement;
        (() => {
            codeArea.classList.add('inv-codearea');
            if (invite.empty) {
                codeArea.innerHTML = `
                <a class="code monospace">None</a>
                `;
                return;
            }
            const link = window.location.href.split("#")[0] + "invite/" + invite.code;
            let innerHTML = `
            <a class="code monospace mr-1" href="${link}">${invite.code.replace(/-/g, '-')}</a>
            <span class="button ~info !normal" title="Copy invite link"><i class="ri-file-copy-line"></i></span>
            `;
            if (invite.email) {
                let email = invite.email;
                if (!invite.email.includes("Failed to send to")) {
                    email = "Sent to " + email;
                }
                innerHTML += `
                <span class="support ml-1">${email}</span>
                `;
            }
            codeArea.innerHTML = innerHTML;
        })();
        header.appendChild(codeArea);

        // info area (expiry, delete, dropdown button)
        const infoArea = document.createElement('div') as HTMLDivElement;
        (() => {
            infoArea.classList.add("inv-infoarea");
            infoArea.innerHTML = `
            <span class="inv-expiry mr-1">${invite.expiresIn}</span>
            <span class="button ~critical !normal inv-delete">Delete</span>
            <label>
                <i class="icon ri-arrow-down-s-line not-rotated"></i>
                <input class="toggle-details
                `; /// LINE 70
        })();
            
    })();
    if (invite.empty) {
        container.appendChild(header);
        list.appendChild(container);
        return;
    }
}

*/
