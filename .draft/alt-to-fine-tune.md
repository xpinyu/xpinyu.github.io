The Powerful Alternative To Fine-Tuning
by Y Combinator

[00:00:00] The world is changing so quickly. This
[00:00:01] is probably a little bit obvious, but you should just try things and and like every day do something with AI. Last
[00:00:09] summer, I took a weekend and used um GPT5 to help me build an iPhone app. I
[00:00:15] hadn't done that in a decade. And yeah,
[00:00:18] it's so fast and so easy. And that was, you know, an age ago. That was like 8 months ago. Uh now it's even faster and
[00:00:21] months ago. Uh now it's even faster and easier. Don't limit yourself. like
[00:00:23] easier. Don't limit yourself. like
[00:00:26] anything that you imagine, you should just try to use AI and see how far you can get with it and you'll be, you know, making the world better.
[00:00:40] Welcome to another episode of the Light Cone. Ian Fischer is the co-founder and
[00:00:42] Cone. Ian Fischer is the co-founder and co-CEO of Poetic, which is building recursively self-improving AI reasoning harnesses for LLMs. Previously, he spent
[00:00:52] a decade as a researcher at Google DeepMind and founded a mobile devtools company through YC years ago. Welcome,
[00:00:59] Ian.
[00:01:00] >> Thank you. I'm so happy to be here.
[00:01:01] >> What is Poetic? How's it different than RL? You know, how's it different than
[00:01:03] RL? You know, how's it different than context engineering?
[00:01:07] >> At Poetic, what we're building is a recursively self-improving system. And
[00:01:11] so, recursive self-improvement is this uh, you know, kind of the holy grail of AI where the AI is making itself smarter. The core insight that we had is
[00:01:17] smarter. The core insight that we had is that uh we could do recursive self-improvement far faster and cheaper than all of the other ways that people had been proposing to do this. Uh and so
[00:01:29] obviously I'm I can't go into details about what that what that is um what our particular approach is but um most of the approaches out there involve you
[00:01:38] know they require you to train a new LLM from scratch and training LLMs from scratch costs you know hundreds of millions of dollars and takes uh months of effort and so the >> and then anthropic or openi will come
[00:01:51] along and just eat your lunch in the next model release >> right right and you know of course anthropic and openi and google they're exploring train recursive self-improvement but typically at that
[00:02:00] level of um having the you know having to train a new model uh for every step of self-improvement that they do.
[00:02:07] >> I mean that seems like actually the like defining thing that a startup really really wants. Like I know that I want to
[00:02:11] really wants. Like I know that I want to take advantage of whatever the next model is, but the second you're in fine-tuning land, I'm spending, you know, millions to hundreds of millions of dollars and then guess what? like it
[00:02:23] I just lit it on fire cuz you know the next version of the frontier model comes out and I'll never catch up. Whereas
[00:02:29] like working with your systems means that I will always have the thing that is uh better than the thing that's out of box and that's sort of like the holy grail.
[00:02:39] >> Yeah, we think that this is uh incredibly valuable to anybody who's building on top of uh large language models and we don't view the uh you know the frontier models as competitors.
[00:02:48] They're, you know, they're the ones that were using the stilts, you know, building stilts to stand on top of, but uh if we didn't have that, um that foundational layer, then, you know, poetic couldn't exist.
[00:02:59] >> Yeah. I mean, being the smartest model, uh you know, it's a game of inches actually and like so those inches matter a lot, >> right? Right.
[00:03:05] >> right? Right.
[00:03:06] >> How do we actually get started? I mean,
[00:03:07] you've built something that, uh, basically any startup could use that, uh, it's sort of like stilts really. We
[00:03:15] have built a system that um uh can automatically generate systems for your particular problem that will always outperform the underlying language models and without kind of the massive
[00:03:28] expense as you're saying about the bitter lesson where you know what would you what would you have done without poetic you probably would have said okay we're going to first collect a large data set you know like tens of thousands of examples for our particular problem
[00:03:39] that we're working on and we're going to fine-tune you know the best model we can put get our hands uh maybe that's you know one of the frontier models or maybe it's an open weights model doesn't particularly matter. you're going to spend a lot of
[00:03:49] matter. you're going to spend a lot of money on that fine-tuning. The the
[00:03:52] compute is so expensive. Uh and then at the end of it, you have something that uh you know works better than the thing that you fine-tuned on top of, but by then a new model's come out and it's better than the thing that you
[00:04:04] fine-tuned. You know, you fine-tuned,
[00:04:04] fine-tuned. You know, you fine-tuned, you know, like 3 years ago on top of GPT 3.5 or whatever and then GPD 404 comes out and it just blows you out of the water. And so, are you going to do that
[00:04:14] water. And so, are you going to do that again or are you going to go out of business? And like in some cases the the
[00:04:17] business? And like in some cases the the latter with poetic uh what we end up giving you is a uh you know people are calling these things harnesses now but you know or a gentic system or whatever
[00:04:29] you want to call it that sits on top of one or more language models and it just performs better than them. Uh and when the new model comes out that same harness is uh perfectly compatible with
[00:04:40] it. Uh and you don't need to change
[00:04:40] it. Uh and you don't need to change anything to get the uh you know an even uh bigger performance bump.
[00:04:46] Additionally, we can, you know, continue to optimize for this new model, whatever the new model is that you want to use, uh, and, you know, make it even better.
[00:04:56] Uh, but you, you don't lose out on, you know, hundreds of millions of dollars.
[00:05:00] In fact, we do this so much more cheaply, uh, than fine-tuning would cost as well.
[00:05:05] >> And you've done this actually a bunch of times, right? Like I remember when you
[00:05:07] times, right? Like I remember when you first came out with your paper in December of last year, uh you shot to the top of ARC AGI V2 and then you've done this a bunch of times for other benchmarks too. What you know what was
[00:05:17] benchmarks too. What you know what was that like?
[00:05:19] >> ARGI v2 was this was kind of you us coming out of stealth letting people know that we could um tackle these really hard problems. Uh and in particular, you know, we wanted to show
[00:05:30] that our system could generate these um what we call, you know, we call our system like the poetic meta system can generate uh reasoning systems that are um highly effective. Gemini 3 had deep
[00:05:42] think had just come out. Uh and they were, you know, really quite uh dramatically at the top of the leaderboard at 45%. Uh and two days
[00:05:52] later we release our results where um uh we were showing that we could get uh a lot higher than that. Uh
[00:06:00] >> so they come out with soda and then you come in right above them every single time which is like wild to see honestly.
[00:06:06] That's what it's like to have stilt you know like whatever model comes out you can be taller than that one with poetic which is like that's so awesome.
[00:06:14] >> Yeah. So the interesting thing is that uh we were half the cost of Gemini 3 deep think because we were building on top of Gemini 3 Pro which is a much cheaper model um but we still got uh in
[00:06:25] the end a 9 percentage point improvement on the official verification. So they
[00:06:29] were at 45% and we and like 70s something dollars and we were at 54% and $32 per problem.
[00:06:37] >> So recently you guys just announced some incredible results for humanity's last exam. Can you tell us more about those?
[00:06:42] exam. Can you tell us more about those?
[00:06:44] >> Humanity's last exam is a a set of 2500 really really hard questions written by experts in uh many different domains.
[00:06:53] They're they're meant to be uh challenging even for uh PhDs in those fields. AI hasn't passed it yet. Uh but
[00:06:58] fields. AI hasn't passed it yet. Uh but
[00:07:01] we got to 55% which is almost two percentage points higher than the the previous uh state-of-the-art which came
[00:07:09] out just last week uh from uh Anthropic with Claude Opus 4.6. They got 53.1% and we got 55% on it.
[00:07:19] >> And one thing that uh humanity last exam doesn't publish is the cost of getting those results. In your case, this run
[00:07:24] those results. In your case, this run was done with less than around six figure. How much was it?
[00:07:30] figure. How much was it?
[00:07:31] >> We didn't publish any uh cost for this, but I can say that the the optimization costs us less than 100k. Yeah.
[00:07:38] >> Which is impressive because each of these big foundation modeled train runs are in the hundreds of millions of dollars. And you guys, as a company,
[00:07:45] dollars. And you guys, as a company, you're only seven people.
[00:07:49] >> That's right. Yeah. Yeah. Seven uh seven research scientists and research engineers. Yeah.
[00:07:53] engineers. Yeah.
[00:07:53] >> That's impressive. And I think the thing that's very interesting about your approach is sort of taking a very scientific approach to the emergent behaviors that a lot of the best founders are doing with models. I think
[00:08:05] a lot of uh founders that get very good results for agents, they treat the underlying model as a common layer that you can switch in between. And there's
[00:08:15] certain tasks for example for GPD 5.2 two like very hard to verify bugs gets sent to that versus architecture that gets sent to claw 4.6 six, but you're
[00:08:26] kind of doing this automatically instead of having a human conducting is uh very impressive. I think there's something
[00:08:32] impressive. I think there's something more special going on underneath. Can
[00:08:35] you tell us a bit about how it works?
[00:08:37] >> Yeah, it sounds magical. So, what can you tell us?
[00:08:40] >> Right. You're you're So, you're getting at a core a really core thing. You know,
[00:08:43] these harnesses, they are um code, prompts, data, you know, built on top of one or more language models, right? And
[00:08:51] so this is something that in principle you can build by hand um or with like cloud code or whatever. But uh in in practice it takes a lot of work to do
[00:09:01] these to to you know have all the insights uh to make this uh to make these work well. And so the core technology that we've developed at poetic is uh recursive self-improvement.
[00:09:13] So we we have a recursively self-improving uh system which we call the poetic meta system. the output of that system is systems that solve hard problems. Um where a hard problem is you
[00:09:24] know something that you if you gave it to GPT52 uh it would struggle to give you a reliable robust result you know just to use an example. So this is a a very big
[00:09:34] advantage for us. We can generate these systems in a much more automated manner.
[00:09:39] uh which means that we can do it much more quickly and much more cheaply than if you hired a team yourself to try to make um your own you know your own agent to solve your particular task. But not
[00:09:50] only that um since you know this is really an automated optimization process. If you already have done that
[00:09:54] process. If you already have done that work you you know you're a you're a startup that's like going after a particular vertical and you've put together you know you think you understand your your problem pretty well. You've put together your agent and
[00:10:03] well. You've put together your agent and you you uh you know maybe it's working pretty well but you know you can get something better or you really need something better. Um then you can bring
[00:10:10] something better. Um then you can bring that to us uh and we can optimize uh that entire agent or pieces of that agent. So we could optimize just the
[00:10:18] agent. So we could optimize just the prompts, just the reasoning strategies.
[00:10:22] Uh there's a lot of different things that we can do uh depending on your particular needs.
[00:10:26] >> It sounds like this is a complete different paradigm than RL because we went through the scurve of regular pre-training RL with when OpenAI released 01 and now
[00:10:37] this feels like a new one. It sounds
[00:10:40] special. It sounds it rhymes a lot with RNN's >> which is a whole different paradigm than than RL, right? It's going to depend on the particular task, the particular type of problem that we're going after that
[00:10:51] we're trying to solve. Um, and the underlying models that we're working with. But, uh, effectively you could say
[00:10:55] with. But, uh, effectively you could say like each model or each set of models that we're working with will have it their own uh, scurve. The poetic system, the poetic meta system itself is also
[00:11:07] going to have its own scurve. And so as the poetic meta system gets better and as the underlying models get better, you you'll find that the uh you know the S-curve that you're dealing with keeps shifting higher and higher until
[00:11:17] ultimately either you saturate or like >> reach AGI.
[00:11:21] >> Yeah. Reach AGI, reach super intelligences. Yeah.
[00:11:23] intelligences. Yeah.
[00:11:24] >> Given its stilts, you might like hit the ceiling first then.
[00:11:27] >> That's the goal, right? Yeah,
[00:11:28] >> you want to hit the ceiling first with >> I think a lot of startups that we work with um and then in my spare time I you know do a bunch of context engineering and then the thing is we're sort of like
[00:11:40] tuning it tuning evals tuning like we're context stuffing ourselves. What does
[00:11:45] that even feel like to have a you know recursively self-improving version of like prompt engineering and context engineering? we don't spend a lot of
[00:11:51] engineering? we don't spend a lot of time looking at the particular data that we're working with. Uh instead, we're letting the poetic meta system look at
[00:12:02] that data and and so like the meta system, you know, if it if it thinks that it needs to put more things into context, it do more context stuffing or whatever, it'll it'll do that. If it
[00:12:12] needs to like generate a bunch of examples um uh to get the get better performance, it'll do that for you, right? It it was pretty interesting to
[00:12:20] right? It it was pretty interesting to look at the um prompt outputs in particular I'd say for ArcGI in that you know I think you can read those and say
[00:12:30] well that's not what a human would have written uh pretty clearly and and it's you know there's some unexpected stuff and you know it made some really simple examples and one of the examples is
[00:12:41] actually wrong but we didn't change it.
[00:12:43] We're like well this is you know this is the thing that it output we'll just leave it be. um you know we don't want to go in and monkey around with things and so historically in machine learning
[00:12:54] you always you know is like the the rule was you have to know your data set really well um but now we're kind of outsourcing that to the AI itself where the AI is it's the AI's job to
[00:13:05] understand the data set and figure out where are the failure modes um and where are the kind of robust reasoning strategies that uh the model that that
[00:13:15] the agent could uh use um to get better performance.
[00:13:19] >> How much of it is like much you the output is much better prompts and then how much of it is like the harness itself uh context stuffing or summarizing in the right way or reranking in the right way so that like
[00:13:30] you you have some number of like mega LLM calls and then how do you get the most out of um each of those calls?
[00:13:37] >> Yeah. And so that definitely varies per problem. But uh what we've seen, in
[00:13:40] problem. But uh what we've seen, in fact, our our last paper at DeepMind was not doing this recursive self-improving stuff, but we were um we were showing
[00:13:50] that you could build these harnesses um manually to solve really hard problems. And what we saw is there is that uh you know, we manually optimized the prompts really hard for these very hard
[00:14:01] problems. And that got us a little bit of the way uh in this particular case.
[00:14:06] you know the the hardest the hardest task we were working on we got like to 5% performance with Gemini 1.5 flash this was a while ago and then when we
[00:14:15] added on the the reasoning strategies we went from 5% to 95% >> uh and so this is typically what we see you know like everybody's out there kind of doing some amount I wouldn't say
[00:14:27] everybody but many people are out there kind of doing some amount of automated prop pro prompt optimization you know Jeepa is this very popular paper everybody's kind of implementing that that will get you some performance
[00:14:37] improvements, but it's very far from uh everything that you can get uh if you actually think about these reasoning strategies that are really going to be written in code rather than in in just
[00:14:49] better prompts.
[00:14:50] >> So if startups want to use poetic to put their agent on stilts, what should they do?
[00:14:57] >> Yeah, so right now uh we haven't released anything yet, but uh if you go to poetic.ai, AI. Uh there is a button you can click to get uh sign up for early access. And if you're a startup uh
[00:15:06] early access. And if you're a startup uh or a company who has a really hard problem uh and you've tried everything that you can to make it uh reliable and robust and you just can't get all the
[00:15:18] way there, you you need something more, then uh let us know. We're looking for problems like that. Uh so just tell us tell us what it is that you're working on and uh we'll reach out. You'll be the first to know when we're when we're
[00:15:29] ready to work with you. I mean, if you're at the top of um humanity's last exam, then I mean, that's that's pretty big. So, it's you're all you're already
[00:15:35] big. So, it's you're all you're already all the way out there at soda and then I guess the stilts basically let any agentic company become soda.
[00:15:44] >> That's the idea. Yeah. Yeah. And you
[00:15:47] know, we view the ArcGI results and the humanities last exam results as showing kind of two different uh capabilities that we have. We can really improve your reasoning and we can really improve uh deep knowledge extraction uh from these
[00:15:59] models >> and then you're just totally vaccinated against the bitter lesson.
[00:16:03] >> Exactly.
[00:16:04] >> YC's next batch is now taking applications. Got a startup in you?
[00:16:06] applications. Got a startup in you?
[00:16:08] Apply at y combinator.com/apply.
[00:16:11] It's never too early and filling out the app will level up your idea. Okay, back
[00:16:16] to the video.
[00:16:18] >> Slight sort of change change of topic, but something I was curious about. Uh so
[00:16:21] you arrived at Google over a decade ago when they acquired your first YC startup at portable. A portable was it's porting
[00:16:26] at portable. A portable was it's porting mobile apps crossplatform right like Android or or whatever. It's quite
[00:16:32] different to um recursive self-improving AGI. Um how did you make that leap? What
[00:16:36] AGI. Um how did you make that leap? What
[00:16:39] happened once you got to Google? Um what
[00:16:42] made you think that you maybe wanted to shift out and do something different?
[00:16:45] And just would love to hear that story.
[00:16:46] the acquisition uh was this amazing opportunity to um reflect on what I really wanted to be doing next, right?
[00:16:55] Like Google was in, you know, itself is a place where you can do so many different things. Uh so I spent some
[00:17:00] different things. Uh so I spent some time thinking about um where uh where I wanted to go next in in uh in my
[00:17:10] journey. I realized that the problems
[00:17:10] journey. I realized that the problems that I was most excited about were really actually AI and uh and robotics.
[00:17:20] Um and the best people in the world, many of them in those fields were at Google at the time. Uh and so I went and
[00:17:29] talked to them. they uh let me come join you know a new AI robotics team uh in Google research which was this amazing opportunity for me since that wasn't my
[00:17:42] background my background was like uh computer security and then this crossplatform mobile you know it's systems building uh stuff I was able to join this team and I I'll tell you the
[00:17:52] truth that uh I very quickly realized that uh hardware is hard uh and I didn't really want to be doing robotics is more aspirational at that moment
[00:18:00] uh but I was really um uh passionate about machine learning. So I just uh uh made a very hard switch into just doing machine learning research uh and did
[00:18:11] that for you know about a decade at Google and and then Google and then deep mind.
[00:18:16] >> What's maybe some advice that you have today for engineers who want to get into sort of more of the AI side probably the applied AI and build startups around AI like how should they think about that?
[00:18:28] You know, the world is changing so quickly. This is probably a little bit
[00:18:30] quickly. This is probably a little bit obvious, but you should just try things and and like every day uh do something uh do something with AI. Always try to
[00:18:41] push yourself to find the boundaries of what they're capable of. Uh and uh and build the things that you that you want
[00:18:49] to build, right? Um, even even for me, you know, last summer I took a weekend and used um GPT5 to help me build an iPhone app. I hadn't I hadn't done that
[00:18:59] iPhone app. I hadn't I hadn't done that in a decade. So fast.
[00:19:03] >> Yeah, it's so fast and so easy. And that
[00:19:05] was, you know, that was an, you know, an age ago. That was like eight months ago.
[00:19:07] age ago. That was like eight months ago.
[00:19:09] Uh, now it's even faster and easier.
[00:19:11] Don't limit yourself. Like anything that you imagine, you should just try to use AI and see how far you can get with it and you'll be, you know, making the world better. That's all we have time
[00:19:18] world better. That's all we have time for today, but Ian, thank you so much for giving us all Stilts. Uh, we can't wait to use it at YC. I can't wait to use it for Gary's list. I mean, there's
[00:19:29] just so much to do. So,
[00:19:31] >> yeah, thank you for having me. This was
[00:19:32] a lot of fun.