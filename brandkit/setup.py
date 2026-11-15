"""Idempotent site-side branding. Runs on install and every migrate. Every step is isolated so one
missing doctype/field on a different Frappe point release can't break the others."""
import frappe

from brandkit.config import get_company

LOGO = "/assets/brandkit/images/logo.svg"
FAVICON = "/assets/brandkit/images/favicon.svg"


def _try(label, fn):
	try:
		fn()
	except Exception:
		frappe.log_error(title=f"brandkit: {label}")


def apply():
	c = get_company()
	_try("website settings", lambda: website_settings(c))
	_try("navbar settings", lambda: navbar_settings(c))
	_try("desktop icons", lambda: desktop_icons(c))
	_try("email footer", lambda: email_footer(c))
	frappe.db.commit()
	frappe.clear_cache()


def _set(doctype, values):
	meta = frappe.get_meta(doctype)
	doc = frappe.get_doc(doctype)
	for k, v in values.items():
		if meta.has_field(k):
			doc.set(k, v)
	doc.flags.ignore_permissions = True
	doc.save()


def website_settings(c):
	_set("Website Settings", {
		"app_name": c["name"], "app_logo": LOGO, "favicon": FAVICON, "splash_image": LOGO,
		"footer_powered": "", "hide_footer_signup": 1, "copyright": c["legal"],
		"brand_html": f'<img src="{LOGO}" style="height:26px"> {c["name"]}',
	})


def navbar_settings(c):
	doc = frappe.get_doc("Navbar Settings")
	doc.app_logo = LOGO
	doc.set("help_dropdown", [])  # drops the docs/support/forum links
	doc.flags.ignore_permissions = True
	doc.save()


def desktop_icons(c):
	"""Relabel the stock ERP tile with the company name/logo; keep framework tiles admin-only."""
	if not frappe.db.exists("DocType", "Desktop Icon"):
		return
	for row in frappe.get_all("Desktop Icon", fields=["name", "label", "app", "icon_type", "parent_icon"]):
		if row.parent_icon:
			continue
		if row.app == "erpnext" or (row.label or "").lower() in ("erpnext",):
			frappe.db.set_value("Desktop Icon", row.name, {"label": c["name"], "logo_url": LOGO}, update_modified=False)
		elif row.app == "frappe" or (row.label or "").lower() in ("framework", "frappe"):
			doc = frappe.get_doc("Desktop Icon", row.name)
			if doc.meta.has_field("roles") and not doc.get("roles"):
				doc.append("roles", {"role": "System Manager"})
				doc.flags.ignore_permissions = True
				doc.save()


def email_footer(c):
	if frappe.get_meta("Email Account").has_field("footer"):
		for n in frappe.get_all("Email Account", pluck="name"):
			frappe.db.set_value("Email Account", n, "footer", c["legal"], update_modified=False)
