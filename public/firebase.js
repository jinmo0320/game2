async function setUp() {
  const firebaseConfig = await fetch("../firebase_config.json").then((res) =>
    res.json()
  );
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}
setUp();
