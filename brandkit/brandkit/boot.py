import frappe


def boot_session(bootinfo):
	"""Attach current branding/theme settings to frappe.boot so the client
	(public/js/brandkit.js) can apply them without an extra round trip."""
	settings = frappe.get_single("Brandkit Settings")

	bootinfo.brandkit_settings = {
		"app_name": settings.app_name,
		"app_logo": settings.app_logo,
		"app_favicon": settings.app_favicon,
		"primary_color": settings.primary_color or "#2490EF",
		"secondary_color": settings.secondary_color or "#F0F4F7",
		"powered_by_text": settings.powered_by_text,
		"custom_help_text": settings.custom_help_text,
		"custom_help_link": settings.custom_help_link,
		"show_update_popup": settings.show_update_popup,
		"update_popup_html": settings.update_popup_html,
	}
