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
    $this->registerHook('js_vars', [$this, 'jsVars']);

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

  /**
   * @return array<string, string|array<string, string>>
   */
  public function jsVars(): array {
    return [
      'enable_warning_popup' => FreshRSS_Context::userConf()->attributeBool('enable_warning_popup'),
      'apply_only_to_same_feed_entries' => FreshRSS_Context::userConf()->attributeBool('apply_only_to_same_feed_entries'),
      'i18n' => [
        'markAllPreviousAsRead' => _t('ext.js.markAllPreviousAsRead'),
        'markedEntriesAsRead' => _t('ext.js.markedEntriesAsRead'),
        'warningSameFeed' => _t('ext.js.warningSameFeed'),
        'theSameFeed' => _t('ext.js.theSameFeed'),
        'warning' => _t('ext.js.warning')
      ]
    ];
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
