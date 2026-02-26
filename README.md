# Accessibility Enforcer for WordPress

A lightweight WordPress plugin that automatically detects and fixes common accessibility issues in real-time using client-side JavaScript.

[![WordPress Plugin Version](https://img.shields.io/badge/WordPress-5.8%2B-blue)](https://wordpress.org/)
[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-purple)](https://php.net/)
[![License](https://img.shields.io/badge/License-GPLv2-green)](https://www.gnu.org/licenses/gpl-2.0.html)

## 🎯 Overview

**Accessibility Enforcer** helps WordPress sites meet WCAG 2.1 compliance by scanning pages for accessibility violations and optionally applying fixes automatically. All processing happens client-side, making it perfect for development, testing, and auditing without modifying your database.

## ✨ Features

- **🔍 Automatic Scanning** - Detects accessibility issues on every page load
- **🔧 Auto-Fix Capability** - Intelligently fixes common issues with ARIA attributes and alt text
- **📊 Console Reporting** - Detailed reports with WCAG success criteria references
- **⚡ Lightweight** - Minimal performance impact (~15KB minified)
- **🎨 Non-Destructive** - All fixes are client-side; database remains unchanged
- **🔌 Zero Configuration** - Works out of the box with sensible defaults

## 📋 What Gets Checked

| Rule | WCAG Criterion | Auto-Fix? | Description |
|------|----------------|-----------|-------------|
| **Links** | 2.4.4 (Level A) | ✅ Yes | Ensures links have accessible text via aria-label |
| **Images** | 1.1.1 (Level A) | ✅ Yes | Validates alt text and adds inferred alternatives |
| **Buttons** | 4.1.2 (Level A) | ✅ Yes | Checks button labeling and adds aria-label |
| **Forms** | 3.3.2 (Level A) | ✅ Yes | Ensures form inputs have proper labels |
| **Headings** | 1.3.1 (Level A) | ⚠️ Warning only | Validates heading hierarchy (h1-h6) |
| **Language** | 3.1.1 (Level A) | ✅ Yes | Checks for lang attribute on HTML element |

### Configuration

1. Navigate to **Settings → Accessibility Enforcer**
2. Enable the enforcer (checked by default)
3. Enable auto-fix to apply fixes automatically (recommended for development)
4. Save changes

### Viewing Reports

1. Visit any page on your site
2. Open browser Developer Console (F12)
3. Look for the `🔍 Accessibility Report` section

## 💻 Usage

### For End Users

Once activated, the plugin automatically scans every page. Check the browser console to see:

```
🔍 Accessibility Report
  Total issues found: 5
  Errors: 3 | Warnings: 2 | Auto-fixed: 3
  ---
  
  ❌ IMAGE ✅ FIXED
    Image missing alt attribute
    WCAG: 1.1.1 (Level A)
    Fix: Added alt: "hero banner"
    Element: <img src="...">
```

## 🏗️ Project Structure

```
wp-accessibility-enforcer/
├── accessibility-enforcer.php    # Main plugin file with WordPress integration
├── readme.txt                    # WordPress.org plugin repository readme
├── README.md                     # This file - developer documentation
└── assets/
    └── js/
        └── accessibility-enforcer.js  # Core enforcer JavaScript class
```

## 📚 Resources

### WCAG Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Techniques for WCAG 2.1](https://www.w3.org/WAI/WCAG21/Techniques/)

### Testing Tools
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### WordPress Accessibility
- [WordPress Accessibility Handbook](https://make.wordpress.org/accessibility/handbook/)
- [WordPress Coding Standards - Accessibility](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/)

## 📄 License

This plugin is licensed under the GNU General Public License v2.0 or later.

See [LICENSE](LICENSE) for full details.

## 💬 Support

- **Issues** - Report bugs or request features via GitHub Issues
- **WordPress Forums** - Get help from the community
- **Documentation** - Check this README and readme.txt
- 
---

**Note**: This plugin helps identify and demonstrate fixes for common accessibility issues. For comprehensive WCAG compliance, combine with manual testing, screen reader testing, and user feedback from people with disabilities.
