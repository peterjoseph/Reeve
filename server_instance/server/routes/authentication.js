module.exports = function(router) {
	router.get("/test", function(req, res) {
		res.json({
			success: true,
			message: "Endpoint loaded successfully"
		});
	});
};
