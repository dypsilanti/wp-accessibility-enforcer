<?php
/**
 * Plugin Name: Accessibility Enforcer
 * Description: Automatically checks and fixes common accessibility issues across your site using a lightweight client-side enforcer.
 * Version: 1.0.0
 * Author: Accessibility Enforcer
 * Text Domain: accessibility-enforcer
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define constants
if (!defined('A11Y_ENFORCER_PATH')) {
    define('A11Y_ENFORCER_PATH', plugin_dir_path(__FILE__));
}
if (!defined('A11Y_ENFORCER_URL')) {
    define('A11Y_ENFORCER_URL', plugin_dir_url(__FILE__));
}

/**
 * Enqueue the Accessibility Enforcer script on the frontend
 */
function a11y_enforcer_enqueue() {
    $opts = a11y_enforcer_get_options();
    if (empty($opts['enabled'])) {
        return; // Disabled via settings
    }

    $script_rel_path = 'assets/js/accessibility-enforcer.js';
    $script_abs_path = A11Y_ENFORCER_PATH . $script_rel_path;
    $script_url = A11Y_ENFORCER_URL . $script_rel_path;

    $version = file_exists($script_abs_path) ? filemtime($script_abs_path) : '1.0.0';

    wp_register_script(
        'accessibility-enforcer',
        $script_url,
        array(),
        $version,
        true // in footer
    );

    wp_enqueue_script('accessibility-enforcer');

    // Auto-run the enforcer after DOM is ready with saved options
    $init_options = array(
        'autoFix' => !empty($opts['autoFix']),
        'logIssues' => true,
    );
    $init_js = 'document.addEventListener("DOMContentLoaded", function() {' .
        'try { if (typeof AccessibilityEnforcer === "function") {' .
        'var enforcer = new AccessibilityEnforcer(' . wp_json_encode($init_options) . ');' .
        'enforcer.enforce(); } } catch (e) { if (window.console) { console.warn("Accessibility Enforcer error:", e); } }' .
        '});';

    wp_add_inline_script('accessibility-enforcer', $init_js, 'after');
}
add_action('wp_enqueue_scripts', 'a11y_enforcer_enqueue');

/**
 * Defaults and options helpers (simple)
 */
function a11y_enforcer_default_options() {
    return array(
        'enabled' => true,
        'autoFix' => true,
    );
}

function a11y_enforcer_get_options() {
    $saved = get_option('a11y_enforcer_options');
    $defaults = a11y_enforcer_default_options();
    if (!is_array($saved)) {
        return $defaults;
    }
    return array_merge($defaults, $saved);
}

/**
 * Admin: one simple settings page with two checkboxes
 */
function a11y_enforcer_add_admin_menu() {
    add_options_page(
        __('Accessibility Enforcer', 'accessibility-enforcer'),
        __('Accessibility Enforcer', 'accessibility-enforcer'),
        'manage_options',
        'a11y-enforcer',
        'a11y_enforcer_render_settings_page'
    );
}
add_action('admin_menu', 'a11y_enforcer_add_admin_menu');

function a11y_enforcer_admin_init() {
    register_setting(
        'a11y_enforcer',
        'a11y_enforcer_options',
        array('type' => 'array', 'sanitize_callback' => 'a11y_enforcer_sanitize_options')
    );
}
add_action('admin_init', 'a11y_enforcer_admin_init');

function a11y_enforcer_sanitize_options($input) {
    return array(
        'enabled' => !empty($input['enabled']),
        'autoFix' => !empty($input['autoFix']),
    );
}

function a11y_enforcer_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $opts = a11y_enforcer_get_options();
    echo '<div class="wrap">';
    echo '<h1>' . esc_html__('Accessibility Enforcer', 'accessibility-enforcer') . '</h1>';
    echo '<form method="post" action="options.php">';
    settings_fields('a11y_enforcer');
    echo '<table class="form-table" role="presentation">';
    echo '<tr><th scope="row">' . esc_html__('Enable on frontend', 'accessibility-enforcer') . '</th><td>';
    echo '<label><input type="checkbox" name="a11y_enforcer_options[enabled]" value="1" ' . checked(!empty($opts['enabled']), true, false) . ' /> ' . esc_html__('Run on public pages', 'accessibility-enforcer') . '</label>';
    echo '</td></tr>';
    echo '<tr><th scope="row">' . esc_html__('Auto-fix issues', 'accessibility-enforcer') . '</th><td>';
    echo '<label><input type="checkbox" name="a11y_enforcer_options[autoFix]" value="1" ' . checked(!empty($opts['autoFix']), true, false) . ' /> ' . esc_html__('Attempt lightweight fixes (adds ARIA/alt)', 'accessibility-enforcer') . '</label>';
    echo '</td></tr>';
    echo '</table>';
    submit_button();
    echo '</form>';
    echo '</div>';
}

/**
 * Activation: set defaults once
 */
function a11y_enforcer_activate() {
    if (false === get_option('a11y_enforcer_options')) {
        add_option('a11y_enforcer_options', a11y_enforcer_default_options());
    }
}
register_activation_hook(__FILE__, 'a11y_enforcer_activate');
