=== Accessibility Enforcer ===
Contributors: n/a
Tags: accessibility, wcag, a11y, aria
Requires at least: 5.8
Tested up to: 6.6
Stable tag: 1.0.0

Automatically checks and fixes common accessibility issues on your WordPress site using a lightweight client-side enforcer.

== Description ==
Accessibility Enforcer scans the DOM, detects common a11y issues (missing alt text, unlabeled form inputs and buttons, skipped headings, missing lang attribute), and can auto-fix many of them on the fly. It also logs a concise report to the browser console.

This plugin wraps your existing `AccessibilityEnforcer` JavaScript into a WordPress plugin and auto-runs it on page load.

== Installation ==
1. Upload the `wp-accessibility-enforcer` folder to `/wp-content/plugins/` or upload the ZIP in the WordPress admin under Plugins → Add New → Upload Plugin.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Optional: Configure at Settings → Accessibility Enforcer (Enable, Auto-fix).
4. Visit your site and open the browser console to see the Accessibility report.

== Frequently Asked Questions ==
= Does this modify my content? =
No server-side data is changed. Fixes are applied in the browser at runtime.

= Can I disable auto-fixing or logging? =
In this initial version, it runs with `autoFix: true` and `logIssues: true`. If you prefer a different default, let us know and we can add a simple admin toggle.

== Changelog ==
= 1.0.0 =
- Initial release: enqueues script on the frontend and auto-runs after DOM ready.
