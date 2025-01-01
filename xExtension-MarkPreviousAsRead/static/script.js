'use strict';

(function(){
  const iconArrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" /></svg>';
  const iconCheckSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>';

  function getConfig (key) {
    return mark_previous_as_read_vars?.[key];
  }

  function t (key) {
    return getConfig('i18n')?.[key];
  }

  const addButtonToEachUnprocessedEntry = function () {
    document.querySelectorAll('.flux footer > ul:not(.mark-previous-as-read-processed)').forEach(footerList => {
      // Create node
      let li = document.createElement('li');
      let a = document.createElement('a');
      let flux = footerList.closest('.flux');

      let fluxName = footerList.closest('.flux').querySelector('.websiteName')?.textContent;

      a.innerHTML = iconArrowSvg + t('markAllPreviousAsRead');
      a.setAttribute('href', '#');
      a.addEventListener('click', (e) => {
        e.preventDefault();

        if (getConfig('enable_warning_popup')) {
          const warning = getConfig('apply_only_to_same_feed_entries')
            ? t('warningSameFeed').replace('{0}', fluxName ?? t('theSameFeed'))
            : t('warning')
          if (!confirm(warning)) {
            return;
          }
        }

        markPreviousSameFeedAsRead(flux, flux.dataset.feed);

        return false;
      });

      li.appendChild(a);
      li.classList.add('item', 'mark-previous-as-read');

      footerList.insertBefore(li, footerList.querySelector('.item.date'));
      footerList.classList.add('mark-previous-as-read-processed');
    });
  }

  const init = function () {
    setTimeout(function () {
      addButtonToEachUnprocessedEntry();

      // Add button to new entries when scrolling down and more content is loaded dynamically.
      document.addEventListener('freshrss:load-more', function () {
        addButtonToEachUnprocessedEntry();
      });
    }, 500);
  };

  const markPreviousSameFeedAsRead = function (div, feedId) {
    let count = 0;
    const initialDivLink = div.querySelector('.mark-previous-as-read a');
    const idAsString = String(feedId);
    while (div) {
      if (!getConfig('apply_only_to_same_feed_entries')) {
        if (Array.from(div.classList).includes('not_read')) {
          mark_read(div, true, true);
          count++;
        }
      } else {
        if (div.dataset.feed === idAsString) {
          if (Array.from(div.classList).includes('not_read')) {
            mark_read(div, true, true);
            count++;
          }
        }
      }

      initialDivLink.innerHTML = iconCheckSvg + t('markedEntriesAsRead').replace('{0}', count);

      // Reset link content after 2 seconds.
      setTimeout(function () {
        initialDivLink.innerHTML = iconArrowSvg + t('markAllPreviousAsRead');
      }, 2000);

      div = div.previousElementSibling;
    }
  };

  if (document.readyState && document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', async () => init(), false);
  }
})();
