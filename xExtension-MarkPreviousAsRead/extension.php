<?php
declare(strict_types=1);

class MarkPreviousAsReadExtension extends Minz_Extension {
  #[\Override]
  public function init(): void {
    $this->registerTranslates();

    Minz_View::appendScript($this->getFileUrl('script.js', 'js'), false, true, false);
    Minz_View::appendStyle($this->getFileUrl('style.css', 'css'));

    $this->registerHook('js_vars', [$this, 'jsVars']);

    $save = false;

    if (is_null(FreshRSS_Context::userConf()->enable_warning_popup)) {
      FreshRSS_Context::userConf()->enable_warning_popup = true;
      $save = true;
    }

    if (is_null(FreshRSS_Context::userConf()->apply_only_to_same_feed_entries)) {
      if (is_null(FreshRSS_Context::userConf()->apply_to_all_entries_above)) {
        FreshRSS_Context::userConf()->apply_only_to_same_feed_entries = false;
      } else {
        FreshRSS_Context::userConf()->apply_only_to_same_feed_entries = !FreshRSS_Context::userConf()->apply_to_all_entries_above;
      }

      $save = true;
    }

    if ($save) {
      FreshRSS_Context::userConf()->save();
    }
  }

  public function jsVars($vars) {
    $vars['markPreviousAsRead']['config'] = [
      'enableWarningPopup' => FreshRSS_Context::userConf()->enable_warning_popup,
      'applyOnlyToSameFeedEntries' => FreshRSS_Context::userConf()->apply_only_to_same_feed_entries,
      'markAllPreviousAsRead' => Minz_Translate::t('ext.js.markAllPreviousAsRead'),
      'markedEntriesAsRead' => Minz_Translate::t('ext.js.markedEntriesAsRead'),
      'warningSameFeed' => Minz_Translate::t('ext.js.warningSameFeed'),
      'theSameFeed' => Minz_Translate::t('ext.js.theSameFeed'),
      'warning' => Minz_Translate::t('ext.js.warning')
    ];

    return $vars;
  }

  #[\Override]
  public function handleConfigureAction(): void {
    $this->registerTranslates();

    if (Minz_Request::isPost()) {
      FreshRSS_Context::userConf()->enable_warning_popup = Minz_Request::paramString('enable-warning-popup') === '1' ? true : false;
      FreshRSS_Context::userConf()->apply_only_to_same_feed_entries = Minz_Request::paramString('apply-only-to-same-feed-entries') === '1' ? true : false;
      FreshRSS_Context::userConf()->save();
    }
  }
}
