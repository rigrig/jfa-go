interface Window {
    transitionEvent: string;
    animationEvent: string;
}

interface ArrayConstructor {
    from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

declare var window: Window;

const whichAnimationEvent = () => {
    const el = document.createElement("fakeElement");
    if (el.style["animation"] !== void 0) {
        return "animationend";
    }
    return "webkitAnimationEnd";
}
window.animationEvent = whichAnimationEvent();
const toggles: HTMLInputElement[] = Array.from(document.getElementsByClassName('toggle-details'));
for (let toggle of toggles) {
    toggle.onclick = () => {
        const el = toggle.parentElement.parentElement.parentElement.nextElementSibling as HTMLDivElement;
        if (el.classList.contains("visible")) {
            el.classList.toggle("visible");
            el.classList.toggle("hidden");
        } else {
            el.classList.toggle("hidden");
            el.classList.toggle("visible");
        }
        toggle.previousElementSibling.classList.toggle("rotated");
        toggle.previousElementSibling.classList.toggle("not-rotated");
    };
}

const checkInfUses = function (check: HTMLInputElement, mode = 2) {
    const uses = document.getElementById('inv-uses') as HTMLInputElement;
    if (mode == 2) {
        uses.disabled = check.checked;
        check.parentElement.classList.toggle('!normal');
        check.parentElement.classList.toggle('!high');
    } else if (mode == 1) {
        uses.disabled = true;
        check.checked = true;
        check.parentElement.classList.remove('!normal');
        check.parentElement.classList.add('!high');
    } else {
        uses.disabled = false;
        check.checked = false;
        check.parentElement.classList.remove('!high');
        check.parentElement.classList.add('!normal');
    }
};

let invInfUses = document.getElementById('inv-inf-uses') as HTMLInputElement;
invInfUses.onclick = () => { checkInfUses(invInfUses, 2); };

const checkEmailEnabled = function (check: HTMLInputElement, mode = 2) {
    const input = document.getElementById('inv-email') as HTMLInputElement;
    if (mode == 2) {
        input.disabled = !check.checked;
        check.parentElement.classList.toggle('!normal');
        check.parentElement.classList.toggle('!high');
    } else if (mode == 1) {
        input.disabled = false;
        check.checked = true;
        check.parentElement.classList.remove('!normal');
        check.parentElement.classList.add('!high');
    } else {
        input.disabled = true;
        check.checked = false;
        check.parentElement.classList.remove('!high');
        check.parentElement.classList.add('!normal');
    }
};
let invEmailEnabled = document.getElementById('inv-email-enabled') as HTMLInputElement;
invEmailEnabled.onchange = () => { checkEmailEnabled(invEmailEnabled, 2); };

checkInfUses(invInfUses, 0);
checkEmailEnabled(invEmailEnabled, 0);

const loadAccounts = function () {
    const rows: HTMLTableRowElement[] = Array.from(document.getElementById("accounts-list").children);
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const editButton = row.querySelector(".icon") as HTMLElement;
        const emailInput = row.querySelector(".input") as HTMLInputElement;
        editButton.onclick = function () {
            emailInput.classList.toggle('stealth-input-hidden');
            emailInput.readOnly = !emailInput.readOnly;
            editButton.classList.toggle('icon-edit');
            editButton.classList.toggle('icon-check');
        };
    }
};

loadAccounts();

const modifySettingsSource = function () {
    const profile = document.getElementById('radio-use-profile') as HTMLInputElement;
    const user = document.getElementById('radio-use-user') as HTMLInputElement;
    const profileSelect = document.getElementById('modify-user-profiles') as HTMLDivElement;
    const userSelect = document.getElementById('modify-user-users') as HTMLDivElement;
    (user.nextElementSibling as HTMLSpanElement).classList.toggle('!normal');
    (user.nextElementSibling as HTMLSpanElement).classList.toggle('!high');
    (profile.nextElementSibling as HTMLSpanElement).classList.toggle('!normal');
    (profile.nextElementSibling as HTMLSpanElement).classList.toggle('!high');
    profileSelect.classList.toggle('hidden');
    userSelect.classList.toggle('hidden');
}

const radioUseProfile = document.getElementById('radio-use-profile') as HTMLInputElement;
radioUseProfile.addEventListener("change", modifySettingsSource);
radioUseProfile.checked = true;
const radioUseUser = document.getElementById('radio-use-user') as HTMLInputElement;
radioUseUser.addEventListener("change", modifySettingsSource);
radioUseUser.checked = false;

const checkDeleteUserNotify = function () {
    if ((document.getElementById('delete-user-notify') as HTMLInputElement).checked) {
        document.getElementById('textarea-delete-user').classList.remove('hidden');
    } else {
        document.getElementById('textarea-delete-user').classList.add('hidden');
    }
};

(document.getElementById('delete-user-notify') as HTMLInputElement).onchange = checkDeleteUserNotify;
checkDeleteUserNotify();

const tabs = ["invitesTab", "accountsTab", "settingsTab"]
for (let tab of tabs) {
    (document.getElementById(`${tab}-button`) as HTMLSpanElement).onclick = function () {
        for (let t of tabs) {
            const tabEl = document.getElementById(t) as HTMLDivElement;
            const tabButtonEl = document.getElementById(`${t}-button`) as HTMLSpanElement;
            if (t == tab) {
                tabButtonEl.classList.add("active", "~positive");
                tabEl.classList.remove("unfocused");
            } else {
                tabButtonEl.classList.remove("active");
                tabButtonEl.classList.remove("~positive");
                tabEl.classList.add("unfocused");
            }
        }
    }
}

const modalLogin = new Modal(document.getElementById('modal-login'), true);
document.getElementById('form-login').addEventListener('submit', modalLogin.close);
document.getElementById('modalButton').onclick = modalLogin.toggle;

const modalAddUser = new Modal(document.getElementById('modal-add-user'));
(document.getElementById('accounts-add-user') as HTMLSpanElement).onclick = modalAddUser.toggle;
document.getElementById('form-add-user').addEventListener('submit', modalAddUser.close);

const modalAbout = new Modal(document.getElementById('modal-about'));
(document.getElementById('setting-about') as HTMLSpanElement).onclick = modalAbout.toggle;

const modalModifyUser = new Modal(document.getElementById('modal-modify-user'));
document.getElementById('form-modify-user').addEventListener('submit', modalModifyUser.close);
(document.getElementById('accounts-modify-user') as HTMLSpanElement).onclick = modalModifyUser.toggle;

const modalDeleteUser = new Modal(document.getElementById('modal-delete-user'));
document.getElementById('form-delete-user').addEventListener('submit', modalDeleteUser.close);
(document.getElementById('accounts-delete-user') as HTMLSpanElement).onclick = modalDeleteUser.toggle;

const modalRestart = new Modal(document.getElementById('modal-restart'));

const modalRefresh = new Modal(document.getElementById('modal-refresh'));

const modalOmbiDefaults = new Modal(document.getElementById('modal-ombi-defaults'));
document.getElementById('form-ombi-defaults').addEventListener('submit', modalOmbiDefaults.close);

