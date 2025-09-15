// ==UserScript==
// @name         TwitCasting Link Fix
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  サポートリストのアイコン・ユーザー名クリック時にプロフィールを表示せずにライブページを直接開く（以前の挙動に戻す）
// @match        https://twitcasting.tv/*
// @grant        none
// @icon         https://raw.githubusercontent.com/rie0924/TwitCasting-Link-Fix/main/twitcas_bigger_1.png
// @homepage     https://github.com/rie0924/TwitCasting-Link-Fix
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // アイコンやユーザー名をライブページへのリンクに変更
    function bindLiveLinks(parent = document) {
        parent.querySelectorAll('.tw-user-name-icon, .tw-supporter-user-name').forEach(a => {
            if (a.dataset.bound) return; // 二重バインド防止
            a.dataset.bound = 'true';
            a.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const href = a.getAttribute('href');
                if (!href) return;
                // 少し遅らせて新しいタブを開く（安定動作のため）
                setTimeout(() => window.open(href + '/live', '_blank'), 50);
            });
        });
    }

    // ページ読み込み時に初期バインド
    bindLiveLinks();

    // 動的に追加された要素にも対応
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) bindLiveLinks(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
