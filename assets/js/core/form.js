(function() {
		var doctual = window.doctual = window.doctual || {};

		doctual.formValidate = function(el) {
			function validate() {
				$(el).validate({
						rules: {
							name: {
								required: true,
								minlength: 2
							},
							email: {
								required: true,
								email: true
							},
							message: {
								required: true
							}
						},
						messages: {
							name: {
								required: "come on, you have a name don't you?",
								minlength: "your name must consist of at least 2 characters"
							},
							email: {
								required: "no email, no message"
							},
							message: {
								required: "um...yea, you have to write something to send this form.",
								minlength: "thats all? really?"
							}
						}
					});

					return {
						validate: validate
					}
				}
		};