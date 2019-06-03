const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const client = new SteamUser();
const config = require('./config.js')
const SteamCommunity = require('steamcommunity')
const TradeOfferManager = require('steam-tradeoffer-manager');
const community = new SteamCommunity();
const manager = new TradeOfferManager({
	steam: client,
	community: community,
	language: 'en'
});
const logOnOptions = {
	accountName: config.username,
	password: config.password,
	twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
};
client.logOn(logOnOptions);
client.on('loggedOn', () => {
	console.log('succesfully logged on.');
	client.setPersona(SteamUser.EPersonaState.Online);
client.gamesPlayed(730);
});
client.on('webSession',(sessionid,cookies)=> {
	manager.setCookies(cookies);
	community.setCookies(cookies);
	community.startConfirmationChecker(10000, config.identitySecret);
})
manager.on('newOffer', offer => {
  if (offer.partner.getSteamID64() === config.SteamID) 
  {
    offer.accept((err, status) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Accepted offer. Status: ${status}.`);
      }
    });
  } 
  else 
  {
    offer.decline(err => {
      if (err) {
        console.log(err);
      } else {
        console.log('Canceled offer from scammer.');
      }
    });
  }
});
