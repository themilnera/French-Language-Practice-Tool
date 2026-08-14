# Details

I believe that LLMs are only useful as a tool inasmuch as they can be made to work with consistency. The key to doing that, in my opinion, is to have a deterministic structure. For practicing French, I could just have the LLM generate exercises from nothing, but those will be unpredictable, and it's hard to gauge whether it's giving you consistently useful and comprehensive study material, and that's the case even with something a LLM should be really good at: language.

Therefore, what I'm building here is a simple app that uses a database of frequently used words as a practice guide. When the LLM generates a practice sentence, it'll be told exactly which word to focus on.

## Why local LLMs?

Because here, assuming you're using one that's well versed in French, a particularly large model would be overkill. Something smaller will do well enough if you're giving it a very small specific task like: "Generate a practice sentence with this verb."

## Why LLMs at all?

The benefit of having something that can read any sentence you input tell you where you made grammatical errors is obvious. An LLM, even a small one, can do that pretty consistently. Language is all they are really trained in. It's infinitely more difficult to code something that can do that with pattern matching and conditional statements.

# Deployment

Right this moment the deployed version of the site doesn't work because CORS blocks localhost requests. It's usable if you want to clone the repo, npm install and npm run dev, but I'm looking at possibly setting up a small hosted LLM somewhere. The other option is to bundle it with electron or something and make it a local only app, but I'm working out what I want to do.
