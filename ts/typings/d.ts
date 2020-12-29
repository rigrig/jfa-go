declare interface Modal {
    modal: HTMLElement;
    closeButton: HTMLSpanElement
    show: () => void;
    close: (event?: Event) => void;
    toggle: () => void;
}

interface ArrayConstructor {
    from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

declare interface Window {
    URLBase: string;
    modals: Modals;
    cssFile: string;
    availableProfiles: Array<any>;
    jfUsers: Array<Object>;
    notifications_enabled: boolean;
    token: string;
    buttonWidth: number;
    transitionEvent: string;
    animationEvent: string;
    tabs: Tabs
}

declare interface Tabs {
    tabs: Array<Tab>;
    addTab: (tabID: string, preFunc?: () => void, postFunc?: () => void) => void;
    switch: (tabID: string) => void;
}

declare interface Tab {
    tabID: string;
    tabEl: HTMLDivElement;
    buttonEl: HTMLSpanElement;
    preFunc?: () => void;
    postFunc?: () => void;
}


declare interface Modals {
    about: Modal;
    login: Modal;
    addUser: Modal;
    modifyUser: Modal;
    deleteUser: Modal;
    settingsRestart: Modal;
    settingsRefresh: Modal;
    ombiDefaults?: Modal;
    newAccountSuccess?: Modal;
}

interface Invite {
    code?: string;
    expiresIn?: string;
    empty: boolean;
    remainingUses?: string;
    email?: string;
    usedBy?: Array<Array<string>>;
    created?: string;
    notifyExpiry?: boolean;
    notifyCreation?: boolean;
    profile?: string;
}

declare var config: Object;
declare var modifiedConfig: Object;
