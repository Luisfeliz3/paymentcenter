import axios from "axios";

export default {
	// New endpoint to get pricing from pricing collection
	getTransactions: function () {
		return axios.get("/api/transactions");
	}

	// // Saves the onChange params to the user collection
	// saveDims: function (dimData) {
	// 	return axios.post("/api/saveInput", dimData);
	// },

	// // Get the current userParams dimensions from the user collection on load
	// getDims: function () {
	// 	return axios.get("/api/getdims");
	// },

	//Below is old
	// // Gets all comments
	// getComments: function() {
	//   return axios.get("/api/comments");
	// },
	// // Gets the comment with the given id
	// getComment: function(id) {
	//   return axios.get("/api/comments/" + id);
	// },
	// // Deletes the comment with the given id
	// deleteComment: function(id) {
	//   return axios.delete("/api/comments/" + id);
	// },
	// // Saves a comment to the database
	// saveComment: function(commentData) {
	//   return axios.post("/api/comments", commentData);
	// },
};
