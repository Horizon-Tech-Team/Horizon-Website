// "use client";

// import { getCurrentUserClient } from "@/lib/auth";
// import { AuthProvider } from "../app/AuthProvider";
// import { useEffect, useState } from "react";
// import type { User } from "../app/AuthProvider";

// function ClientProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data } = await getCurrentUserClient();
//       setUser(data ?? null);
//       setLoading(false);
//     };

//     fetchUser();
//   }, []);

//   if (loading) return null; // or a loading spinner

//   return <AuthProvider userFromServer={user}>{children}</AuthProvider>;
// }

// export default ClientProvider;
