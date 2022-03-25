const {
	Telegraf,
	Composer,
	Stage,
	session,
	BaseScene,
	WizardScene
} = require('micro-bot')
const mongoose = require('mongoose')

const userModel = require('./userModel')
const checkGroup = require('./checkGroup')


// const bot = new Telegraf('5239471949:AAFtksTOfeAQcJCg1C6VOhsnL6k6-PKdF1U')
const bot = new Composer()


mongoose.connect('mongodb+srv://rasedul20:rasedul20@telegramproject.w3ip3.mongodb.net/zalenskyairdrop?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).catch((e) => {
	console.log(e)
}).then((d) => console.log('Database connected')).catch((e) => console.log(e))


bot.use(session({
	property: 'user',
	getSessionKey: (ctx) => ctx.chat && ctx.chat.id,
}))


bot.action('join', ctx => {

	ctx.telegram.sendMessage(ctx.chat.id, "Task 1 (Join our Telegram Community) \n\nIf you are already a member of our Telegram chat group @zelenskyytoken, you can skip this step by copying and sending the below-quoted text as a message to the group.\n👇👇👇👇👇👇 \n\n ' `Hello ZSK Soldiers, click https://coinsniper.net/coin/28893 to vote for our beloved $ZSK token today` '  \n\nNOTE - Do not include the quote symbol in your message ' ', Send only the texts inside the quote. If you have not joined our group yet, please complete this first step by clicking the link below to join \nhttps://t.me/zelenskyytoken \n\nClick done to proceed after you have joined.", {
		reply_markup: {
			inline_keyboard: [
				[{
					text: "Done",
					callback_data: "groupJoin"
				}]
			]
		},
		parse_mode: "Markdown"
	}).catch((e) => console.log(e))
})

bot.action('groupJoin', (ctx) => {

	const data = checkGroup.find({
		userId: ctx.from.id
	})

	data.then((data) => {

		if (data.length > 0) {


			ctx.telegram.sendMessage(ctx.chat.id, `Task 2 ($ZSK News Channel Join) \n\nPlease Join our telegram channel \nhttps://t.me/zsknewschannel \n\nClick done to proceed after you have joined`, {
				reply_markup: {
					inline_keyboard: [
						[{
							text: "Done",
							callback_data: "channelJoin"
						}]
					]
				}
			}).catch((e) => console.log(e))

		} else {


			ctx.telegram.sendMessage(ctx.chat.id, `Task 1 (Join our Telegram Community) \n\nIf you are already a member of our Telegram chat group @zelenskyytoken, you can skip this step by copying and sending the below-quoted text as a message to the group. \n"Hello ZSK Soldiers, click https://coinsniper.net/coin/28893 to vote for our beloved $ZSK token today" \n\nNOTE - Do not include the quote symbol in your message " ", Send only the texts inside the quote. If you have not joined our group yet, please complete this first step by clicking the link below to join \nhttps://t.me/zelenskyytoken \n\nClick done to proceed after you have joined.`, {
				reply_markup: {
					inline_keyboard: [
						[{
							text: "Done",
							callback_data: "groupJoin"
						}]
					]
				}
			}).catch((e) => console.log(e))
		}

	}).catch((e) => console.log(e))


})

const input_form = new WizardScene('input_data',
	(ctx) => {


		ctx.user.userId = ctx.from.id
		ctx.user.userName = ctx.from.first_name

		ctx.reply(`Task 3 (Twitter Follow) \n\nVisit our Twitter page using the link below. Follow us, comment, and Retweet any of our posts. \nhttps://twitter.com/zsktoken \n\nRemember no tricks, ensure you complete this step. We will verify this. When you are done, return here and enter your Twitter username to proceed.`).catch((e) => console.log(e))
		return ctx.wizard.next()
	},
	(ctx) => {

		ctx.user.twitter = ctx.update.message.text

		ctx.telegram.sendMessage(ctx.chat.id , `Task 4 (Join Smart Investors Corner - Educational Channel) \n\nNext, Join our partner telegram channel \nhttps://t.me/smartinvestorscorner \n\nClick done to proceed after you have joined. `,
		{
			reply_markup: {
				inline_keyboard: [
					[{
						text: "Done", callback_data: "nexxt"
					}]
				]
			}
		}).catch((e) => console.log(e))
		return ctx.wizard.next()
	},
	(ctx) => {


		ctx.reply(`Task 5: \n\nVote for Zelenskyytoken on coinsnipper \n\nClick the link below to vote for ZSK token: \nhttps://coinsniper.net/coin/28893 \n\nAfter you have voted, return here, upload a screenshot of your vote confirmation an then click done to proceed.`).catch((e) => console.log(e))
		return ctx.wizard.next()
	},
	(ctx) => {

		const file = ctx.update.message.photo[1].file_id

		ctx.telegram.getFileLink(file).then((image)=>{
			ctx.user.photo = image
		}).catch((e)=>console.log(e))

		ctx.reply(`Task 6: \n\nDrop your BEP-20 supported wallet address to receive $ZSK Airdrop`).catch(() => console.log(e))
		return ctx.wizard.next()
	},
	(ctx) => {

		const data = userModel.find({
			userId: ctx.from.id
		})

		data.then((data) => {


			if (data.length > 0) {

				const ref_id = parseInt(data[0].referrer_id)

				const inputData = {
					twitter: ctx.user.twitter,
					image: ctx.user.photo,
					wallet: ctx.update.message.text
				}


				const data2 = userModel.updateOne({
					userId: ctx.from.id
				}, inputData)

				data2.then((data) => {


					const data3 = userModel.find({
						userId: ref_id
					})

					data3.then((data) => {


						const ref_count = parseInt(data[0].referral_count)


						const update_ref = {
							referral_count: ref_count + 1
						}


						const data4 = userModel.updateOne({
							userId: ref_id
						}, update_ref)

						data4.then((data) => {

							ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nWallet Address - " + ctx.update.message.text + "\nReferral Users - 0 \n\nReferral Link -\n\n (Tap to copy your link) \n\n`https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referred users count will increase, and this will increase your chances. Best wishes to you.", {
								reply_markup: {
									inline_keyboard: [
										[{
											text: "Refresh",
											callback_data: "start"
										}]
									]
								},
								parse_mode: "Markdown"
							}).catch((e) => console.log(e))


						}).catch((e) => console.log(e))

					})


				}).catch((e) => console.log(e))


			} else {

				console.log(ctx.user)

				const inputData = new userModel({
					userId: ctx.from.id,
					name: ctx.from.first_name,
					twitter: ctx.user.twitter,
					image: ctx.user.photo,
					wallet: ctx.update.message.text,
					referral_count: '0'
				})

				inputData.save((e) => {

					if (e) {
						throw e
					} else {

						ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nWallet Address - " + ctx.update.message.text + "\nReferral Users - 0 \n\nReferral Link - \n\n (Tap to copy your link) \n\n `https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referred users count will increase, and this will increase your chances. Best wishes to you.", {
							reply_markup: {
								inline_keyboard: [
									[{
										text: "Refresh",
										callback_data: "start"
									}]
								]
							},
							parse_mode: "Markdown"
						}).catch((e) => console.log(e))


					}
				})
			}

		}).catch((e) => console.log(e))


		return ctx.scene.leave()
	}
)


const stage = new Stage([input_form], {
	sessionName: 'user'
})

bot.use(stage.middleware())


bot.action('channelJoin', Stage.enter('input_data'))


bot.start((ctx) => {

	const ref = ctx.startPayload

	const data = userModel.find({
		userId: ctx.from.id
	})


	data.then((data) => {

		if (data.length > 0) {

			const wallet = data[0].wallet
			const r = data[0].referral_count


			ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nWallet Address - " + wallet + "\nReferral Users - " + r + " \n\nReferral Link - \n\n (Tap to copy your link) \n\n **`https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`**\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 0.5 bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck", {
				reply_markup: {
					inline_keyboard: [
						[{
							text: "Refresh",
							callback_data: "start"
						}]
					]
				},
				parse_mode: "Markdown"
			}).catch((e) => console.log(e))


		} else {


			if (ref.length > 0) {

				const inputData = new userModel({
					userId: ctx.from.id,
					name: ctx.from.first_name,
					referrer_id: ref,
					referral_count: 0
				})

				const data = inputData.save()

				data.then((data) => {


					ctx.telegram.sendMessage(ctx.chat.id, `Dear Zelenskyy Soldier, you must sincerely complete all tasks to earn our Airdrops. No tricks at all because our team will manually verify your entries. If any trick, you will be disqualified. Click Start to proceed.`, {
						reply_markup: {
							inline_keyboard: [
								[{
									text: "Start",
									callback_data: "join"
								}]
							]
						}
					}).catch((e) => console.log(e))


				}).catch((e) => console.log("Something is wrong "))


			} else {

				ctx.telegram.sendMessage(ctx.chat.id, `Dear Zelenskyy Soldier, you must sincerely complete all tasks to earn our Airdrops. No tricks at all because our team will manually verify your entries. If any trick, you will be disqualified. Click Start to proceed.`, {
					reply_markup: {
						inline_keyboard: [
							[{
								text: "Start",
								callback_data: "join"
							}]
						]
					}
				}).catch((e) => console.log(e))
			}

		}


	}).catch((e) => ctx.reply("Please try again"))

})


bot.action("start", (ctx) => {

	const data = userModel.find({
		userId: ctx.from.id
	})
	data.then((data) => {
		const wallet = data[0].wallet
		const r = data[0].referral_count


		ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nWallet Address - " + wallet + "\nReferral Users - " + r + " \n\nReferral Link -\n\n (Tap to copy your link) \n\n **`https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`**\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 0.5bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck", {
			reply_markup: {
				inline_keyboard: [
					[{
						text: "Refresh",
						callback_data: "start"
					}]
				]
			},
			parse_mode: "Markdown"
		}).catch((e) => console.log(e))
	}).catch((e) => ctx.reply("Please try with /start"))
})


bot.on('new_chat_members', (ctx) => {

	const data = checkGroup.find({
		userId: ctx.from.id
	})

	data.then((data) => {

		if (data.length > 0) {
			console.log("User Already Added")
		} else {

			const data = new checkGroup({
				userId: ctx.from.id
			})
			const d = data.save()
			d.catch((e) => console.log(e))
		}

	}).catch((e) => console.log(e))

})


bot.on('text', (ctx) => {

	const message = ctx.update.message.text

	const r = /ZSK Soldiers/gi

	if (message.match(r)) {

		const data = checkGroup.find({
			userId: ctx.from.id
		})

		data.then((data) => {

			if (data.length > 0) {
				console.log("User Already Added")
			} else {

				const data = new checkGroup({
					userId: ctx.from.id
				})
				const d = data.save()
				d.catch((e) => console.log(e))
			}

		}).catch((e) => console.log(e))

	}

})


// bot.launch().then(()=>console.log('bot started')).catch((e)=>console.log(e))

module.exports = bot
