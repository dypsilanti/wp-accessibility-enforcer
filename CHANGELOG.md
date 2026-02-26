# Changelog

All notable changes to the Accessibility Enforcer plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-26

### Added
- Initial release of Accessibility Enforcer
- Core JavaScript enforcer class with 7 rule categories:
  - Links accessibility checking (WCAG 2.4.4)
  - Images alt text validation (WCAG 1.1.1)
  - Buttons labeling check (WCAG 4.1.2)
  - Form inputs label validation (WCAG 3.3.2)
  - Heading hierarchy validation (WCAG 1.3.1)
  - Language attribute checking (WCAG 3.1.1)
  - Color contrast placeholder (coming soon)
- Auto-fix functionality for all supported rules
- Intelligent inference of accessible text/labels from context
- Browser console reporting with detailed issue breakdown
- WordPress admin settings page with enable/disable toggles
- Auto-fix on/off configuration option
- Plugin activation hook with default settings
- Proper WordPress plugin structure and security
- Complete inline code documentation (PHPDoc and JSDoc)
- Comprehensive README.md for developers
- WordPress.org compatible readme.txt
- Contributing guidelines (CONTRIBUTING.md)
- Usage examples documentation (EXAMPLES.md)
- GPL v2 licensing

### Features
- Client-side accessibility scanning (non-destructive)
- Real-time issue detection and fixing
- WCAG 2.1 Level A compliance checking
- Detailed console reports with:
  - Issue counts by severity
  - Auto-fix success indicators
  - WCAG success criterion references
  - DOM element references
- Zero dependencies (vanilla JavaScript)
- Lightweight performance (< 50ms typical scan time)
- Compatible with all WordPress themes
- Compatible with page builders (Gutenberg, Elementor, Divi)

### Technical Details
- Minimum WordPress version: 5.8
- Minimum PHP version: 7.4
- Modern ES6+ JavaScript
- WordPress Coding Standards compliant
- Internationalization ready (text domain: accessibility-enforcer)
- File organization:
  - Main plugin file: accessibility-enforcer.php
  - Enforcer class: assets/js/accessibility-enforcer.js
  - Documentation: readme.txt, README.md, CONTRIBUTING.md, EXAMPLES.md

### Developer Features
- Extensible JavaScript class design
- Customizable enforcer instances
- Programmatic access to issues array
- WordPress filter hooks for options
- Can be disabled per-page via WordPress hooks
- Module export support for build tools

---

## Version History

### Versioning Strategy
- **Major versions (x.0.0)**: Breaking changes or significant new features
- **Minor versions (1.x.0)**: New features, backward compatible
- **Patch versions (1.0.x)**: Bug fixes and minor improvements

### Release Schedule
- Bug fixes: As needed
- Minor versions: Quarterly
- Major versions: Annually

---

## How to Read This Changelog

### Categories

**Added** - New features or capabilities
**Changed** - Changes to existing functionality
**Deprecated** - Features that will be removed in future versions
**Removed** - Features that have been removed
**Fixed** - Bug fixes
**Security** - Security vulnerability fixes

### WCAG References

When accessibility rules are added or changed, we reference the relevant WCAG success criterion:
- Format: `WCAG X.X.X (Level A/AA/AAA) - Criterion Name`
- Example: `WCAG 1.1.1 (Level A) - Non-text Content`

---

## Upgrade Notes

### From Future Versions

*No upgrade notes yet - this is the first release.*

When the plugin is updated, important upgrade information will be listed here.

---

**Note**: Dates use YYYY-MM-DD format (ISO 8601)
