<?php
declare(strict_types=1);

/**
 * Available user config entries:
 * - enable-warning-popup
 * - apply-only-to-same-feed-entries
 */
class MarkPreviousAsReadExtension extends Minz_Extension {
  public function init(): void {
    $this->registerTranslates();

    Minz_View::appendScript($this->getFileUrl('script.js', 'js'), false, true, false);
    Minz_View::appendStyle($this->getFileUrl('style.css', 'css'));
    Minz_View::appendScript(strval(_url('markPreviousAsRead', 'jsVars')), false, true, false);

    $this->registerController('markPreviousAsRead');
    $this->registerViews();

    $save = false;

    if (is_null(FreshRSS_Context::userConf()->attributeBool('enable_warning_popup'))) {
      FreshRSS_Context::userConf()->_attribute('enable_warning_popup', true);
      $save = true;
    }

    if (is_null(FreshRSS_Context::userConf()->attributeBool('apply_only_to_same_feed_entries'))) {
      FreshRSS_Context::userConf()->_attribute('apply_only_to_same_feed_entries', false);
      $save = true;
    }

    if ($save) {
      FreshRSS_Context::userConf()->save();
    }
  }

  public function handleConfigureAction(): void {
    $this->registerTranslates();

    if (Minz_Request::isPost()) {
      FreshRSS_Context::userConf()->_attribute('enable_warning_popup', Minz_Request::paramString('enable-warning-popup') === '1' ? true : false);
      FreshRSS_Context::userConf()->_attribute('apply_only_to_same_feed_entries',Minz_Request::paramString('apply-only-to-same-feed-entries') === '1' ? true : false);
      FreshRSS_Context::userConf()->save();
    }
  }
}
