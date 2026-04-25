import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseconfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  // ✅ AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            setHistory(data.history || []);
            setSubscriptions(data.subscriptions || []);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setUser(null);
        setHistory([]);
        setSubscriptions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ ADD TO HISTORY
  const addToHistory = async (video) => {
    if (!user) return;

    const updated = [
      video,
      ...history.filter((v) => v.id.videoId !== video.id.videoId),
    ];

    setHistory(updated);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        history: updated,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SUBSCRIBE (🔥 FINAL FIX — NO FREEZE EVER)
  const subscribe = async (channel) => {
    if (!user || !channel || subLoading) return;

    setSubLoading(true);

    // ✅ 1. UPDATE UI IMMEDIATELY (NO BLOCK)
    let updated;
    setSubscriptions((prev) => {
      if (prev.includes(channel)) {
        updated = prev.filter((c) => c !== channel);
        return updated;
      } else {
        updated = [...prev, channel];
        return updated;
      }
    });

    // ✅ 2. FIRESTORE UPDATE (NON-BLOCKING)
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          subscriptions: updated,
        });
      } catch (err) {
        console.error("Firestore error:", err);
      }
    }, 0);

    setSubLoading(false);
  };

  // ✅ LOGOUT
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setHistory([]);
    setSubscriptions([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        history,
        subscriptions,
        addToHistory,
        subscribe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};