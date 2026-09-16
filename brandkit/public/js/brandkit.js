frappe.provide("brandkit");

brandkit.apply = function () {
	const settings = frappe.boot && frappe.boot.brandkit_settings;
	if (!settings) return;

	brandkit.apply_theme(settings);
	brandkit.apply_branding(settings);
	brandkit.apply_help_menu(settings);
	brandkit.apply_update_popup(settings);
};

brandkit.apply_theme = function (settings) {
	const root = document.documentElement;
	if (settings.primary_color) {
		root.style.setProperty("--brandkit-primary", settings.primary_color);
		// Also override Frappe's own theme variables so built-in components
		// (buttons, links, indicators) pick up the color without needing
		// brandkit.css to fight every element individually.
		root.style.setProperty("--primary", settings.primary_color);
		root.style.setProperty("--primary-color", settings.primary_color);
	}
	if (settings.secondary_color) {
		root.style.setProperty("--brandkit-secondary", settings.secondary_color);
	}
};

brandkit.apply_branding = function (settings) {
	if (settings.app_name) {
		document.title = settings.app_name;
		$(".navbar-brand span, .navbar-brand .app-name").text(settings.app_name);
	}
	if (settings.app_logo) {
		$(".navbar-brand img, .app-logo, #app-logo").attr("src", settings.app_logo);
	}
	if (settings.app_favicon) {
		$('link[rel="shortcut icon"], link[rel="icon"]').attr("href", settings.app_favicon);
	}
	if (settings.powered_by_text) {
		const $footer = $(".powered-by-frappe, .text-muted.small.powered-by");
		if ($footer.length) {
			$footer.html(settings.powered_by_text);
		}
	}
};

brandkit.apply_help_menu = function (settings) {
	if (!settings.custom_help_text) return;

	// The Help dropdown is rendered after boot; give it a moment, then patch
	// in a custom entry if it isn't there already (idempotent, safe to call
	// more than once as routes change).
	setTimeout(() => {
		const $helpMenu = $(
			'.dropdown-help .dropdown-menu, [data-label="Help"] + .dropdown-menu, #navbar-help + .dropdown-menu'
		);
		if ($helpMenu.length && !$helpMenu.find(".brandkit-help-item").length) {
			$helpMenu.append(
				`<li><a class="dropdown-item brandkit-help-item" href="${frappe.utils.escape_html(
					settings.custom_help_link || "#"
				)}" target="_blank" rel="noopener">${frappe.utils.escape_html(
					settings.custom_help_text
				)}</a></li>`
			);
		}
	}, 1500);
};

brandkit.apply_update_popup = function (settings) {
	if (!settings.show_update_popup || !settings.update_popup_html) return;
	// Once per browser session, not once per page/route change.
	if (sessionStorage.getItem("brandkit_update_seen")) return;

	frappe.msgprint({
		title: settings.app_name || __("Update"),
		message: settings.update_popup_html,
		indicator: "blue",
	});
	sessionStorage.setItem("brandkit_update_seen", "1");
};

// Desk fires "app_ready" once boot data + the shell are in place.
$(document).on("app_ready", brandkit.apply);

// Safety net: if this script attaches after app_ready already fired
// (e.g. on a hard refresh where boot was cached), apply immediately too.
if (frappe.boot && frappe.boot.brandkit_settings) {
	brandkit.apply();
}
