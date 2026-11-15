frappe.ui.form.on("Brandkit Settings", {
	refresh(frm) {
		frm.trigger("preview_theme");
		frm.add_custom_button(__("Reset to Defaults"), () => {
			frappe.confirm(
				__("Reset Primary and Secondary colors to the stock defaults?"),
				() => {
					frm.set_value("primary_color", "#2490EF");
					frm.set_value("secondary_color", "#F0F4F7");
				}
			);
		});
	},

	primary_color(frm) {
		frm.trigger("preview_theme");
	},

	secondary_color(frm) {
		frm.trigger("preview_theme");
	},

	// Live-preview the chosen colors immediately in this browser tab, before
	// saving, so the admin can see the effect without a full page reload.
	// The real, persisted apply-to-everyone step happens via boot.py +
	// public/js/brandkit.js after save.
	preview_theme(frm) {
		const root = document.documentElement;
		if (frm.doc.primary_color) {
			root.style.setProperty("--brandkit-primary", frm.doc.primary_color);
			root.style.setProperty("--primary", frm.doc.primary_color);
			root.style.setProperty("--primary-color", frm.doc.primary_color);
		}
		if (frm.doc.secondary_color) {
			root.style.setProperty("--brandkit-secondary", frm.doc.secondary_color);
		}
	},
});
