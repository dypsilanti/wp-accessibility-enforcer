# How the Accessibility Enforcer Plugin Works

A detailed walkthrough of the plugin architecture and JavaScript concepts for learning purposes.

## 🎯 High-Level Overview

This plugin scans your WordPress website for accessibility issues (like images missing alt text) and can automatically fix them. The PHP handles WordPress integration, while the JavaScript does the actual scanning and fixing.

---

## 📚 Key JavaScript Concepts Used

### 1. Classes and Object-Oriented Programming

```javascript
class AccessibilityEnforcer {
  constructor(options = {}) {
    this.options = { /* ... */ };
    this.issues = [];
  }
}
```

**What's happening:**
- `class` creates a blueprint for objects
- `constructor` is a special method that runs when you create a new instance with `new AccessibilityEnforcer()`
- `this.options` and `this.issues` are **instance properties** - each enforcer object has its own copy
- `options = {}` is a **default parameter** - if no options are passed, it uses an empty object

### 2. Destructuring and Nullish Coalescing

```javascript
autoFix: options.autoFix ?? true
```

**What's happening:**
- The `??` operator checks if `options.autoFix` is `null` or `undefined`
- If it is, use `true` as the default value
- This is safer than `||` because it treats `false` as a valid value

### 3. Array Methods

```javascript
const fixed = this.issues.filter(i => i.fixed).length;
```

**What's happening:**
- `filter()` creates a new array with only items that pass the test
- `i => i.fixed` is an **arrow function** - a shorter way to write `function(i) { return i.fixed; }`
- It keeps only issues where `fixed` is `true`

---

## 🔄 How the Plugin Flow Works

### Step 1: WordPress Loads the JavaScript

In `accessibility-enforcer.php`, WordPress enqueues the JavaScript:

```php
wp_enqueue_script('accessibility-enforcer');
```

Then adds inline JavaScript that runs after the page loads:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var enforcer = new AccessibilityEnforcer({autoFix: true, logIssues: true});
  enforcer.enforce();
});
```

**JavaScript Concept:** The `DOMContentLoaded` event fires when the HTML is fully loaded and parsed. This ensures the page is ready before we start scanning it.

---

### Step 2: Creating the Enforcer Instance

When `new AccessibilityEnforcer({autoFix: true})` runs:

1. The constructor is called
2. It sets up default options
3. Creates an empty `issues` array to store problems found

---

### Step 3: Running the Checks

The `enforce()` method coordinates everything:

```javascript
enforce() {
  this.issues = [];
  
  if (this.options.rules.includes('links')) this.checkLinks();
  if (this.options.rules.includes('images')) this.checkImages();
  // ... more checks
  
  if (this.options.logIssues) {
    this.logReport();
  }
  
  return this.issues;
}
```

**JavaScript Concepts:**
- `this.checkLinks()` calls another method on the same object
- `includes()` checks if an array contains a value
- The method `return`s the issues array so other code can use it

---

### Step 4: Checking Images (Detailed Example)

Let's dive deep into `checkImages()`:

```javascript
checkImages() {
  // 1. Find all images on the page
  const images = document.querySelectorAll('img');
  
  // 2. Check each image
  images.forEach(img => {
    const hasAlt = img.hasAttribute('alt');
    const altText = img.getAttribute('alt');
    
    // 3. If missing alt attribute
    if (!hasAlt && !hasAriaLabel && !isDecorative) {
      // 4. Record the issue
      this.issues.push({
        type: 'image',
        severity: 'error',
        element: img,
        message: 'Image missing alt attribute',
        wcag: '1.1.1 (Level A)'
      });
      
      // 5. Try to fix it automatically
      if (this.options.autoFix) {
        const inferredAlt = this.inferImageAlt(img);
        img.setAttribute('alt', inferredAlt);
        this.issues[this.issues.length - 1].fixed = true;
      }
    }
  });
}
```

**JavaScript Concepts Explained:**

#### `querySelectorAll()`
Returns a NodeList of all elements matching the CSS selector
```javascript
const images = document.querySelectorAll('img'); // Gets all <img> elements
```

#### `forEach()`
Loops through each item in the array/NodeList
```javascript
images.forEach(img => {
  // 'img' is each individual image element
});
```

#### `hasAttribute()` and `getAttribute()`
```javascript
img.hasAttribute('alt')     // Returns true/false
img.getAttribute('alt')     // Returns the value (or null)
```

#### `this.issues.push()`
Adds a new object to the issues array
```javascript
this.issues.push({
  type: 'image',
  severity: 'error',
  // ... more properties
});
```

#### Array indexing
```javascript
this.issues[this.issues.length - 1]  // Gets the last item we just added
```

---

### Step 5: Inferring Alt Text

The `inferImageAlt()` method tries to generate meaningful alt text:

```javascript
inferImageAlt(img) {
  const src = img.getAttribute('src') || '';
  const title = img.getAttribute('title');
  
  if (title) return title;
  
  // Extract filename from path
  const filename = src.split('/').pop().split('.')[0];
  return filename.replace(/[-_]/g, ' ') || 'Image';
}
```

**JavaScript Concepts:**

#### `||` operator for defaults
If `src` is falsy, use empty string
```javascript
const src = img.getAttribute('src') || '';
```

#### Method chaining
```javascript
src.split('/').pop().split('.')[0]
```
Let's break this down with an example:
- `src` = `"https://example.com/images/sunset-beach.jpg"`
- `.split('/')` = `["https:", "", "example.com", "images", "sunset-beach.jpg"]`
- `.pop()` = `"sunset-beach.jpg"` (gets last item)
- `.split('.')` = `["sunset-beach", "jpg"]`
- `[0]` = `"sunset-beach"` (gets first item)

#### Regular expressions
```javascript
filename.replace(/[-_]/g, ' ')
```
- `/[-_]/` matches hyphens or underscores
- `g` flag means "global" (replace all, not just first)
- Turns `"sunset-beach"` into `"sunset beach"`

---

### Step 6: Checking Links

The `checkLinks()` method is interesting:

```javascript
checkLinks() {
  const links = document.querySelectorAll('a');
  
  links.forEach((link, idx) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
      // Problem found!
      this.issues.push({ /* ... */ });
      
      if (this.options.autoFix) {
        const href = link.getAttribute('href') || '';
        const inferredText = this.inferLinkText(link, href);
        link.setAttribute('aria-label', inferredText);
      }
    }
  });
}
```

**JavaScript Concepts:**

#### `textContent`
Gets all text inside an element
```javascript
link.textContent  // "Click here" if link contains that text
```

#### `trim()`
Removes whitespace from start and end
```javascript
"  hello  ".trim()  // Returns "hello"
```

#### Logical operators
```javascript
if (!hasText && !hasAriaLabel && !hasAriaLabelledby)
```
All three conditions must be true (link has no text AND no aria-label AND no aria-labelledby)

---

### Step 7: Smart Link Text Inference

The `inferLinkText()` method is clever:

```javascript
inferLinkText(link, href) {
  // Check for images inside the link
  const img = link.querySelector('img');
  if (img && img.alt) return img.alt;
  
  // Check for social media icons
  if (link.querySelector('[class*="icon"]')) {
    if (href.includes('twitter')) return 'Twitter';
    if (href.includes('facebook')) return 'Facebook';
  }
  
  // Parse the URL
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
```

**JavaScript Concepts:**

#### `querySelector()` vs `querySelectorAll()`
- `querySelector()` returns the FIRST match (or null)
- `querySelectorAll()` returns ALL matches as a NodeList

#### Attribute selectors with wildcards
```javascript
'[class*="icon"]'  // Matches any element where class contains "icon"
```

#### `includes()`
Checks if a string contains a substring
```javascript
href.includes('twitter')  // true if 'twitter' is anywhere in href
```

#### `try...catch`
Error handling
```javascript
try {
  const url = new URL(href);  // This might fail
} catch {
  return 'Link';  // If it fails, return default
}
```

#### `filter()` with arrow function
```javascript
path.split('/').filter(p => p)
```
This removes empty strings from the array. For example:
- `"/blog/posts/"` → `["", "blog", "posts", ""]`
- After filter → `["blog", "posts"]`

---

### Step 8: Logging the Report

Finally, `logReport()` displays results in the browser console:

```javascript
logReport() {
  console.group('🔍 Accessibility Report');
  console.log(`Total issues found: ${this.issues.length}`);
  
  const errors = this.issues.filter(i => i.severity === 'error').length;
  const warnings = this.issues.filter(i => i.severity === 'warning').length;
  const fixed = this.issues.filter(i => i.fixed).length;
  
  this.issues.forEach((issue, idx) => {
    const icon = issue.severity === 'error' ? '❌' : '⚠️';
    const fixedIcon = issue.fixed ? '✅ FIXED' : '';
    
    console.group(`${icon} ${issue.type.toUpperCase()} ${fixedIcon}`);
    console.log(issue.message);
    console.log('Element:', issue.element);
    console.groupEnd();
  });
  
  console.groupEnd();
}
```

**JavaScript Concepts:**

#### Template literals (backticks)
```javascript
`Total issues found: ${this.issues.length}`
```
- Use backticks instead of quotes
- `${}` inserts JavaScript values into the string

#### Ternary operator
```javascript
const icon = issue.severity === 'error' ? '❌' : '⚠️';
```
This is shorthand for:
```javascript
let icon;
if (issue.severity === 'error') {
  icon = '❌';
} else {
  icon = '⚠️';
}
```

#### `console.group()` and `console.groupEnd()`
Creates collapsible sections in the browser console for better organization.

---

## 🎓 Key JavaScript Patterns to Learn From This Code

### 1. Method Chaining
```javascript
src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ')
```
Each method returns a value that the next method can work with.

### 2. Early Returns
```javascript
if (title) return title;  // Exit early if we have a title
// Continue with more complex logic...
```
Makes code cleaner by handling simple cases first.

### 3. Defensive Programming
```javascript
const src = img.getAttribute('src') || '';  // Always have a value
```
Prevents errors when values might be null/undefined.

### 4. Separation of Concerns
- `enforce()` coordinates
- Individual `check*()` methods handle specific checks
- `infer*()` methods handle text generation
- `logReport()` handles output

### 5. Configuration Objects
```javascript
constructor(options = {}) {
  this.options = {
    autoFix: options.autoFix ?? true,
    // ...
  };
}
```
Makes the class flexible and customizable.

---

## 🔍 Try This Yourself

Open your browser console on any webpage and run:

```javascript
const enforcer = new AccessibilityEnforcer({
  autoFix: false,  // Don't fix, just report
  logIssues: true
});
enforcer.enforce();
```

You'll see all accessibility issues on that page!

---

## 📊 Complete Flow Diagram

```
User loads WordPress page
         ↓
PHP enqueues JavaScript file
         ↓
DOMContentLoaded event fires
         ↓
new AccessibilityEnforcer() created
         ↓
enforcer.enforce() called
         ↓
    ┌────┴────┐
    ↓         ↓
checkLinks() checkImages() (and other checks run in parallel)
    ↓         ↓
    └────┬────┘
         ↓
Issues array populated with problems found
         ↓
Auto-fix applied (if enabled)
         ↓
logReport() displays results in console
         ↓
User sees accessibility report
```

---

## 🧩 Code Architecture

### Main Class: `AccessibilityEnforcer`

**Properties:**
- `this.options` - Configuration object
- `this.issues` - Array of found issues

**Public Methods:**
- `enforce()` - Main entry point, runs all checks

**Private Methods (Checking):**
- `checkLinks()` - Validates link accessibility
- `checkImages()` - Validates image alt text
- `checkButtons()` - Validates button labels
- `checkForms()` - Validates form input labels
- `checkHeadings()` - Validates heading hierarchy
- `checkLanguage()` - Validates lang attribute

**Private Methods (Inference):**
- `inferLinkText()` - Generates appropriate link text
- `inferImageAlt()` - Generates appropriate alt text
- `inferButtonText()` - Generates appropriate button text
- `inferInputLabel()` - Generates appropriate form labels

**Private Methods (Reporting):**
- `logReport()` - Outputs formatted console report

---

## 💡 Learning Resources

To deepen your understanding of the JavaScript concepts used in this plugin:

1. **Classes & OOP**: [MDN - Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
2. **Array Methods**: [MDN - Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
3. **DOM Manipulation**: [MDN - Document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
4. **Arrow Functions**: [MDN - Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
5. **Template Literals**: [MDN - Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
6. **Regular Expressions**: [MDN - RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

---

## 🔧 Extending the Plugin

Want to add your own accessibility check? Here's the pattern:

```javascript
checkCustomRule() {
  // 1. Select elements to check
  const elements = document.querySelectorAll('selector');
  
  // 2. Loop through each element
  elements.forEach(element => {
    // 3. Check for the issue
    const hasIssue = /* your condition */;
    
    if (hasIssue) {
      // 4. Record the issue
      this.issues.push({
        type: 'custom-rule',
        severity: 'error',
        element: element,
        message: 'Description of the problem',
        wcag: 'WCAG criterion reference'
      });
      
      // 5. Auto-fix (optional)
      if (this.options.autoFix) {
        // Apply your fix
        element.setAttribute('something', 'value');
        this.issues[this.issues.length - 1].fixed = true;
      }
    }
  });
}
```

Then add it to the `enforce()` method:

```javascript
if (this.options.rules.includes('custom-rule')) this.checkCustomRule();
```

---

Created: February 27, 2026
