from . import __version__ as app_version  # noqa: F401

app_name = "brandkit"
app_title = "Brandkit"
app_publisher = "Your Company"
app_description = "White-label branding and theme customization for Frappe/ERPNext"
app_email = "you@example.com"
app_license = "MIT"

# Only depends on the framework itself, not ERPNext — keeps it installable
# on any Frappe site.
required_apps = ["frappe"]

# Includes in every Desk page load
# ---------------------------------
app_include_css = "/assets/brandkit/css/brandkit.css"
app_include_js = "/assets/brandkit/js/brandkit.js"

# Also apply branding (logo/favicon/colors) on the public website, not just
# the Desk, since Website Settings gets synced by this app.
# web_include_css = "/assets/brandkit/css/brandkit.css"
# web_include_js = "/assets/brandkit/js/brandkit.js"

# Injects Brandkit Settings into frappe.boot on every session, so the
# client-side brandkit.js has the current branding/theme without an extra
# API call.
extend_bootinfo = "brandkit.brandkit.boot.boot_session"

# Fired whenever Brandkit Settings is saved — pushes the relevant fields
# into Website Settings so the public site matches the Desk.
doc_events = {
	"Brandkit Settings": {
		"on_update": "brandkit.brandkit.doctype.brandkit_settings.brandkit_settings.sync_to_website_settings"
	}
}

# Fixtures — data records exported as JSON and auto-imported by
# `bench migrate` / `bench --site x install-app brandkit`. The Workspace
# entry gives Brandkit its own page + shortcut in the v14/v15 sidebar,
# which desktop.py's older module-icon grid doesn't provide on its own.
fixtures = [
	{"doctype": "Workspace", "filters": [["module", "=", "Brandkit"]]}
]
