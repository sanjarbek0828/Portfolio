import { addDoc, collection, increment, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function trackEvent(name: string, metadata: Record<string, string | number | boolean> = {}) {
  try {
    await addDoc(collection(db, "analytics_events"), { name, metadata, createdAt: serverTimestamp() });
  } catch {
    // Analytics must never interrupt the user experience.
  }
}

export async function trackPageView(path: string) {
  try {
    await Promise.all([
      setDoc(doc(db, "analytics", "views"), { count: increment(1), updatedAt: serverTimestamp() }, { merge: true }),
      addDoc(collection(db, "analytics_events"), { name: "page_view", metadata: { path }, createdAt: serverTimestamp() }),
    ]);
  } catch {
    // Analytics is best-effort when Firebase rules or connectivity are unavailable.
  }
}
