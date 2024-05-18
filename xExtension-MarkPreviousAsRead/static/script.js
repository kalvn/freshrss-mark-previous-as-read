'use strict';

(function(){
  const addButtonToEachUnprocessedEntry = function () {
    document.querySelectorAll('.flux footer > ul:not(.mark-previous-as-read-processed)').forEach(footerList => {
      // Create node
      let li = document.createElement('li');
      let a = document.createElement('a');
      let text = document.createTextNode('Mark all previous as read');
      let flux = footerList.closest('.flux');

      let fluxName = footerList.closest('.flux').querySelector('.websiteName')?.textContent;

      a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" fill-rule="nonzero"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z"/><path class="mark-previous-as-read-to-fill" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57c-.4 1.341-1.028 2.48-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.116 9.116 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.118 9.118 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z"/></g></svg>';
      a.appendChild(text);
      a.setAttribute('href', '#');
      a.addEventListener('click', (e) => {
        e.preventDefault();

        if (!confirm(`Are you sure to mark as read all above entries from ${fluxName ?? 'this feed'}?\nThis action cannot be undone.`)) {
          return;
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
    const idAsString = String(feedId);
    while (div) {
      if (div.dataset.feed === idAsString) {
        mark_read(div, true, true);
      }
      div = div.previousElementSibling;
    }
  };

  init();
})();
