export function getEventData(dbRef) {
  return new Promise((resolve, reject) => {
    const onError = (error) => reject(error);
    const onSuccess = (snapshot) => resolve(snapshot.val());

    dbRef.on('value', onSuccess, onError);
  });
};