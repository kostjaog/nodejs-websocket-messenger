import admin from 'firebase-admin';

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: '',
    clientEmail: '',
    privateKey: '',
  }),
});

export const SendMessages = async (data: SendMessageTypes) => {
  await firebaseAdmin.messaging().sendEachForMulticast({
    tokens: data.deviceTokens,
    notification: data.notification,
  });
  return true;
};

interface SendMessageTypes {
  deviceTokens: string[];
  notification: {
    title: string;
    body: string;
  };
}
