'use strict';

(function(){
  const iconArrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" /></svg>';
  const iconCheckSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>';

  const addButtonToEachUnprocessedEntry = function () {
    document.querySelectorAll('.flux footer > ul:not(.mark-previous-as-read-processed)').forEach(footerList => {
      // Create node
      let li = document.createElement('li');
      let a = document.createElement('a');
      let flux = footerList.closest('.flux');

      let fluxName = footerList.closest('.flux').querySelector('.websiteName')?.textContent;

      a.innerHTML = iconArrowSvg + context?.extensions?.markPreviousAsRead?.config?.markAllPreviousAsRead;
      a.setAttribute('href', '#');
      a.addEventListener('click', (e) => {
        console.log('clicked!');
        e.preventDefault();

        if (window.context?.extensions?.markPreviousAsRead?.config?.enableWarningPopup) {
          if (!confirm(`Are you sure to mark as read all above entries from ${fluxName ?? 'this feed'}?\nThis action cannot be undone.`)) {
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
    addButtonToEachUnprocessedEntry();

    // Add button to new entries when scrolling down and more content is loaded dynamically.
    document.addEventListener('freshrss:load-more', function () {
      addButtonToEachUnprocessedEntry();
    });
  };

  const markPreviousSameFeedAsRead = function (div, feedId) {
    let count = 0;
    const initialDivLink = div.querySelector('.mark-previous-as-read a');
    const idAsString = String(feedId);
    while (div) {
      if (window.context?.extensions?.markPreviousAsRead?.config?.applyToAllEntriesAbove) {
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

      initialDivLink.innerHTML = iconCheckSvg + context?.extensions?.markPreviousAsRead?.config?.markedEntriesAsRead.replace('{0}', count);

      // Reset link content after 2 seconds.
      setTimeout(function () {
        initialDivLink.innerHTML = iconArrowSvg + context?.extensions?.markPreviousAsRead?.config?.markAllPreviousAsRead;
      }, 2000);

      div = div.previousElementSibling;
    }
  };

  init();
})();
