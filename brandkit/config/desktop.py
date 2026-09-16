from frappe import _


def get_data():
	return [
		{
			"module_name": "Brandkit",
			"category": "Modules",
			"label": _("Brandkit"),
			"color": "#2490EF",
			"icon": "octicon octicon-paintcan",
			"type": "module",
			"description": _("White-label branding and theme settings"),
		}
	]
