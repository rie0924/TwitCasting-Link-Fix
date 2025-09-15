// ==UserScript==
// @name         TwitCasting Link Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  サポートリストのアイコン・ユーザー名クリックでプロフィールを表示せずに配信ページを新タブで開く(以前の挙動に戻す)
// @match        https://twitcasting.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ライブリンク化
    function bindLiveLinks(parent = document) {
        parent.querySelectorAll('.tw-user-name-icon, .tw-supporter-user-name').forEach(a => {
            if (a.dataset.bound) return; // 二重バインド防止
            a.dataset.bound = 'true';
            a.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const href = a.getAttribute('href');
                if (!href) return;
                // 微小遅延で確実に新タブを開く
                setTimeout(() => window.open(href + '/live', '_blank'), 50);
            });
        });
    }

    // 初期バインド
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
