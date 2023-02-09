# `@minamarkham` Twitter Archive

This is a public archive of all the tweets from my Twitter account `@minamarkham`, available at [tweets.mina.codes](https://tweets.mina.codes/). After recent changes in Twitter's direction following the takeover by Elon Musk, the platform is less reliable and tolerable.

Twitter still holds a lot of historical content and conversations which I didn't want to lose, so I've extracted my Twitter data and published it in this format. The vast majority of this is forked from Zach Leatherman's [`tweetback`](https://github.com/tweetback/tweetback/), with some modifications to fit my own design.

## Deploy

Since the shuttering of Twitter's free public API, I doubt I will update this site any futher. But if it becomes necessary in the future, publish with the following command:

```shell
npm run -- netlify deploy -s "${SITE_ID}" --prod -m "Manual deployment from command line."
```
