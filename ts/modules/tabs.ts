export class Tabs implements Tabs {
    tabs: Array<Tab>;
   
    constructor() {
        this.tabs = [];
    }

    addTab = (tabID: string, preFunc = () => void {}, postFunc = () => void {}) => {
        let tab = {} as Tab;
        tab.tabID = tabID;
        tab.tabEl = document.getElementById(tabID) as HTMLDivElement;
        tab.buttonEl = document.getElementById(tabID + "-button") as HTMLSpanElement;
        tab.buttonEl.onclick = () => { this.switch(tabID); };
        tab.preFunc = preFunc;
        tab.postFunc = postFunc;
        this.tabs.push(tab);
    }

    switch = (tabID: string) => {
        for (let t of this.tabs) {
            if (t.tabID == tabID) {
                t.buttonEl.classList.add("active", "~urge");
                if (t.preFunc) { t.preFunc(); }
                t.tabEl.classList.remove("unfocused");
                if (t.postFunc) { t.postFunc(); }
            } else {
                t.buttonEl.classList.remove("active");
                t.buttonEl.classList.remove("~urge");
                t.tabEl.classList.add("unfocused");
            }
        }
    }
}

