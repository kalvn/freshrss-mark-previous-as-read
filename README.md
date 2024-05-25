# FreshRSS extension - Mark Previous as Read
This extension adds a button in the footer of each entry. Clicking this button will mark all previous entries as read.

The goal is, when going through a very long list of entries without reading them all, to be able to mark as read what was went through, and continue later.

## Installation
Download the code and copy directory `xExtension-MarkPreviousAsRead` into the `extensions/` directory of your FreshRSS installation.

Then, in the settings menu, select **Extensions** and enable **Mark Previous as Read**.

## Configuration
Head to `https://<your hostname>/i/?c=extension` and click on **Mark Previous as Read** settings icon.

- **Show a validation popup before marking entries as read**: shows an alert when the button is clicked, as a last chance to change your mind or cancel in case you mis-clicked.
- **Apply only to entries that belong to the same feed**: marks only entries that belong to the same feed as the one currently open as read.
