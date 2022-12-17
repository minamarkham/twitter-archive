const dataSource = require("../src/DataSource");
const metadata = require("../_data/metadata.js");

module.exports = async function(data) {
	let titleTweetNumberStr = "";
	if(data.page.fileSlug === "tweet-pages") {
		titleTweetNumberStr = `—№ ${this.renderNumber(data.pagination.hrefs.length - data.pagination.pageNumber)}`;
	} else if(data.page.fileSlug === "newest") {
		titleTweetNumberStr = `—№ ${this.renderNumber((await dataSource.getAllTweets()).length)}`;
	}

	let navHtml = "";
	if(data.page.fileSlug === "tweet-pages" || data.page.fileSlug === "newest") {
		let newestHref = "/newest/";
		let previousHref = data.pagination.previousPageHref;
		let nextHref = data.pagination.nextPageHref;

		if(data.page.fileSlug === "newest") {
			newestHref = "";
			previousHref = "";
			nextHref = "/" + (await dataSource.getAllTweets()).sort((a, b) => b.date - a.date).slice(1, 2).map(tweet => tweet.id_str).join("") + "/";
		} else if(data.page.fileSlug === "tweet-pages" && data.pagination.firstPageHref === data.page.url) {
			newestHref = "";
		}

		navHtml = `<ul class="tweets-nav">
			<li>${newestHref ? `<a href="${newestHref}">` : ""}⇤ Newest<span class="sr-only"> Tweet</span>${newestHref ? `</a>` : ""}</li>
			<li>${previousHref ? `<a href="${previousHref}">` : ""}⇠ Newer<span class="sr-only"> Tweet</span>${previousHref ? `</a>` : ""}</li>
			<li>${nextHref ? `<a href="${nextHref}">` : ""}Older<span class="sr-only"> Tweet</span> ⇢${nextHref ? `</a>` : ""}</li>
		</ul>`;
	}

	let meta_description = `A read-only indieweb self-hosted archive of${ data.pagination && data.pagination.hrefs && data.pagination.hrefs.length ? ` all ${data.pagination.hrefs.length} of` : ""} ${data.metadata.username}’s tweets.`;
	if (data.page.fileSlug === "tweet-pages" && data.tweet && data.tweet.full_text) {
		// note that data.tweet.full_text is already HTML-escaped
		meta_description = data.tweet.full_text.replace(/\s+/g, " ");
	}

	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${data.metadata.username}’s Twitter Archive${titleTweetNumberStr}</title>
		<meta name="description" content="${meta_description}" />
		<script>
		if("classList" in document.documentElement) {
			document.documentElement.classList.add("has-js");
		}
		</script>

		${data.page.fileSlug !== "tweet-pages" ? `
			<link rel="stylesheet" href="/assets/chartist.min.css">
			<link rel="stylesheet" href="/assets/chart.css">
			<script src="/assets/chartist.min.js"></script>
			<script src="/assets/chart.js"></script>
			<link rel="profile" href="http://microformats.org/profile/hatom">
			` : ""}

		<link rel="stylesheet" href="/assets/style.css">
		<script src="/assets/script.js" type="module"></script>
		<script src="/assets/is-land.js" type="module"></script>

		${data.page.fileSlug === "newest" ? `
			<link rel="canonical" href="/${data.tweet.id_str}/">
			<meta http-equiv="refresh" content="0; url=/${data.tweet.id_str}/">
			` : ""}
	</head>
	<body>
		<header class="page-header">
			<a class="me-card page-header__brand" href="/">
				<img src="${metadata.avatar}" width="48" height="48" alt="mina’s avatar" class="me-card__avatar">
				<span class="me-card__name">
					<span>Mina Markham</span>
					<span class="me-card__verification">
						<svg class="icon icon--verified" role="img" aria-hidden="true" viewBox="0,0,24,24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
						</svg>
					</span>
					<span class="me-card__official" aria-hidden="true">
					Twitter Archive${titleTweetNumberStr}
					</span>
				</span>
			</a>
			${!data.hideHeaderTweetsLink ? `<ul class="tweets-nav">
				<li><a rel="home" href="${data.metadata.homeUrl}">← ${data.metadata.homeLabel}</a></li>
			</ul>`: ""}
			${navHtml}
		</header>
		<main>
			${data.content}
		</main>
		<footer>
			<p>An open source project from <a href="https://github.com/tweetback">tweetback</a>.</p>
		</footer>
	</body>
</html>`;
};