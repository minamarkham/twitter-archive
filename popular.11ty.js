const Twitter = require("./src/twitter");
const dataSource = require("./src/DataSource");

class Popular extends Twitter {
	data() {
		return {
			layout: "layout.11ty.js"
		};
	}

	async render(data) {
		let tweets = await dataSource.getAllTweets();
		let tweetHtml = await Promise.all(this.getMostPopularTweets(tweets).map(tweet => this.renderTweet(tweet, {showPopularity: true, showSentiment: true})));

		return `<div class="page-content"><h2>Popular Tweets</h2>
		<p>A list of popular tweets by retweets and favorites.</p>
		<ol class="tweets tweets-linear-list">
			${tweetHtml.join("")}
		</ol></div>`;
	}
}

module.exports = Popular;
