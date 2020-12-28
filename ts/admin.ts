import  { toggleTheme, loadTheme } from "./modules/theme.js";
import { Modal } from "./modules/modal.js";

loadTheme();
(document.getElementById('button-theme') as HTMLSpanElement).onclick = toggleTheme;

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
        if (el.classList.contains("focused")) {
            el.classList.toggle("focused");
            el.classList.toggle("unfocused");
        } else {
            el.classList.toggle("unfocused");
            el.classList.toggle("focused");
        }
        toggle.previousElementSibling.classList.toggle("rotated");
        toggle.previousElementSibling.classList.toggle("not-rotated");
    };
}

const checkInfUses = function (check: HTMLInputElement, mode = 2) {
    const uses = document.getElementById('inv-uses') as HTMLInputElement;
    if (mode == 2) {
        uses.disabled = check.checked;
        check.parentElement.classList.toggle('~neutral');
        check.parentElement.classList.toggle('~urge');
        check.parentElement.parentElement.nextElementSibling.classList.toggle('unfocused');
    } else if (mode == 1) {
        uses.disabled = true;
        check.checked = true;
        check.parentElement.classList.remove('~neutral');
        check.parentElement.classList.add('~urge');
        check.parentElement.parentElement.nextElementSibling.classList.remove('unfocused');
    } else {
        uses.disabled = false;
        check.checked = false;
        check.parentElement.classList.remove('~urge');
        check.parentElement.classList.add('~neutral');
        check.parentElement.parentElement.nextElementSibling.classList.add('unfocused');
    }
};

let invInfUses = document.getElementById('inv-inf-uses') as HTMLInputElement;
invInfUses.onclick = () => { checkInfUses(invInfUses, 2); };

const checkEmailEnabled = function (check: HTMLInputElement, mode = 2) {
    const input = document.getElementById('inv-email') as HTMLInputElement;
    if (mode == 2) {
        input.disabled = !check.checked;
        check.parentElement.classList.toggle('~neutral');
        check.parentElement.classList.toggle('~urge');
    } else if (mode == 1) {
        input.disabled = false;
        check.checked = true;
        check.parentElement.classList.remove('~neutral');
        check.parentElement.classList.add('~urge');
    } else {
        input.disabled = true;
        check.checked = false;
        check.parentElement.classList.remove('~urge');
        check.parentElement.classList.add('~neutral');
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
        const outerClickListener = (event: Event) => {
            if (!(event.target instanceof HTMLElement && (emailInput.contains(event.target) || editButton.contains(event.target)))) {
                emailInput.classList.toggle('stealth-input-hidden');
                emailInput.readOnly = !emailInput.readOnly;
                editButton.classList.toggle('ri-edit-line');
                editButton.classList.toggle('ri-check-line');
                document.removeEventListener('click', outerClickListener);
            }
        };
        editButton.onclick = function () {
            emailInput.classList.toggle('stealth-input-hidden');
            emailInput.readOnly = !emailInput.readOnly;
            editButton.classList.toggle('ri-edit-line');
            editButton.classList.toggle('ri-check-line');
            if (editButton.classList.contains('ri-check-line')) {
                document.addEventListener('click', outerClickListener);
            }
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
    profileSelect.classList.toggle('unfocused');
    userSelect.classList.toggle('unfocused');
}

const radioUseProfile = document.getElementById('radio-use-profile') as HTMLInputElement;
radioUseProfile.addEventListener("change", modifySettingsSource);
radioUseProfile.checked = true;
const radioUseUser = document.getElementById('radio-use-user') as HTMLInputElement;
radioUseUser.addEventListener("change", modifySettingsSource);
radioUseUser.checked = false;

const checkDeleteUserNotify = function () {
    if ((document.getElementById('delete-user-notify') as HTMLInputElement).checked) {
        document.getElementById('textarea-delete-user').classList.remove('unfocused');
    } else {
        document.getElementById('textarea-delete-user').classList.add('unfocused');
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
                tabButtonEl.classList.add("active", "~urge");
                tabEl.classList.remove("unfocused");
            } else {
                tabButtonEl.classList.remove("active");
                tabButtonEl.classList.remove("~urge");
                tabEl.classList.add("unfocused");
            }
        }
    }
}

window.modals = {} as Modals;

window.modals.login = new Modal(document.getElementById('modal-login'), true);
document.getElementById('form-login').addEventListener('submit', window.modals.login.close);
document.getElementById('modalButton').onclick = window.modals.login.toggle;

window.modals.addUser = new Modal(document.getElementById('modal-add-user'));
(document.getElementById('accounts-add-user') as HTMLSpanElement).onclick = window.modals.addUser.toggle;
document.getElementById('form-add-user').addEventListener('submit', window.modals.addUser.close);

window.modals.about = new Modal(document.getElementById('modal-about'));
(document.getElementById('setting-about') as HTMLSpanElement).onclick = window.modals.about.toggle;

window.modals.modifyUser = new Modal(document.getElementById('modal-modify-user'));
document.getElementById('form-modify-user').addEventListener('submit', window.modals.modifyUser.close);
(document.getElementById('accounts-modify-user') as HTMLSpanElement).onclick = window.modals.modifyUser.toggle;

window.modals.deleteUser = new Modal(document.getElementById('modal-delete-user'));
document.getElementById('form-delete-user').addEventListener('submit', window.modals.deleteUser.close);
(document.getElementById('accounts-delete-user') as HTMLSpanElement).onclick = window.modals.deleteUser.toggle;

window.modals.settingsRestart = new Modal(document.getElementById('modal-restart'));

window.modals.settingsRefresh = new Modal(document.getElementById('modal-refresh'));

window.modals.ombiDefaults = new Modal(document.getElementById('modal-ombi-defaults'));
document.getElementById('form-ombi-defaults').addEventListener('submit', window.modals.ombiDefaults.close);
