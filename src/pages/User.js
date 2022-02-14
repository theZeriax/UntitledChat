// import { collection, doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "./Home";

// const User = () => {
//   const [data, setData] = useState("");

//   useEffect(() => {
//     if (data) {
//       console.info("Data", data);
//       const usernameRef = doc(
//         collection(db, "usernames"),
//         "some_uid"
//       );

//       getDoc(usernameRef).then((u) => {
//         console.info("user", u, "data", u.data);
//         setData(u);
//       });
//     }
//   }, [data]);

//   return (
//     <div>
//       <p>{data}</p>
//     </div>
//   );
// };

// export default User;
