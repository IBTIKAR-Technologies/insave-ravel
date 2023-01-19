exports = async function (changeEvent) {
  const docId = changeEvent.documentKey._id;
  const { fullDocument } = changeEvent;
  const collection = context.services.get("mongodb-atlas").db("ravelinsave").collection("persons");
  const collectionUser = context.services.get("mongodb-atlas").db("ravelinsave").collection("users");
  if (!fullDocument.syncedAt) {
    console.log("docId", docId);
    collection.updateOne({ _id: docId }, { $set: { syncedAt: new Date() } });
  }
  if (fullDocument.createdById) {
    const count = await collection.count({ createdById: fullDocument.createdById });
    collectionUser.updateOne({ _id: fullDocument.createdById }, { $set: { addedCount: count } });
    if (fullDocument.categorie) {
      // get acteur1Id
      const user = await collectionUser.findOne({ _id: fullDocument.createdById });
      let acteur1Id;
      if (user?.role === "actniv1") {
        acteur1Id = user?._id;
      } else if (user?.role === "actniv2") {
        acteur1Id = user?.createdById;
      } else {
        const acteur2Id = user?.createdById;
        const acteur2 = await collectionUser.findOne({ _id: acteur2Id });
        acteur1Id = acteur2.createdById;
      }

      let recCount = 0;

      const acteur1 = await collectionUser.findOne({ _id: acteur1Id });
      const sumAct1Added = acteur1.addedCount;
      if (fullDocument.categorie !== "parti") {
        recCount += sumAct1Added;
      }
      const acteurs2 = await (await collectionUser.find({ createdById: acteur1Id, role: "actniv2" })).toArray();

      const sumAct2Added = acteurs2.reduce((acc, obj) => (acc + obj.addedCount), 0);
      if (fullDocument.categorie !== "parti") {
        recCount += sumAct2Added;
      }
      for (let i = 0; i < acteurs2.length; i++) {
        const acteur2 = acteurs2[i];
        const acteurs3 = await (await collectionUser.find({ createdById: acteur2._id, role: "actniv3" })).toArray();
        const sumAct3Added = acteurs3.reduce((acc, obj) => (acc + obj.addedCount), 0);
        recCount += sumAct3Added;
        let recCountAct2 = sumAct3Added;
        if (fullDocument.categorie !== "parti") {
          recCountAct2 += acteur2.addedCount;
        }
        collectionUser.updateOne({ _id: acteur2._id }, { $set: { recCount: recCountAct2 } });
      }
      collectionUser.updateOne({ _id: acteur1Id }, { $set: { recCount } });
    }
  }
};
