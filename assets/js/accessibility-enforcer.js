/**
 * Accessibility Rule Enforcer
 * 
 * A lightweight JavaScript class that scans the DOM for common accessibility
 * issues and can automatically fix many of them. Helps ensure WCAG 2.1
 * Level A and AA compliance.
 * 
 * @class AccessibilityEnforcer
 * @version 1.0.0
 * @license GPL-2.0-or-later
 * 
 * @example
 * // Basic usage with defaults
 * const enforcer = new AccessibilityEnforcer();
 * enforcer.enforce();
 * 
 * @example
 * // Custom configuration
 * const enforcer = new AccessibilityEnforcer({
 *   autoFix: false,
 *   logIssues: true,
 *   rules: ['images', 'forms', 'headings']
 * });
 * const issues = enforcer.enforce();
 * console.log(`Found ${issues.length} issues`);
 */
class AccessibilityEnforcer {
  /**
   * Creates a new AccessibilityEnforcer instance.
   * 
   * @param {Object} options - Configuration options
   * @param {boolean} [options.autoFix=true] - Automatically fix issues when possible
   * @param {boolean} [options.logIssues=true] - Log report to console
   * @param {string[]} [options.rules] - Array of rule names to check
   */
  constructor(options = {}) {
    this.options = {
      autoFix: options.autoFix ?? true,
      logIssues: options.logIssues ?? true,
      rules: options.rules ?? [
        'links',
        'images',
        'buttons',
        'forms',
        'headings',
        'lang',
        'color-contrast'
      ]
    };
    this.issues = [];
  }

  /**
   * Run all enabled accessibility checks.
   * 
   * Scans the DOM against configured rules, applies fixes if auto-fix is enabled,
   * and logs results if logging is enabled.
   * 
   * @returns {Array<Object>} Array of issue objects found
   * @public
   */
  enforce() {
    this.issues = [];
    
    if (this.options.rules.includes('links')) this.checkLinks();
    if (this.options.rules.includes('images')) this.checkImages();
    if (this.options.rules.includes('buttons')) this.checkButtons();
    if (this.options.rules.includes('forms')) this.checkForms();
    if (this.options.rules.includes('headings')) this.checkHeadings();
    if (this.options.rules.includes('lang')) this.checkLanguage();
    
    if (this.options.logIssues) {
      this.logReport();
    }
    
    return this.issues;
  }

  /**
   * Check links for accessible text.
   * 
   * Validates that all links have accessible names via visible text,
   * aria-label, aria-labelledby, or title attribute.
   * 
   * WCAG: 2.4.4 Link Purpose (In Context) - Level A
   * 
   * @private
   */
  checkLinks() {
    const links = document.querySelectorAll('a');
    
    links.forEach((link, idx) => {
      const hasText = link.textContent.trim().length > 0;
      const hasAriaLabel = link.getAttribute('aria-label');
      const hasAriaLabelledby = link.getAttribute('aria-labelledby');
      const hasTitle = link.getAttribute('title');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
        this.issues.push({
          type: 'link',
          severity: 'error',
          element: link,
          message: 'Link missing accessible text',
          wcag: '2.4.4 (Level A)'
        });
        
        if (this.options.autoFix) {
          const href = link.getAttribute('href') || '';
          const inferredText = this.inferLinkText(link, href);
          
          if (!hasTitle && inferredText) {
            link.setAttribute('aria-label', inferredText);
            this.issues[this.issues.length - 1].fixed = true;
            this.issues[this.issues.length - 1].fixApplied = `Added aria-label: "${inferredText}"`;
          }
        }
      }
    });
  }

  /**
   * Check images for alt text.
   * 
   * Ensures all images have alt attributes or are properly marked as decorative.
   * Detects missing alt and empty alt on meaningful images.
   * 
   * WCAG: 1.1.1 Non-text Content - Level A
   * 
   * @private
   */
  checkImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const hasAlt = img.hasAttribute('alt');
      const altText = img.getAttribute('alt');
      const hasAriaLabel = img.getAttribute('aria-label');
      const isDecorative = img.getAttribute('role') === 'presentation';
      
      if (!hasAlt && !hasAriaLabel && !isDecorative) {
        this.issues.push({
          type: 'image',
          severity: 'error',
          element: img,
          message: 'Image missing alt attribute',
          wcag: '1.1.1 (Level A)'
        });
        
        if (this.options.autoFix) {
          const inferredAlt = this.inferImageAlt(img);
          img.setAttribute('alt', inferredAlt);
          this.issues[this.issues.length - 1].fixed = true;
          this.issues[this.issues.length - 1].fixApplied = `Added alt: "${inferredAlt}"`;
        }
      } else if (hasAlt && altText.trim() === '' && !isDecorative) {
        const issue = {
          type: 'image',
          severity: 'warning',
          element: img,
          message: 'Image has empty alt text but not marked as decorative',
          wcag: '1.1.1 (Level A)'
        };

        if (this.options.autoFix) {
          const inferredAlt = this.inferImageAlt(img);
          img.setAttribute('alt', inferredAlt);
          issue.fixed = true;
          issue.fixApplied = `Added alt: "${inferredAlt}"`;
          issue.severity = 'warning';
          issue.message = 'Empty alt detected; added inferred alt text';
        }

        this.issues.push(issue);
      }
    });
  }

  /**
   * Check buttons for accessible text.
   * 
   * Validates that all button elements have accessible names through visible
   * text, aria-label, or aria-labelledby.
   * 
   * WCAG: 4.1.2 Name, Role, Value - Level A
   * 
   * @private
   */
  checkButtons() {
    const buttons = document.querySelectorAll('button, [role="button"]');
    
    buttons.forEach(btn => {
      const hasText = btn.textContent.trim().length > 0;
      const hasAriaLabel = btn.getAttribute('aria-label');
      const hasAriaLabelledby = btn.getAttribute('aria-labelledby');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
        this.issues.push({
          type: 'button',
          severity: 'error',
          element: btn,
          message: 'Button missing accessible text',
          wcag: '4.1.2 (Level A)'
        });
        
        if (this.options.autoFix) {
          const inferredText = this.inferButtonText(btn);
          btn.setAttribute('aria-label', inferredText);
          this.issues[this.issues.length - 1].fixed = true;
          this.issues[this.issues.length - 1].fixApplied = `Added aria-label: "${inferredText}"`;
        }
      }
    });
  }

  /**
   * Check form inputs for labels.
   * 
   * Ensures all form controls (input, select, textarea) have associated labels
   * or aria-label attributes.
   * 
   * WCAG: 3.3.2 Labels or Instructions - Level A
   * 
   * @private
   */
  checkForms() {
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label');
      const hasAriaLabelledby = input.getAttribute('aria-labelledby');
      const hasTitle = input.getAttribute('title');
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        this.issues.push({
          type: 'form-input',
          severity: 'error',
          element: input,
          message: 'Form input missing label',
          wcag: '3.3.2 (Level A)'
        });
        
        if (this.options.autoFix) {
          const inferredLabel = this.inferInputLabel(input);
          input.setAttribute('aria-label', inferredLabel);
          this.issues[this.issues.length - 1].fixed = true;
          this.issues[this.issues.length - 1].fixApplied = `Added aria-label: "${inferredLabel}"`;
        }
      }
    });
  }

  /**
   * Check heading hierarchy.
   * 
   * Validates that heading levels progress logically (h1, h2, h3) without
   * skipping levels. Issues warnings for skipped levels.
   * 
   * WCAG: 1.3.1 Info and Relationships - Level A
   * 
   * @private
   */
  checkHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let prevLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName[1]);
      
      if (prevLevel > 0 && level - prevLevel > 1) {
        this.issues.push({
          type: 'heading',
          severity: 'warning',
          element: heading,
          message: `Heading level skipped from H${prevLevel} to H${level}`,
          wcag: '1.3.1 (Level A)'
        });
      }
      
      prevLevel = level;
    });
  }

  /**
   * Check for lang attribute on HTML element.
   * 
   * Validates that the document's primary language is declared via the lang
   * attribute on the html element.
   * 
   * WCAG: 3.1.1 Language of Page - Level A
   * 
   * @private
   */
  checkLanguage() {
    const html = document.documentElement;
    const hasLang = html.hasAttribute('lang');
    
    if (!hasLang) {
      this.issues.push({
        type: 'language',
        severity: 'error',
        element: html,
        message: 'HTML element missing lang attribute',
        wcag: '3.1.1 (Level A)'
      });
      
      if (this.options.autoFix) {
        html.setAttribute('lang', 'en');
        this.issues[this.issues.length - 1].fixed = true;
        this.issues[this.issues.length - 1].fixApplied = 'Added lang="en"';
      }
    }
  }

  /**
   * Infer appropriate text for a link.
   * 
   * Uses various heuristics including checking for images, icons, and URL
   * patterns to generate meaningful link text.
   * 
   * @param {HTMLElement} link - The link element
   * @param {string} href - The href attribute value
   * @returns {string} Inferred link text
   * @private
   */
  inferLinkText(link, href) {
    // Check for image children
    const img = link.querySelector('img');
    if (img && img.alt) return img.alt;
    
    // Check for icon classes
    if (link.querySelector('[class*="icon"]')) {
      if (href.includes('twitter') || href.includes('x.com')) return 'Twitter';
      if (href.includes('facebook')) return 'Facebook';
      if (href.includes('linkedin')) return 'LinkedIn';
      if (href.includes('github')) return 'GitHub';
    }
    
    // Parse URL
    if (href) {
      try {
        const url = new URL(href, window.location.origin);
        const path = url.pathname.split('/').filter(p => p);
        if (path.length > 0) {
          return `Link to ${path[path.length - 1].replace(/-/g, ' ')}`;
        }
        return `Link to ${url.hostname}`;
      } catch {
        return 'Link';
      }
    }
    
    return 'Link';
  }

  /**
   * Infer appropriate alt text for an image.
   * 
   * Checks title attribute and filename to generate meaningful alt text.
   * 
   * @param {HTMLImageElement} img - The image element
   * @returns {string} Inferred alt text
   * @private
   */
  inferImageAlt(img) {
    const src = img.getAttribute('src') || '';
    const title = img.getAttribute('title');
    
    if (title) return title;
    
    // Extract filename
    const filename = src.split('/').pop().split('.')[0];
    return filename.replace(/[-_]/g, ' ') || 'Image';
  }

  /**
   * Infer appropriate text for a button.
   * 
   * Detects common button patterns (close, menu, search) to generate
   * meaningful button text.
   * 
   * @param {HTMLElement} btn - The button element
   * @returns {string} Inferred button text
   * @private
   */
  inferButtonText(btn) {
    // Check for common patterns
    if (btn.querySelector('[class*="close"]') || btn.querySelector('[class*="×"]')) {
      return 'Close';
    }
    if (btn.querySelector('[class*="menu"]') || btn.querySelector('[class*="hamburger"]')) {
      return 'Menu';
    }
    if (btn.querySelector('[class*="search"]')) {
      return 'Search';
    }
    
    return 'Button';
  }

  /**
   * Infer appropriate label for a form input.
   * 
   * Uses placeholder, name attribute, and input type to generate
   * meaningful labels.
   * 
   * @param {HTMLElement} input - The input element
   * @returns {string} Inferred label text
   * @private
   */
  inferInputLabel(input) {
    const type = input.getAttribute('type') || input.tagName.toLowerCase();
    const name = input.getAttribute('name') || '';
    const placeholder = input.getAttribute('placeholder');
    
    if (placeholder) return placeholder;
    if (name) return name.replace(/[-_]/g, ' ');
    
    const typeLabels = {
      'email': 'Email address',
      'password': 'Password',
      'text': 'Text input',
      'search': 'Search',
      'tel': 'Phone number',
      'url': 'URL',
      'number': 'Number',
      'date': 'Date',
      'textarea': 'Text area',
      'select': 'Select option'
    };
    
    return typeLabels[type] || 'Input field';
  }

  /**
   * Generate and log accessibility report to console.
   * 
   * Creates a formatted console output with grouped issues, showing counts,
   * severity, WCAG criteria, and applied fixes.
   * 
   * @private
   */
  logReport() {
    console.group('🔍 Accessibility Report');
    console.log(`Total issues found: ${this.issues.length}`);
    
    const errors = this.issues.filter(i => i.severity === 'error').length;
    const warnings = this.issues.filter(i => i.severity === 'warning').length;
    const fixed = this.issues.filter(i => i.fixed).length;
    
    console.log(`Errors: ${errors} | Warnings: ${warnings} | Auto-fixed: ${fixed}`);
    console.log('---');
    
    this.issues.forEach((issue, idx) => {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      const fixedIcon = issue.fixed ? '✅ FIXED' : '';
      
      console.group(`${icon} ${issue.type.toUpperCase()} ${fixedIcon}`);
      console.log(issue.message);
      console.log(`WCAG: ${issue.wcag}`);
      if (issue.fixApplied) console.log(`Fix: ${issue.fixApplied}`);
      console.log('Element:', issue.element);
      console.groupEnd();
    });
    
    console.groupEnd();
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityEnforcer;
}
