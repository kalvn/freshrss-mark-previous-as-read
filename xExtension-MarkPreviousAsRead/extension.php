<?php
declare(strict_types=1);

class MarkPreviousAsReadExtension extends Minz_Extension {
  #[\Override]
	public function init(): void {
    $this->registerTranslates();

    Minz_View::appendScript($this->getFileUrl('script.js', 'js'), false, true);
    Minz_View::appendStyle($this->getFileUrl('style.css', 'css'));

    $this->registerHook('js_vars', [$this, 'jsVars']);

    $save = false;

    if (is_null(FreshRSS_Context::userConf()->enable_warning_popup)) {
      FreshRSS_Context::userConf()->enable_warning_popup = true;
      $save = true;
    }

    if (is_null(FreshRSS_Context::userConf()->apply_to_all_entries_above)) {
      FreshRSS_Context::userConf()->apply_to_all_entries_above = false;
      $save = true;
    }

    if ($save) {
			FreshRSS_Context::userConf()->save();
		}
	}

  public function jsVars($vars) {
    $vars['markPreviousAsRead']['config'] = [
        'enableWarningPopup' => FreshRSS_Context::userConf()->enable_warning_popup,
        'applyToAllEntriesAbove' => FreshRSS_Context::userConf()->apply_to_all_entries_above,
        'markAllPreviousAsRead' => Minz_Translate::t('ext.js.markAllPreviousAsRead'),
        'markedEntriesAsRead' => Minz_Translate::t('ext.js.markedEntriesAsRead')
    ];

    return $vars;
  }

  #[\Override]
	public function handleConfigureAction(): void {
		$this->registerTranslates();

		if (Minz_Request::isPost()) {
			FreshRSS_Context::userConf()->enable_warning_popup = Minz_Request::paramString('enable-warning-popup') === '1' ? true : false;
			FreshRSS_Context::userConf()->apply_to_all_entries_above = Minz_Request::paramString('apply-to-all-entries-above') === '1' ? true : false;
			FreshRSS_Context::userConf()->save();
		}
	}
}
