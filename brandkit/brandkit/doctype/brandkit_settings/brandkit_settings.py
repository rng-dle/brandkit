import re

import frappe
from frappe.model.document import Document

HEX_COLOR_RE = re.compile(r"^#(?:[0-9a-fA-F]{3}){1,2}$")


class BrandkitSettings(Document):
	def validate(self):
		for fieldname in ("primary_color", "secondary_color"):
			value = self.get(fieldname)
			if value and not HEX_COLOR_RE.match(value):
				frappe.throw(
					f"{self.meta.get_label(fieldname)} must be a valid hex color, e.g. #2490EF"
				)


def sync_to_website_settings(doc, method=None):
	"""doc_events hook: on_update of Brandkit Settings.

	Pushes app name / logo / favicon into Website Settings so the public
	website matches whatever was configured for the Desk. Only touches
	fields that are actually set, and only writes if something changed
	(avoids an extra unnecessary save + version row on every Brandkit save).
	"""
	if not doc.sync_to_website_settings:
		return

	website_settings = frappe.get_single("Website Settings")
	changed = False

	if doc.app_name and website_settings.app_name != doc.app_name:
		website_settings.app_name = doc.app_name
		changed = True

	if doc.app_logo and website_settings.app_logo != doc.app_logo:
		website_settings.app_logo = doc.app_logo
		changed = True

	if doc.app_favicon and getattr(website_settings, "favicon", None) != doc.app_favicon:
		website_settings.favicon = doc.app_favicon
		changed = True

	if changed:
		website_settings.save(ignore_permissions=True)
