/**
 * User menu for notifications.
 *
 * @author Alexander Ebert
 * @copyright 2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module WoltLabSuite/Core/Ui/User/Menu/Data/Notification
 * @woltlabExcludeBundle tiny
 */
define(["require", "exports", "tslib", "../../../../Ajax", "../View", "../Manager"], function (require, exports, tslib_1, Ajax_1, View_1, Manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setup = void 0;
    View_1 = (0, tslib_1.__importDefault)(View_1);
    let originalFavicon = "";
    function setFaviconCounter(counter) {
        const favicon = document.querySelector('link[rel="shortcut icon"]');
        if (!favicon) {
            return;
        }
        if (!originalFavicon) {
            originalFavicon = favicon.href;
        }
        const text = Math.trunc(counter).toString();
        if (text === "0") {
            favicon.href = originalFavicon;
            return;
        }
        const img = document.createElement("img");
        img.src = originalFavicon;
        img.addEventListener("load", () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                drawCounter(ctx, text);
                favicon.href = canvas.toDataURL("image/png");
            }
        });
    }
    // This is a cut-down version of `Favico.js` v0.3.10 which is both unmaintained
    // since 2016 and quite bloated.
    //
    // Source: https://github.com/ejci/favico.js
    // Author: Miroslav Magda, http://blog.ejci.net
    // License: MIT or GPL-2.0
    function drawCounter(ctx, counter) {
        const size = ctx.canvas.width;
        let more = false;
        let x = 0.4 * size;
        const y = 0.4 * size;
        let width = 0.6 * size;
        const height = 0.6 * size;
        if (counter.length === 2) {
            x = x - width * 0.4;
            width = width * 1.4;
            more = true;
        }
        else if (counter.length >= 3) {
            x = x - width * 0.65;
            width = width * 1.65;
            more = true;
        }
        ctx.beginPath();
        ctx.fillStyle = "#d00";
        if (more) {
            ctx.moveTo(x + width / 2, y);
            ctx.lineTo(x + width - height / 2, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + height / 2);
            ctx.lineTo(x + width, y + height - height / 2);
            ctx.quadraticCurveTo(x + width, y + height, x + width - height / 2, y + height);
            ctx.lineTo(x + height / 2, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - height / 2);
            ctx.lineTo(x, y + height / 2);
            ctx.quadraticCurveTo(x, y, x + height / 2, y);
        }
        else {
            ctx.arc(x + width / 2, y + height / 2, height / 2, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.stroke();
        ctx.font = "bold " + Math.floor(height * (counter.length > 2 ? 0.85 : 1)).toString() + "px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        if (counter.length > 3) {
            ctx.fillText((counter.length > 4 ? 9 : Math.floor(+counter / 1000)).toString() + "k+", Math.floor(x + width / 2), Math.floor(y + height - height * 0.2));
        }
        else {
            ctx.fillText(counter, Math.floor(x + width / 2), Math.floor(y + height - height * 0.15));
        }
        ctx.closePath();
    }
    class UserMenuDataNotification {
        constructor(button, options) {
            this.counter = 0;
            this.stale = true;
            this.view = undefined;
            this.button = button;
            this.options = options;
            const badge = button.querySelector(".badge");
            if (badge) {
                const counter = parseInt(badge.textContent.trim());
                if (counter) {
                    setFaviconCounter(counter);
                    this.counter = counter;
                }
            }
            window.WCF.System.PushNotification.addCallback("userNotificationCount", (counter) => {
                this.updateCounter(counter);
                this.stale = true;
            });
        }
        getPanelButton() {
            return this.button;
        }
        getMenuButtons() {
            return [
                {
                    icon: '<span class="icon icon24 fa-cog"></span>',
                    link: this.options.settingsLink,
                    name: "settings",
                    title: this.options.settingsTitle,
                },
            ];
        }
        getIdentifier() {
            return "com.woltlab.wcf.notifications";
        }
        async getData() {
            const data = (await (0, Ajax_1.dboAction)("getNotificationData", "wcf\\data\\user\\notification\\UserNotificationAction").dispatch());
            const counter = data.filter((item) => item.isUnread).length;
            this.updateCounter(counter);
            this.stale = false;
            return data;
        }
        getFooter() {
            return {
                link: this.options.showAllLink,
                title: this.options.showAllTitle,
            };
        }
        getTitle() {
            return this.options.title;
        }
        getView() {
            if (this.view === undefined) {
                this.view = new View_1.default(this);
            }
            return this.view;
        }
        getEmptyViewMessage() {
            return this.options.noItems;
        }
        hasPlainTitle() {
            return false;
        }
        hasUnreadContent() {
            return this.counter > 0;
        }
        isStale() {
            if (this.stale) {
                return true;
            }
            const unreadItems = this.getView()
                .getItems()
                .filter((item) => item.dataset.isUnread === "true");
            if (this.counter !== unreadItems.length) {
                return true;
            }
            return false;
        }
        async markAsRead(objectId) {
            const response = (await (0, Ajax_1.dboAction)("markAsConfirmed", "wcf\\data\\user\\notification\\UserNotificationAction")
                .objectIds([objectId])
                .dispatch());
            this.updateCounter(response.totalCount);
        }
        async markAllAsRead() {
            await (0, Ajax_1.dboAction)("markAllAsConfirmed", "wcf\\data\\user\\notification\\UserNotificationAction").dispatch();
            this.updateCounter(0);
        }
        updateCounter(counter) {
            let badge = this.button.querySelector(".badge");
            if (badge === null && counter > 0) {
                badge = document.createElement("span");
                badge.classList.add("badge", "badgeUpdate");
                this.button.querySelector("a").append(badge);
            }
            if (badge) {
                if (counter === 0) {
                    badge.remove();
                }
                else {
                    badge.textContent = counter.toString();
                }
            }
            setFaviconCounter(counter);
            this.counter = counter;
        }
    }
    let isInitialized = false;
    function setup(options) {
        if (!isInitialized) {
            const button = document.getElementById("userNotifications");
            if (button !== null) {
                const provider = new UserMenuDataNotification(button, options);
                (0, Manager_1.registerProvider)(provider);
            }
            isInitialized = true;
        }
    }
    exports.setup = setup;
});