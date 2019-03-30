import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const serviceAccount = require("../coin-trade-59f69-firebase-adminsdk-r3vwe-c28f0e72ef.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coin-trade-59f69.firebaseio.com"
});


const db = admin.firestore();

export const onUserCreate = functions.auth.user()
  .onCreate((user) => {
    const userId = user.uid;
    const userData = db.collection('users').doc(userId);
    const userCount = db.collection('users').doc('userCount');
    return db.runTransaction((transaction) => {
      return transaction.get(userCount).then((Count) => {
        const countObject = Count.data();
        const newCount = countObject!.count + 1;
        transaction.update(userCount, { count: newCount });
        return newCount;
      }).then((newCount) => {
        const temp = Math.floor(newCount / 6);
        console.log("Success");
        return userData.set({
          email: user.email,
          no: newCount,
          coins: 50,
          cheat: 0,
          cooperate: 0,
          room_id: temp,
          name: user.displayName
        });
      });
    });
  });

export const deleteUser = functions.auth.user()
  .onDelete((user) => {
    const userId = user.uid;
    const userData = db.collection('users').doc(userId);
    const userCount = db.collection('users').doc('userCount');
    return userData.delete()
      .then(() => {
        return db.runTransaction((transaction) => {
          return transaction.get(userCount).then((Count) => {
            const countObject = Count.data();
            const newCount = countObject!.count - 1;
            return transaction.update(userCount, { count: newCount });
          });
        });
      });
  });

export const transact = functions.firestore.document('tokens/{tokenId}')
  .onUpdate((snap, context) => {
    const id = context.params.tokenId;
    const token = db.collection("tokens").doc(id);
    const newValue = snap.after.data();
    const sender = newValue!.sender;
    const replier = newValue!.replier;
    const user1 = db.collection("users").doc(sender.user_id);
    const user2 = db.collection("users").doc(replier.user_id);
    if (sender.val === -1 || replier.val === -1)
      return;
    const c = sender.val.toString() + replier.val.toString();
    console.log(c);
    return token.delete()
      .then(() => {
        return db.runTransaction(transaction => {
          return transaction.get(user1).then((user) => {
            const userVal = user.data();
            let newCoins = userVal!.coins;
            let cheat = userVal!.cheat;
            let cooperate = userVal!.cooperate;
            let userData = userVal![replier.user_id];
            if (userData === undefined) {
              userData = { cheat: 0, cooperate: 0 };
            }
            if (c === "10") {
              userData.cheat += 1;
              newCoins -= 10;
              cooperate += 1;
            }
            if (c === "01") {
              userData.cooperate += 1;
              newCoins += 20;
              cheat += 1;
            }
            if (c === "11") {
              userData.cooperate += 1;
              newCoins += 10;
              cooperate += 1;
            }
            if (c === "00") {
              userData.cheat += 1;
              newCoins -= 10;
              cheat += 1;
            }
            let temp = { coins: newCoins, [replier.user_id]: userData, cheat: cheat, cooperate: cooperate };
            return transaction.update(user1, temp);
          })
        }).then(() => {
          return db.runTransaction(transaction => {
            return transaction.get(user2).then((user) => {
              const userVal = user.data();
              let newCoins = userVal!.coins;
              let cheat = userVal!.cheat;
              let cooperate = userVal!.cooperate;
              let userData = userVal![sender.user_id];
              if (userData === undefined) {
                userData = { cheat: 0, cooperate: 0 };
              }
              if (c === "01") {
                userData.cheat += 1;
                newCoins -= 10;
                cooperate += 1;
              }
              if (c === "10") {
                userData.cooperate += 1;
                newCoins += 20;
                cheat += 1;
              }
              if (c === "11") {
                userData.cooperate += 1;
                newCoins += 10;
                cooperate += 1;
              }
              if (c === "00") {
                userData.cheat += 1;
                newCoins -= 10;
                cheat += 1;
              }
              let temp = { coins: newCoins, [sender.user_id]: userData, cheat: cheat, cooperate: cooperate };
              return transaction.update(user2, temp);
            })
          })
        })
      })
  })