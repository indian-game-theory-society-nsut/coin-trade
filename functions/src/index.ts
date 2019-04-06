import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const serviceAccount = require("../igts-nsut-firebase-adminsdk-x5342-878108b482.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://igts-nsut.firebaseio.com"
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
        let temp = (newCount - 1) % 5;
        console.log("Success");
        return userData.set({
          email: user.email,
          no: newCount,
          coins: 0,
          data: [0, 0, 0, 0],
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
    const c = sender.val * 4 + replier.val;
    console.log(c);
    const sendermap = [0, 0, 0, 0, 0, 0, -10, -10, 0, 10, 0, -10, 0, 10, 10, 0];
    const receivermap = [0, 0, 0, 0, 0, 0, 10, 10, 0, -10, 0, 10, 0, -10, -10, 0];
    return token.delete()
      .then(() => {
        return db.runTransaction(transaction => {
          return transaction.get(user1).then((user) => {
            const userVal = user.data();
            let newCoins = userVal!.coins;
            let userData = userVal![replier.user_id];
            let data = userVal!.data;
            if (userData === undefined) {
              userData = { data: [0, 0, 0, 0] };
            }
            userData.data[replier.val] += 1;
            data[sender.val] += 1;
            newCoins += sendermap[c];
            let temp = { coins: newCoins, [replier.user_id]: userData, data: data };
            return transaction.update(user1, temp);
          })
        }).then(() => {
          return db.runTransaction(transaction => {
            return transaction.get(user2).then((user) => {
              const userVal = user.data();
              let newCoins = userVal!.coins;
              let userData = userVal![sender.user_id];
              let data = userVal!.data;
              if (userData === undefined) {
                userData = { data: [0, 0, 0, 0] };
              }
              userData.data[sender.val] += 1;
              data[replier.val] += 1;
              newCoins += receivermap[c];
              let temp = { coins: newCoins, [sender.user_id]: userData, data: data };
              return transaction.update(user2, temp);
            })
          })
        })
      })
  })