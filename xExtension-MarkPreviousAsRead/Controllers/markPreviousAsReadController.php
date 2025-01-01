<?php

class FreshExtension_markPreviousAsRead_Controller extends Minz_ActionController
{
  /** @var MarkPreviousAsRead\View */
  protected $view;

  public function jsVarsAction(): void
  {
    $vars = json_encode([
      'enable_warning_popup' => FreshRSS_Context::userConf()->attributeBool('enable_warning_popup'),
      'apply_only_to_same_feed_entries' => FreshRSS_Context::userConf()->attributeBool('apply_only_to_same_feed_entries'),
      'i18n' => [
        'markAllPreviousAsRead' => _t('ext.js.markAllPreviousAsRead'),
        'markedEntriesAsRead' => _t('ext.js.markedEntriesAsRead'),
        'warningSameFeed' => _t('ext.js.warningSameFeed'),
        'theSameFeed' => _t('ext.js.theSameFeed'),
        'warning' => _t('ext.js.warning')
      ]
    ]);

    $this->view->mark_previous_as_read_vars = $vars !== false ? $vars : '';

    $this->view->_layout(null);
    $this->view->_path('markPreviousAsRead/vars.js');

    header('Content-Type: application/javascript; charset=utf-8');
  }
}
