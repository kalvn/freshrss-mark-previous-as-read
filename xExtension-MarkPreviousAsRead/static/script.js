'use strict';

(function(){
  const init = function () {
    document.querySelectorAll('.flux footer > ul').forEach(footerList => {
      // Create node
      let li = document.createElement('li');
      let a = document.createElement('a');
      let text = document.createTextNode('Mark all previous as read');
      let flux = footerList.closest('.flux');

      let fluxName = footerList.closest('.flux').querySelector('.item.website.full > .item-element > .websiteName').textContent;

      a.appendChild(text);
      a.setAttribute('href', '#');
      a.addEventListener('click', (e) => {
        e.preventDefault();

        if (!confirm(`Are you sure to mark as read all entries from "${fluxName}" above?\nThis action cannot be undone.`)) {
          return;
        }

        markPreviousSameFeedAsRead(flux, flux.dataset.feed);

        return false;
      });

      li.appendChild(a);
      li.classList.add('item');

      footerList.insertBefore(li, footerList.querySelector('.item.date'));
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
