/* NOVA SYSTEM: EncryptX v3.5 - Complete System
   STRUCTURE:
   1. Imports & Config
   2. Theme Engine
   3. Utils & Helpers
   4. Main Component (EncryptX)
      - State Management
      - Logic & Handlers
      - Render: Auth Screen
      - Render: Sidebar (Contacts/Groups)
      - Render: Main Chat Interface
      - Render: Modals (Profile, Search, etc.)
*/

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  User, Search, Send, Hash, LogOut, Lock, Shield, Settings, X, 
  Camera, Image as ImageIcon, FileText, Smile, Play, Pause, 
  Clock, Pin, MoreVertical, Upload, Mic, Paperclip, Check, Slash, Key,
  CheckCheck, MoreHorizontal, Reply, Trash2, Copy, Forward, Edit2, Plus,
  Circle, Activity, ArrowLeft, MessageSquare, Calendar, Users, PlusCircle, ImagePlus, UserMinus, UserPlus, AlertTriangle, RefreshCw, Share2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore';

// ==========================================
// PART 1: CONFIGURATION & THEMES
// ==========================================

const THEME_PRESETS = [
  {
    id: 'neon',
    name: 'Neon Operator',
    type: 'hacker',
    bg: "bg-[#0f0f13]",
    bgImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
    sidebar: "bg-[#1a1b26]/90 backdrop-blur",
    accent: "text-[#00e5ff]",
    accentBg: "bg-[#00e5ff]",
    text: "text-white",
    inputBg: "bg-[#14141b]/80",
    border: "border-[#00e5ff]",
    bubbleMe: "bg-[#00e5ff]/20 border border-[#00e5ff]/50 text-cyan-50",
    bubbleOther: "bg-[#1a1b26]/80 border border-gray-700 text-gray-200"
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    type: 'hacker',
    bg: "bg-black",
    bgImage: "url('https://www.transparenttextures.com/patterns/binary-code.png')",
    sidebar: "bg-[#001a00]/90 backdrop-blur",
    accent: "text-[#00ff41]",
    accentBg: "bg-[#00ff41]",
    text: "text-[#e0ffe4]",
    inputBg: "bg-[#002200]/80",
    border: "border-[#00ff41]",
    bubbleMe: "bg-[#003b00]/60 border border-[#00ff41] text-[#00ff41]",
    bubbleOther: "bg-[#0d0d0d]/80 border border-[#008f11] text-[#008f11]"
  },
  {
    id: 'obsidian',
    name: 'Obsidian Black',
    type: 'clean',
    bg: "bg-black",
    bgImage: "none",
    sidebar: "bg-[#121212]",
    accent: "text-white",
    accentBg: "bg-white",
    text: "text-gray-300",
    inputBg: "bg-[#1e1e1e]",
    border: "border-gray-700",
    bubbleMe: "bg-white text-black",
    bubbleOther: "bg-[#1e1e1e] border border-gray-800 text-gray-400"
  },
  {
    id: 'arctic',
    name: 'Arctic Protocol',
    type: 'clean',
    bg: "bg-[#f8fafc]",
    bgImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
    sidebar: "bg-[#e2e8f0]/90 backdrop-blur",
    accent: "text-[#0ea5e9]",
    accentBg: "bg-[#0ea5e9]",
    text: "text-[#0f172a]",
    inputBg: "bg-white/90",
    border: "border-[#0ea5e9]",
    bubbleMe: "bg-[#0ea5e9] text-white shadow-md",
    bubbleOther: "bg-white/90 border border-slate-200 text-slate-700 shadow-sm"
  }
];

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Bot1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Bot2",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Anon",
  "https://api.dicebear.com/7.x/micah/svg?seed=Agent",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Hacker",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Explorer",
  "https://api.dicebear.com/7.x/big-ears/svg?seed=Listener",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Happy",
  "https://api.dicebear.com/7.x/croodles/svg?seed=Art",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Mystery"
];

const STATIC_EMOJI_CATEGORIES = {
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕"],
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😎", "🤩", "🥳", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "🤔", "🫣", "🤭", "🫡", "🤫", "🫠", "🤥", "😶", "🫥", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "😴", "🤤", "😪", "😵", "😵‍💫", "🫨", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖"],
  "Hand": ["👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪"]
};

const NOTIFY_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3";

// --- FIREBASE SETUP ---
// REPLACE THIS OBJECT WITH YOUR OWN FIREBASE CONFIG FROM THE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyD300-8ITn24Zexmn5gUm8VmmeAhq9QfDY",
  authDomain: "encryptx-web-0721.firebaseapp.com",
  databaseURL: "https://encryptx-web-0721-default-rtdb.firebaseio.com",
  projectId: "encryptx-web-0721",
  storageBucket: "encryptx-web-0721.firebasestorage.app",
  messagingSenderId: "771793909250",
  appId: "1:771793909250:web:ec538753ceaa5fa163191b",
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase Init Error:", e);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'encryptx-local-dev';

// --- UTILS ---
const formatChatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ==========================================
// PART 2: MAIN APPLICATION COMPONENT
// ==========================================

export default function EncryptX() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState({ id: 'global', name: 'E2EE enable', type: 'global' });
  const [inputText, setInputText] = useState("");
  const [currentTheme, setCurrentTheme] = useState(THEME_PRESETS[0]);
  
  // UI State
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsView, setSettingsView] = useState('profile');
  const [showAddContact, setShowAddContact] = useState(false); 
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  
  // Responsive State
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  // Forwarding State
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [msgToForward, setMsgToForward] = useState(null);

  // Interaction State
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [recentEmojis, setRecentEmojis] = useState(() => {
      const saved = localStorage.getItem('encryptx_recent_emojis');
      return saved ? JSON.parse(saved) : ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "👀"];
  });

  // Blink State
  const [blinkingId, setBlinkingId] = useState(null);

  // Rich Media & Actions
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("Quick");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [autoDeleteTimer, setAutoDeleteTimer] = useState(null); 
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [pinnedMessageId, setPinnedMessageId] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  
  // Profile & Theme Edit
  const [editBio, setEditBio] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [editStatus, setEditStatus] = useState("Online"); 
  const [editAvatar, setEditAvatar] = useState("");
  const [customImageLoading, setCustomImageLoading] = useState(false);
  
  // Group Admin State
  const [memberAddQuery, setMemberAddQuery] = useState("");
  const [deleteKeyInput, setDeleteKeyInput] = useState("");

  // Auth State
  const [authMode, setAuthMode] = useState('login');
  const [authUsername, setAuthUsername] = useState("");
  const [authUniqueId, setAuthUniqueId] = useState(""); 
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const chatEndRef = useRef(null);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const notificationAudio = useRef(new Audio(NOTIFY_SOUND_URL));
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const themeInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputAreaRef = useRef(null);

  // --- LOGIC: BLINK ENGINE ---
  const triggerBlink = (id) => {
      setBlinkingId(id);
      setTimeout(() => setBlinkingId(null), 250); // 250ms visual flash
  };

  const getBlinkClass = (id) => {
      return blinkingId === id ? "ring-2 ring-white bg-white/20 scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-100" : "transition-all duration-300";
  };

  // --- LOGIC: INITIALIZATION ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
      } catch (e) {
          console.error("Auth Init Error:", e);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, (user) => setFirebaseUser(user));
  }, []);

  // --- LOGIC: DATA LISTENERS ---
  useEffect(() => {
    if (!appUser || !firebaseUser || !db) return;

    const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', appUser.id);
    const updatePresence = () => {
        updateDoc(userDocRef, { lastActive: serverTimestamp(), isOnline: true }).catch(() => {});
    };
    updatePresence();
    const heartbeat = setInterval(updatePresence, 60000);

    const typingRef = collection(db, 'artifacts', appId, 'public', 'data', 'typing');
    const unsubTyping = onSnapshot(typingRef, (snapshot) => {
        const now = Date.now();
        const activeTypers = snapshot.docs
            .map(d => ({id: d.id, ...d.data()}))
            .filter(t => t.user !== appUser.username && (now - (t.timestamp?.toMillis() || 0) < 3000) && t.channel === activeChat.id)
            .map(t => t.nickname || t.user);
        setTypingUsers(activeTypers);
    });

    const unsubUser = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            setAppUser(prev => ({ ...prev, ...data }));
            if (data.blocked_users) setBlockedUsers(data.blocked_users);
        }
    });

    const msgsRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    const unsubMsg = onSnapshot(msgsRef, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const now = Date.now();
      
      const processedMsgs = msgs
        .filter(m => {
            if (blockedUsers.includes(m.userId)) return false;
            if (m.expiresAt && m.expiresAt.toMillis() <= now) return false;
            return true;
        })
        .map(msg => ({
            ...msg,
            sortTime: msg.timestamp?.toMillis ? msg.timestamp.toMillis() : (msg.createdAt || Date.now())
        }))
        .sort((a, b) => a.sortTime - b.sortTime);

      const pinned = processedMsgs.find(m => m.isPinned && (m.channelId === activeChat.id || (!m.channelId && activeChat.id === 'global')));
      setPinnedMessageId(pinned ? pinned.id : null);

      snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
              const msgData = change.doc.data();
              if (msgData.user !== appUser.username && msgData.type !== 'system') { // Ignore system messages for sound
                  if (Date.now() - (msgData.timestamp?.toMillis() || 0) < 5000) {
                     notificationAudio.current.play().catch(() => {});
                  }
                  if (activeChat.id === (msgData.channelId || 'global')) {
                      if (!msgData.read_by?.includes(appUser.id)) {
                          updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', change.doc.id), {
                              read_by: [...(msgData.read_by || []), appUser.id]
                          });
                      }
                  }
              }
          }
      });
      setMessages(processedMsgs);
    }, (err) => console.error("Msg Error:", err));

    const groupsRef = collection(db, 'artifacts', appId, 'public', 'data', 'groups');
    const unsubGroups = onSnapshot(groupsRef, (snapshot) => {
        const allGroups = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
        const myGroups = allGroups.filter(g => g.members?.includes(appUser.id) && !g.isSoftDeleted);
        setGroups(myGroups);
    });

    const contactsRef = collection(db, 'artifacts', appId, 'public', 'data', 'contacts');
    const unsubContacts = onSnapshot(contactsRef, (snapshot) => {
      const allContacts = snapshot.docs.map(doc => doc.data());
      const myContacts = allContacts.filter(c => c.owner_username === appUser.username);
      setContacts(myContacts);
    });

    return () => {
      unsubMsg(); unsubContacts(); unsubUser(); unsubTyping(); unsubGroups();
      clearInterval(heartbeat);
      updateDoc(userDocRef, { isOnline: false }).catch(() => {});
    };
  }, [appUser?.id, firebaseUser, blockedUsers, activeChat.id]);

  // Scroll
  useLayoutEffect(() => {
     if (!selectedMsg && !editingMsgId) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedMsg, editingMsgId, activeChat.id, showMobileChat]); 

  useEffect(() => {
    if (isRecording) timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    else { clearInterval(timerRef.current); setRecordingTime(0); }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (selectedMsg && !e.target.closest('button') && !e.target.closest('.message-bubble')) setSelectedMsg(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedMsg]);

  // --- LOGIC: HELPER FUNCTIONS ---
  const updateEmojiPreferences = (emoji) => {
      setRecentEmojis(prev => {
          const filtered = prev.filter(e => e !== emoji);
          const newArr = [emoji, ...filtered].slice(0, 20);
          localStorage.setItem('encryptx_recent_emojis', JSON.stringify(newArr));
          return newArr;
      });
  };

  const handleTypingInput = (e) => {
    setInputText(e.target.value);
    if (!appUser || !db) return;
    const typingDoc = doc(db, 'artifacts', appId, 'public', 'data', 'typing', appUser.id);
    setDoc(typingDoc, { 
        user: appUser.username, nickname: appUser.nickname, channel: activeChat.id, timestamp: serverTimestamp() 
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleAuth = async () => {
    triggerBlink('auth-btn'); // Trigger Blink
    if (!authUsername || !authPassword) { setAuthError("Please fill in Username and Password."); return; }
    if (authMode === 'register' && !/^\d{5}$/.test(authUniqueId)) { setAuthError("Security ID must be exactly 5 digits (0-9)."); return; }
    setAuthError("");

    try {
        if (!db) throw new Error("Database not connected");
        const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
        const snap = await getDocs(usersRef);
        const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (authMode === 'register') {
            if (users.find(u => u.username === authUsername)) { setAuthError("Username taken."); return; }
            if (users.find(u => u.unique_id === authUniqueId)) { setAuthError("ID already exists."); return; }

            const newUser = {
                username: authUsername, password: authPassword, unique_id: authUniqueId,
                bio: "Available", nickname: authUsername, profile_pic: AVATARS[Math.floor(Math.random() * AVATARS.length)],
                blocked_users: [], status_msg: "Online", isOnline: true, created: serverTimestamp()
            };
            const ref = await addDoc(usersRef, newUser);
            setAppUser({ id: ref.id, ...newUser });
        } else {
            const foundUser = users.find(u => u.username === authUsername && u.password === authPassword);
            if (!foundUser) setAuthError("Invalid credentials.");
            else setAppUser(foundUser);
        }
    } catch (error) { setAuthError("Connection error."); }
  };

  const openProfile = () => {
    setEditBio(appUser.bio || ""); setEditNickname(appUser.nickname || appUser.username);
    setEditStatus(appUser.status_msg || "Online"); setEditAvatar(appUser.profile_pic || AVATARS[0]);
    setSettingsView('profile'); setIsProfileOpen(true);
  };

  const saveProfile = async () => {
    if (!appUser || !appUser.id) return;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', appUser.id), {
        bio: editBio, nickname: editNickname, profile_pic: editAvatar, status_msg: editStatus
    });
    setIsProfileOpen(false);
  };

  const handleThemeUpload = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
          const customTheme = {
              id: 'custom',
              name: 'Custom Theme', type: 'personal',
              bg: 'bg-black', bgImage: `url('${reader.result}')`,
              sidebar: 'bg-black/80 backdrop-blur', accent: 'text-white', accentBg: 'bg-white',
              text: 'text-gray-200', inputBg: 'bg-white/10', border: 'border-white/20',
              bubbleMe: 'bg-white/20 backdrop-blur border border-white/30 text-white',
              bubbleOther: 'bg-black/60 backdrop-blur border border-white/10 text-gray-300'
          };
          setCurrentTheme(customTheme);
      };
      reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    triggerBlink('locate-btn'); // Trigger Blink
    if (!searchQuery) return;
    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
    
    // Optimised Search: Try specific queries first
    let found = null;
    
    // 1. Search by unique_id (Fastest)
    try {
        const qId = query(usersRef, where('unique_id', '==', searchQuery));
        const snapId = await getDocs(qId);
        if (!snapId.empty) found = snapId.docs[0].data();
    } catch (e) { console.log("Index query failed, falling back"); }

    // 2. Search by username if no ID match
    if (!found) {
        try {
            const qUser = query(usersRef, where('username', '==', searchQuery));
            const snapUser = await getDocs(qUser);
            if (!snapUser.empty) found = snapUser.docs[0].data();
        } catch (e) { console.log("Index query failed"); }
    }

    // 3. Fallback to client-side filter (if indexes missing)
    if (!found) {
        const snap = await getDocs(usersRef);
        const users = snap.docs.map(d => d.data());
        found = users.find(u => u.unique_id === searchQuery) || users.find(u => u.username === searchQuery);
    }

    if (found) setSearchResult(found);
    else alert("User not found."); 
  };

  const addContact = async () => {
    if (!searchResult) return;
    const exists = contacts.find(c => c.contact_unique_id === searchResult.unique_id);
    if (exists) { alert("Already in contacts."); return; }
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'contacts'), {
      owner_username: appUser.username, contact_username: searchResult.username,
      contact_unique_id: searchResult.unique_id, contact_nickname: searchResult.nickname
    });
    setSearchResult(null); setShowAddContact(false); setSearchQuery("");
  };

  // --- LOGIC: ADVANCED GROUP MANAGEMENT ---
  const addSystemMessage = async (channelId, text) => {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
          text: text, type: 'system', channelId: channelId, timestamp: serverTimestamp(), read_by: []
      });
  };

  const rotateGroupKey = async (groupId) => {
      const newKey = 'AES-' + Math.random().toString(36).substr(2, 12).toUpperCase();
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'groups', groupId), { encryptionKey: newKey });
  };

  const createGroup = async () => {
      if (!newGroupName.trim()) return;
      const encKey = 'AES-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '-' + Date.now();
      const delKey = 'DEL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const groupRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'groups'), {
          name: newGroupName, createdBy: appUser.id, ownerId: appUser.id,
          admins: [appUser.id], members: [appUser.id], createdAt: serverTimestamp(), type: 'group',
          encryptionKey: encKey, deletionKey: delKey, isSoftDeleted: false
      });
      addSystemMessage(groupRef.id, `Group created by ${appUser.nickname}. Keys generated.`);
      setNewGroupName(""); setShowCreateGroup(false);
      alert(`GROUP SECURE KEYS:\n\nDeletion Key: ${delKey}\n\nSAVE THIS KEY! OWNER EYES ONLY.`);
  };

  const handleAddMember = async () => {
     if(!memberAddQuery) return;
     const group = groups.find(g => g.id === activeChat.id);
     if (!group.admins.includes(appUser.id)) { alert("Admins only."); return; }
     if (group.members.length >= 12) { alert("Group full (Max 12)."); return; }

     const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
     const snap = await getDocs(usersRef);
     const users = snap.docs.map(d => ({id: d.id, ...d.data()}));
     const foundUser = users.find(u => u.unique_id === memberAddQuery);

     if(foundUser) {
         if(group.members.includes(foundUser.id)) { alert("User already in group."); return; }
         const updatedMembers = [...group.members, foundUser.id];
         await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'groups', group.id), { members: updatedMembers });
         await rotateGroupKey(group.id);
         await addSystemMessage(group.id, `${foundUser.nickname} added. Keys rotated.`);
         setMemberAddQuery("");
     } else {
         alert("User ID not found.");
     }
  };

  const handleKickMember = async (memberId) => {
     const group = groups.find(g => g.id === activeChat.id);
     if (!group.admins.includes(appUser.id)) return;
     const updatedMembers = group.members.filter(m => m !== memberId);
     await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'groups', group.id), { members: updatedMembers });
     await rotateGroupKey(group.id);
     await addSystemMessage(group.id, `Member removed. Keys rotated.`);
  };

  const handleLeaveGroup = async () => {
      if(!window.confirm("Leave this group?")) return;
      const group = groups.find(g => g.id === activeChat.id);
      const updatedMembers = group.members.filter(m => m !== appUser.id);
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'groups', group.id), { members: updatedMembers });
      await rotateGroupKey(group.id);
      await addSystemMessage(group.id, `${appUser.nickname} left. Keys rotated.`);
      setActiveChat({ id: 'global', name: 'E2EE enable', type: 'global' });
      setShowMobileChat(false); // Go back to list on leave
      setShowGroupSettings(false);
  };

  const handleDeleteGroup = async (type) => {
      const group = groups.find(g => g.id === activeChat.id);
      if (group.ownerId !== appUser.id) { alert("Owner only."); return; }
      if (deleteKeyInput !== group.deletionKey) { alert("Invalid Deletion Key."); return; }

      if (type === 'soft') {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'groups', group.id), { isSoftDeleted: true });
          alert("Group hidden.");
      } else {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'groups', group.id));
          alert("Group destroyed.");
      }
      setActiveChat({ id: 'global', name: 'E2EE enable', type: 'global' });
      setShowMobileChat(false); // Go back to list
      setShowGroupSettings(false);
  };

  // --- LOGIC: MESSAGING ---
  const submitMessage = async (e, type = 'text', content = null, targetChannelId = null) => {
    if (e) e.preventDefault();
    if (type === 'text') triggerBlink('send-btn'); // Trigger Blink

    const msgContent = content || inputText.trim();
    if (!msgContent && type === 'text') return;
    
    // If forwarding (targetChannelId is present), don't clear main input or edit states
    const isForwarding = !!targetChannelId;
    const docIdToEdit = isForwarding ? null : editingMsgId;
    const replyContext = isForwarding ? null : (replyTo ? { id: replyTo.id, user: replyTo.user, text: replyTo.text || "[Media]" } : null);
    const destinationId = targetChannelId || activeChat.id;

    if (!isForwarding) {
        setInputText(""); setReplyTo(null); setEditingMsgId(null); closeMenus();
        if (inputAreaRef.current) inputAreaRef.current.focus();
    }
    
    try {
        if (docIdToEdit) {
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', docIdToEdit), {
                text: msgContent, content: msgContent, isEdited: true
            });
            return;
        }
        let expiresAt = null;
        if (autoDeleteTimer) {
            const now = new Date();
            now.setSeconds(now.getSeconds() + autoDeleteTimer);
            expiresAt = now;
        }
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
          user: appUser.username, userId: appUser.id, nickname: appUser.nickname,
          text: type === 'text' ? msgContent : '', content: msgContent, type: type,
          timestamp: serverTimestamp(), createdAt: Date.now(), expiresAt: expiresAt, 
          isPinned: false, read_by: [appUser.id], reactions: {}, replyTo: replyContext,
          channelId: destinationId
        });
        
        if (isForwarding) {
            alert("Message Forwarded!");
            setShowForwardModal(false);
            setMsgToForward(null);
        }

    } catch (err) { console.error("Transmission failed:", err); }
  };

  const handleForward = (targetChannelId) => {
      if (!msgToForward) return;
      submitMessage(null, msgToForward.type, msgToForward.content || msgToForward.text, targetChannelId);
  };

  const handleAction = async (action) => {
      if (!selectedMsg || !db) return;
      const msgId = selectedMsg.id; 
      const isOwner = selectedMsg.userId === appUser.id;
      
      if (action !== 'reply' && action !== 'edit' && action !== 'forward') setSelectedMsg(null);

      switch(action) {
          case 'reply': 
              setReplyTo(selectedMsg); setSelectedMsg(null); setTimeout(() => inputAreaRef.current?.focus(), 10); break;
          case 'edit': 
              if (!isOwner) { alert("Access Denied."); return; } setEditingMsgId(msgId); setInputText(selectedMsg.text || ""); setSelectedMsg(null); setTimeout(() => inputAreaRef.current?.focus(), 10); break;
          case 'copy': 
              navigator.clipboard.writeText(selectedMsg.text || selectedMsg.content); alert("Copied."); break;
          case 'delete':
              if (!isOwner) { alert("Only sender can delete."); return; }
              setMessages(prev => prev.filter(m => m.id !== msgId));
              try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId)); } catch (err) { console.error("Delete failed:", err); }
              break;
          case 'forward':
              setMsgToForward(selectedMsg);
              setShowForwardModal(true);
              setSelectedMsg(null);
              break;
      }
  };

  const handleReaction = async (msgId, emoji, currentReactions = {}) => {
      if (!appUser) return;
      updateEmojiPreferences(emoji);
      const reactions = { ...currentReactions };
      if (reactions[emoji]?.includes(appUser.id)) {
          reactions[emoji] = reactions[emoji].filter(id => id !== appUser.id);
          if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
          if (!reactions[emoji]) reactions[emoji] = [];
          reactions[emoji].push(appUser.id);
      }
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId), { reactions });
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') { setEditAvatar(reader.result); setCustomImageLoading(false); }
      else if (type === 'image') submitMessage(null, 'image', reader.result);
      else if (type === 'file') submitMessage(null, 'file', file.name);
    };
    if (type === 'profile') setCustomImageLoading(true);
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("Camera access denied."); setShowCamera(false); }
  };
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    submitMessage(null, 'image', canvas.toDataURL("image/jpeg"));
    setShowCamera(false);
    if(videoRef.current.srcObject) videoRef.current.srcObject.getTracks().forEach(t=>t.stop());
  };
  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorderRef.current.onstop = () => {
            const reader = new FileReader();
            reader.readAsDataURL(new Blob(audioChunksRef.current, { type: 'audio/webm' })); 
            reader.onloadend = () => submitMessage(null, 'audio', reader.result);
            stream.getTracks().forEach(t => t.stop());
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) { alert("Mic access denied."); }
  };
  const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); };
  const toggleRecording = () => isRecording ? stopRecording() : startRecording();
  const closeMenus = () => { setShowEmojiPicker(false); setShowAttachMenu(false); setShowTimerMenu(false); setShowAddContact(false); };

  // --- SUB-COMPONENTS ---
  const DateSeparator = ({ timestamp }) => (
      <div className="flex justify-center my-4">
          <div className="bg-black/40 backdrop-blur border border-white/5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 shadow-sm flex items-center gap-1.5">
              <Calendar className="w-3 h-3 opacity-60" /> {formatChatDate(timestamp)}
          </div>
      </div>
  );

  const MessageBubble = ({ msg, isMe, isFirstInGroup, isMiddleInGroup, isLastInGroup }) => {
    if (msg.type === 'system') {
        return <div className="text-center text-[10px] opacity-40 my-2 italic font-mono tracking-wide">{msg.text}</div>;
    }

    const type = msg.type || 'text';
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const isSelected = selectedMsg?.id === msg.id;
    const longPressTimer = useRef(null);
    const imgRef = useRef(null);
    const handleImageLoad = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const startPress = () => { longPressTimer.current = setTimeout(() => { setSelectedMsg(msg); if ('vibrate' in navigator) navigator.vibrate(50); }, 500); };
    const cancelPress = () => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; } };

    useEffect(() => {
        if (type === 'audio' && audioRef.current) {
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
            audioRef.current.onended = () => setIsPlaying(false);
        }
    }, [isPlaying]);

    const renderContent = () => {
        switch(type) {
            case 'image': return <img ref={imgRef} onLoad={handleImageLoad} src={msg.content} className="max-w-full rounded-lg max-h-60 object-cover" />;
            case 'file': return <div className="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5"><FileText className="w-6 h-6 text-blue-400"/><div className="text-xs truncate max-w-[150px]">{msg.content}</div></div>;
            case 'audio': return (
                <div className="flex items-center gap-2 min-w-[140px]">
                    <audio ref={audioRef} src={msg.content} />
                    <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 rounded-full ${currentTheme.accentBg} text-black`}><Play className="w-3 h-3"/></button>
                    <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full bg-white transition-all`} style={{width: isPlaying ? '100%' : '0%', transitionDuration: '10s'}}></div></div>
                </div>
            );
            default: return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{msg.text || msg.content}</p>;
        }
    };
    
    const getCornerClasses = () => {
        if (isSelected) return 'rounded-2xl'; 
        if (isFirstInGroup && isLastInGroup) return 'rounded-2xl';
        if (isMe) {
            if (isFirstInGroup) return 'rounded-2xl rounded-br-sm'; 
            if (isMiddleInGroup) return 'rounded-l-2xl rounded-r-sm'; 
            if (isLastInGroup) return 'rounded-2xl rounded-tr-sm'; 
        } else {
            if (isFirstInGroup) return 'rounded-2xl rounded-bl-sm';
            if (isMiddleInGroup) return 'rounded-r-2xl rounded-l-sm';
            if (isLastInGroup) return 'rounded-2xl rounded-tl-sm';
        }
        return 'rounded-2xl'; 
    };

    return (
      <div 
        className={`flex flex-col ${isLastInGroup ? 'mb-4' : 'mb-[2px]'} group/bubble relative ${isMe ? 'items-end' : 'items-start'} message-bubble transition-all duration-300 ${isSelected ? 'scale-[1.02] z-20' : ''}`}
        onTouchStart={startPress} onTouchEnd={cancelPress} onTouchMove={cancelPress} 
        onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
        onContextMenu={(e) => { e.preventDefault(); setSelectedMsg(msg); }}
      >
        {msg.replyTo && isFirstInGroup && <div className={`mb-1 text-[10px] opacity-60 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}><Reply className="w-3 h-3" /><span className="italic">Replying to {msg.replyTo.user}...</span></div>}
        <div className={`relative max-w-[85%] sm:max-w-[70%] flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 group/time`}>
            {isSelected && <div className={`absolute -top-12 ${isMe ? 'right-0' : 'left-0'} flex gap-1 bg-black/90 backdrop-blur-xl p-2 rounded-2xl border border-white/20 animate-in zoom-in-50 duration-200 z-50 shadow-2xl`}>{recentEmojis.slice(0, 5).map(emoji => (<button key={emoji} onClick={(e) => { e.stopPropagation(); handleReaction(msg.id, emoji, msg.reactions); }} className="hover:scale-125 transition-transform text-lg">{emoji}</button>))}</div>}
            <div className={`px-4 py-2 shadow-sm backdrop-blur-md relative transition-all duration-300 ${isSelected ? `ring-2 ring-offset-2 ring-offset-black ${currentTheme.border} bg-white/10 rounded-2xl` : `${getCornerClasses()} ${isMe ? currentTheme.bubbleMe : currentTheme.bubbleOther}`}`}>
                {renderContent()}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && <div className={`absolute -bottom-2 ${isMe ? 'left-0' : 'right-0'} flex bg-black/80 rounded-full px-1.5 py-0.5 border border-white/10 text-[9px] shadow-sm z-10`}>{Object.entries(msg.reactions).map(([emoji, users]) => (<span key={emoji} className="mx-0.5">{emoji} {users.length}</span>))}</div>}
            </div>
            <div className={`text-[9px] opacity-0 group-hover/time:opacity-50 transition-opacity whitespace-nowrap mb-2 ${isMe ? 'mr-1' : 'ml-1'}`}>{formatTime(msg.timestamp?.toMillis ? msg.timestamp.toMillis() : (msg.createdAt || Date.now()))}</div>
            {!isMe && <div className={`w-6 h-6 rounded-full overflow-hidden shrink-0 mb-0.5 ${!isLastInGroup ? 'opacity-0' : 'opacity-100'}`}>{isLastInGroup && <div className="w-full h-full bg-white/10 flex items-center justify-center text-[8px] font-bold">{msg.nickname ? msg.nickname[0] : '#'}</div>}</div>}
        </div>
        {isMe && isLastInGroup && <div className="text-[9px] opacity-40 flex items-center gap-1 mt-0.5 mr-1">{msg.read_by?.length > 1 ? <CheckCheck className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3" />}</div>}
      </div>
    );
  };

  const filteredMessages = messages.filter(m => (m.channelId || 'global') === activeChat.id);
  const renderMessageList = () => {
      const rendered = [];
      filteredMessages.forEach((msg, index) => {
        const msgTime = msg.sortTime;
        const prevMsg = filteredMessages[index - 1];
        const prevTime = prevMsg ? prevMsg.sortTime : 0;
        const isNewDay = index === 0 || new Date(msgTime).toDateString() !== new Date(prevTime).toDateString();
        if (isNewDay) rendered.push(<DateSeparator key={`date-${msg.id || index}`} timestamp={msgTime} />);
        
        const nextMsg = filteredMessages[index + 1];
        const nextTime = nextMsg ? nextMsg.sortTime : 0;
        const isSameUserAsPrev = prevMsg && prevMsg.user === msg.user && !isNewDay && prevMsg.type !== 'system' && msg.type !== 'system'; 
        const isSameUserAsNext = nextMsg && nextMsg.user === msg.user && (new Date(nextTime).toDateString() === new Date(msgTime).toDateString()) && nextMsg.type !== 'system';

        rendered.push(<MessageBubble key={msg.id} msg={msg} isMe={msg.user === appUser.username} isFirstInGroup={!isSameUserAsPrev} isMiddleInGroup={isSameUserAsPrev && isSameUserAsNext} isLastInGroup={!isSameUserAsNext} />);
      });
      return rendered;
  };

  // --- RENDER: LOGIN ---
  if (!appUser) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center font-sans relative`}>
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: currentTheme.bgImage }}></div>
        <div className={`w-full max-w-md p-8 rounded-2xl ${currentTheme.sidebar} border ${currentTheme.border} shadow-2xl relative overflow-hidden backdrop-blur-xl animate-in zoom-in duration-300`}>
          <div className="flex flex-col items-center mb-8"><Shield className={`w-20 h-20 ${currentTheme.accent} mb-4`} /><h1 className={`text-4xl font-bold tracking-tighter ${currentTheme.text}`}>EncryptX</h1><p className={`${currentTheme.accent} text-xs tracking-[0.3em] mt-1 opacity-80`}>SECURE PROTOCOL V3.5</p></div>
          {authError && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-sm flex items-center gap-2"><X className="w-4 h-4" /> {authError}</div>}
          <div className="space-y-4">
            <div className="relative group"><User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" /><input value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className={`w-full pl-12 pr-4 py-3 rounded-xl ${currentTheme.inputBg} ${currentTheme.text} border border-gray-700 focus:${currentTheme.border} outline-none`} placeholder="CODENAME" /></div>
            {authMode === 'register' && (<div className="relative group"><Key className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" /><input value={authUniqueId} onChange={(e) => setAuthUniqueId(e.target.value.replace(/\D/g, '').slice(0, 5))} className={`w-full pl-12 pr-4 py-3 rounded-xl ${currentTheme.inputBg} ${currentTheme.text} border border-gray-700 focus:${currentTheme.border} outline-none`} placeholder="5-DIGIT SECURE ID" /></div>)}
            <div className="relative group"><Hash className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" /><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className={`w-full pl-12 pr-4 py-3 rounded-xl ${currentTheme.inputBg} ${currentTheme.text} border border-gray-700 focus:${currentTheme.border} outline-none`} placeholder="ACCESS KEY" /></div>
            <button id="auth-btn" onClick={handleAuth} className={`w-full py-4 rounded-xl font-bold ${currentTheme.accentBg} text-black hover:opacity-90 transition-all mt-2 ${getBlinkClass('auth-btn')}`}>{authMode === 'login' ? 'INITIALIZE LINK' : 'ESTABLISH IDENTITY'}</button>
            <div className="flex justify-center mt-4"><button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(""); setAuthUniqueId(""); }} className={`text-xs text-gray-500 hover:${currentTheme.text} transition-colors`}>{authMode === 'login' ? 'NO IDENTITY? REGISTER' : 'IDENTITY EXISTS? LOGIN'}</button></div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN APP ---
  return (
    <div className={`flex h-screen ${currentTheme.bg} ${currentTheme.text} font-sans overflow-hidden transition-all duration-500`} style={{ backgroundImage: currentTheme.bgImage }}>
      <input type="file" ref={galleryInputRef} accept="image/*" className="hidden" onChange={(e) => { handleFileSelect(e, 'image'); setShowAttachMenu(false); }} />
      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { handleFileSelect(e, 'file'); setShowAttachMenu(false); }} />
      <input type="file" ref={profileInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'profile')} />
      <input type="file" ref={themeInputRef} accept="image/*" className="hidden" onChange={handleThemeUpload} />

      {/* SIDEBAR */}
      <div className={`w-full md:w-80 ${currentTheme.sidebar} flex flex-col border-r border-white/5 shadow-xl z-20 ${showMobileChat ? 'hidden' : 'flex'} md:flex`}>
        <div className={`p-6 border-b border-white/5 bg-black/10 flex items-center gap-3`}>
             <Shield className={`w-8 h-8 ${currentTheme.accent}`} />
             <div><h1 className="text-lg font-bold tracking-widest">EncryptX</h1><div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div><span className="text-[10px] opacity-60 tracking-wider">V3.5</span></div></div>
        </div>
        <div className="p-4 m-4 rounded-xl bg-black/20 border border-white/5 relative group">
            <button onClick={openProfile} className={`absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 text-gray-400 hover:text-white hover:${currentTheme.accentBg} hover:text-black transition-all opacity-0 group-hover:opacity-100`}><Settings className="w-3 h-3" /></button>
            <div className="flex items-center gap-3"><div className={`w-12 h-12 rounded-full border ${currentTheme.border} p-0.5 overflow-hidden`}><img src={appUser.profile_pic || AVATARS[0]} className="w-full h-full object-cover rounded-full" /></div><div className="flex-1 min-w-0"><div className="font-bold text-sm truncate">{appUser.nickname}</div><div className="text-[10px] opacity-60">ID: {appUser.unique_id}</div><div className="text-[10px] text-green-400 flex items-center gap-1 mt-0.5"><Circle className="w-1.5 h-1.5 fill-current"/> {appUser.status_msg || "Online"}</div></div></div>
        </div>
        <div onClick={() => { triggerBlink('global-chat'); setActiveChat({ id: 'global', name: 'E2EE enable', type: 'global' }); setShowMobileChat(true); }} className={`mx-4 p-3 rounded-lg flex items-center gap-3 cursor-pointer border ${activeChat.id === 'global' ? `${currentTheme.border} bg-white/5` : 'border-transparent hover:bg-white/5'} ${getBlinkClass('global-chat')}`}><div className={`w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center`}><Hash className="w-4 h-4 text-blue-400"/></div><div className="font-bold text-sm">E2EE enable</div></div>
        <div className="px-6 py-2 mt-4 text-[10px] opacity-50 font-bold uppercase tracking-[0.2em] flex justify-between items-center"><span>Groups</span><button onClick={() => setShowCreateGroup(!showCreateGroup)} className={`hover:${currentTheme.accent} transition-colors`}><Plus className="w-3 h-3"/></button></div>
        {showCreateGroup && (<div className="px-4 pb-2 animate-in slide-in-from-top-2"><div className="flex gap-1"><input autoFocus value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Group Name..." className={`flex-1 bg-black/40 border ${currentTheme.border} rounded text-xs p-2 outline-none`} /><button onClick={createGroup} className={`${currentTheme.accentBg} text-black p-2 rounded`}><Check className="w-3 h-3"/></button></div></div>)}
        <div className="flex-none overflow-y-auto px-4 space-y-1 pb-2 max-h-40 custom-scrollbar">
            {groups.map((group) => {
                const unread = messages.filter(m => m.channelId === group.id && !m.read_by.includes(appUser.id)).length;
                return (<div key={group.id} onClick={() => { triggerBlink(`group-${group.id}`); setActiveChat({ id: group.id, name: group.name, type: 'group' }); setShowMobileChat(true); }} className={`p-2 rounded-lg flex items-center gap-3 cursor-pointer border ${activeChat.id === group.id ? `${currentTheme.border} bg-white/5` : 'border-transparent hover:bg-white/5'} ${getBlinkClass(`group-${group.id}`)}`}><div className={`w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center relative`}><Users className="w-4 h-4 text-purple-400"/>{unread > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{unread}</div>}</div><div className="font-medium text-sm truncate flex-1">{group.name}</div></div>);
            })}
        </div>
        <div className="px-6 py-2 text-[10px] opacity-50 font-bold uppercase tracking-[0.2em] flex justify-between items-center group"><span>Contacts</span><span className="bg-white/10 px-1.5 rounded text-[9px]">{contacts.length}</span></div>
        <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-4 custom-scrollbar">
            {contacts.map((contact, idx) => (<div key={idx} onClick={() => { setActiveChat({ id: contact.unique_id, name: contact.contact_nickname || contact.contact_username, type: 'private' }); setShowMobileChat(true); }} className="p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer group flex items-center gap-3 border border-transparent hover:border-white/5"><div className={`w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shrink-0`}><User className="w-4 h-4 opacity-50" /></div><div className="overflow-hidden flex-1"><div className="font-medium text-sm group-hover:text-white truncate">{contact.contact_nickname || contact.contact_username}</div><div className="text-[10px] opacity-40 font-mono">ID: {contact.contact_unique_id}</div></div></div>))}
        </div>
        <div className="p-4 border-t border-white/5 space-y-3">
            <button id="connect-btn" onClick={() => { triggerBlink('connect-btn'); setShowAddContact(true); }} className={`w-full py-3 rounded-xl border ${currentTheme.border} ${currentTheme.accent} flex items-center justify-center gap-2 hover:bg-white/5 transition-all font-bold tracking-widest text-xs uppercase ${getBlinkClass('connect-btn')}`}><Search className="w-4 h-4" /> Connect via ID</button>
            <button onClick={() => setAppUser(null)} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-transparent text-red-500/70 hover:bg-red-950/20 hover:text-red-400 transition-colors text-xs uppercase font-bold tracking-wider"><LogOut className="w-3 h-3" /> Terminate Session</button>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className={`flex-1 flex flex-col relative ${showMobileChat ? 'flex' : 'hidden'} md:flex`} onClick={closeMenus}>
        <div className={`h-16 border-b border-white/5 flex items-center justify-between px-6 ${currentTheme.sidebar} sticky top-0 z-10 shadow-sm transition-all duration-300 ${selectedMsg ? 'bg-black/80' : ''}`}>
          {selectedMsg ? (
              <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4"><button onClick={() => setSelectedMsg(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5"/></button><div className="font-bold text-sm">1 Selected</div></div>
                  <div className="flex items-center gap-2">
                      <button onClick={() => handleAction('reply')} className="p-2 hover:bg-white/10 rounded-full flex flex-col items-center gap-0.5 group"><Reply className="w-4 h-4"/><span className="text-[9px] opacity-0 group-hover:opacity-100 absolute -bottom-2">Reply</span></button>
                      <button onClick={() => handleAction('copy')} className="p-2 hover:bg-white/10 rounded-full flex flex-col items-center gap-0.5 group"><Copy className="w-4 h-4"/><span className="text-[9px] opacity-0 group-hover:opacity-100 absolute -bottom-2">Copy</span></button>
                      <button onClick={() => handleAction('forward')} className="p-2 hover:bg-white/10 rounded-full flex flex-col items-center gap-0.5 group"><Share2 className="w-4 h-4"/><span className="text-[9px] opacity-0 group-hover:opacity-100 absolute -bottom-2">Forward</span></button>
                      {selectedMsg.userId === appUser.id && (
                          <><button onClick={() => handleAction('edit')} className="p-2 hover:bg-white/10 rounded-full flex flex-col items-center gap-0.5 group"><Edit2 className="w-4 h-4"/><span className="text-[9px] opacity-0 group-hover:opacity-100 absolute -bottom-2">Edit</span></button><button onClick={() => handleAction('delete')} className="p-2 hover:bg-red-900/30 text-red-400 rounded-full flex flex-col items-center gap-0.5 group"><Trash2 className="w-4 h-4"/><span className="text-[9px] opacity-0 group-hover:opacity-100 absolute -bottom-2">Delete</span></button></>
                      )}
                  </div>
              </div>
          ) : (
              <>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="md:hidden p-2 mr-1 hover:bg-white/10 rounded-full transition-colors" onClick={() => setShowMobileChat(false)}><ArrowLeft className="w-5 h-5" /></button>
                    <div className={`w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center border border-white/10 cursor-pointer`} onClick={() => activeChat.type === 'group' && setShowGroupSettings(true)}>
                        {activeChat.type === 'group' ? <Users className={`w-4 h-4 ${currentTheme.accent}`} /> : <Hash className={`w-4 h-4 ${currentTheme.accent}`} />}
                    </div>
                    <div className="cursor-pointer" onClick={() => activeChat.type === 'group' && setShowGroupSettings(true)}>
                        <div className="text-sm font-bold tracking-wide truncate max-w-[150px] sm:max-w-xs">{activeChat.name}</div>
                        <div className="text-[10px] opacity-50 flex items-center gap-1">{typingUsers.length > 0 ? (<span className={`${currentTheme.accent} animate-pulse flex items-center gap-1`}><Edit2 className="w-3 h-3" /> {typingUsers.join(', ')} is typing...</span>) : (<><Lock className="w-3 h-3" /> End-to-End Encryption</>)}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative"><button onClick={(e) => { e.stopPropagation(); setShowTimerMenu(!showTimerMenu); }} className={`p-2 rounded-full transition-colors ${autoDeleteTimer ? 'text-red-400 bg-red-900/20' : 'opacity-50 hover:opacity-100'}`}><Clock className="w-4 h-4" /></button>{showTimerMenu && (<div className={`absolute top-10 right-0 ${currentTheme.sidebar} border border-white/10 rounded-lg shadow-xl w-32 p-1 z-50`}>{[null, 10, 60, 3600].map(time => (<button key={time} onClick={() => setAutoDeleteTimer(time)} className="w-full text-left px-2 py-1.5 text-xs hover:bg-white/10 rounded">{time === null ? 'Auto-Delete Off' : `Delete in ${time < 60 ? time + 's' : time/60 + 'm'}`}</button>))}</div>)}</div>
                </div>
              </>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 relative z-0 custom-scrollbar">{pinnedMessageId && (<div className={`sticky top-0 z-10 ${currentTheme.sidebar} border-b ${currentTheme.border} p-2 mb-4 flex items-center justify-between rounded-lg shadow-lg`}><div className="flex items-center gap-2 text-xs"><Pin className={`w-3 h-3 ${currentTheme.accent}`} /><span className="font-bold">Pinned Message</span></div><button onClick={() => setPinnedMessageId(null)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3"/></button></div>)}{renderMessageList()}<div ref={chatEndRef} /></div>
        <div className={`p-4 md:p-6 ${currentTheme.sidebar} border-t border-white/5 z-10 relative`}>
          {(replyTo || editingMsgId) && (<div className="flex items-center justify-between bg-white/5 p-2 rounded-t-lg border-b border-white/5 text-xs mb-2 animate-in slide-in-from-bottom-2"><div className="flex items-center gap-2 opacity-70">{editingMsgId ? <Edit2 className="w-3 h-3 text-yellow-400" /> : <Reply className="w-3 h-3 text-blue-400" />}<span>{editingMsgId ? "Editing Message..." : `Replying to ${replyTo?.user}`}</span></div><button onClick={() => { setReplyTo(null); setEditingMsgId(null); setInputText(""); }}><X className="w-3 h-3" /></button></div>)}
          {showEmojiPicker && (<div className={`absolute bottom-24 left-6 ${currentTheme.sidebar} border border-white/10 rounded-xl shadow-2xl z-20 w-72 h-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5`} onClick={(e) => e.stopPropagation()}><div className="flex bg-black/20 p-2 overflow-x-auto gap-1 border-b border-white/5 hide-scrollbar">{["Quick", ...Object.keys(STATIC_EMOJI_CATEGORIES)].map(cat => (<button key={cat} onClick={() => setEmojiCategory(cat)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${emojiCategory === cat ? currentTheme.accent : 'text-gray-500'}`}>{cat}</button>))}</div><div className="flex-1 overflow-y-auto p-2 grid grid-cols-6 gap-1 custom-scrollbar content-start">{(emojiCategory === "Quick" ? recentEmojis : STATIC_EMOJI_CATEGORIES[emojiCategory]).map(e => (<button key={e} onClick={() => { setInputText(prev => prev + e); updateEmojiPreferences(e); }} className="text-xl hover:bg-white/10 rounded p-1">{e}</button>))}</div></div>)}
          {showAttachMenu && (<div className={`absolute bottom-24 left-16 ${currentTheme.sidebar} border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20 flex flex-col w-40`} onClick={(e) => e.stopPropagation()}><button onClick={() => galleryInputRef.current.click()} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-xs"><ImageIcon className="w-4 h-4" /> Gallery</button><button onClick={startCamera} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-xs"><Camera className="w-4 h-4" /> Camera</button><button onClick={() => fileInputRef.current.click()} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-xs"><FileText className="w-4 h-4" /> Document</button></div>)}
          <form onSubmit={(e) => submitMessage(e, 'text')} className="relative flex items-center gap-2"><button type="button" onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); setShowAttachMenu(false); }} className={`p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all`}><Smile className="w-5 h-5" /></button><button type="button" onClick={(e) => { e.stopPropagation(); setShowAttachMenu(!showAttachMenu); setShowEmojiPicker(false); }} className={`p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all`}><Paperclip className="w-5 h-5" /></button><div className="flex-1 relative"><input ref={inputAreaRef} type="text" value={inputText} onChange={handleTypingInput} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMessage(e); } }} className={`w-full px-4 py-3.5 rounded-xl ${currentTheme.inputBg} border ${currentTheme.border} focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] outline-none ${currentTheme.text} placeholder-gray-600 transition-all font-medium text-sm`} placeholder={isRecording ? "Listening..." : (editingMsgId ? "Edit your message..." : "Type a secure message...")} disabled={isRecording} />{isRecording && <div className="absolute right-3 top-3.5 text-red-500 animate-pulse flex items-center gap-2 text-xs font-mono"><div className="w-2 h-2 bg-red-500 rounded-full"></div>REC {recordingTime}s</div>}</div>{inputText.trim() ? (<button id="send-btn" type="submit" className={`p-3.5 rounded-xl ${editingMsgId ? 'bg-yellow-500 text-black' : `${currentTheme.accentBg} text-black`} hover:scale-105 hover:shadow-lg transition-all ${getBlinkClass('send-btn')}`}>{editingMsgId ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}</button>) : (<button type="button" onClick={toggleRecording} className={`p-3.5 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}><Mic className="w-5 h-5" /></button>)}</form>
        </div>
      </div>

      {/* --- GROUP SETTINGS MODAL --- */}
      {showGroupSettings && activeChat.type === 'group' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in zoom-in-95 duration-200">
              <div className={`w-full max-w-lg ${currentTheme.sidebar} border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]`}>
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30`}>
                              <Users className="w-5 h-5 text-purple-400"/>
                          </div>
                          <div>
                              <h2 className="text-xl font-bold">{activeChat.name}</h2>
                              <div className="text-xs opacity-50 flex items-center gap-1">
                                  <Lock className="w-3 h-3"/> Encrypted Group • {groups.find(g => g.id === activeChat.id)?.members.length}/12 Members
                              </div>
                          </div>
                      </div>
                      <button onClick={() => setShowGroupSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                  </div>

                  {/* Body */}
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                      {/* Members Section */}
                      <div className="space-y-3">
                          <div className="flex justify-between items-center">
                              <label className="text-xs font-bold uppercase tracking-widest opacity-50">Members</label>
                              <div className="text-xs opacity-50 font-mono">ID: {groups.find(g => g.id === activeChat.id)?.id.slice(0,8)}...</div>
                          </div>
                          
                          {/* Add Member Input */}
                          {groups.find(g => g.id === activeChat.id)?.admins.includes(appUser.id) && (
                              <div className="flex gap-2">
                                  <input value={memberAddQuery} onChange={(e) => setMemberAddQuery(e.target.value)} placeholder="Add member via 5-digit ID..." className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30" />
                                  <button onClick={handleAddMember} className={`${currentTheme.accentBg} text-black p-2 rounded-lg hover:opacity-90`}><UserPlus className="w-4 h-4"/></button>
                              </div>
                          )}

                          {/* Member List */}
                          <div className="space-y-2">
                              {groups.find(g => g.id === activeChat.id)?.members.map(memberId => {
                                  // Fetch member details (simulated by finding owner ID in this scope or generic)
                                  const isAdmin = groups.find(g => g.id === activeChat.id)?.admins.includes(memberId);
                                  const isOwner = groups.find(g => g.id === activeChat.id)?.ownerId === memberId;
                                  return (
                                      <div key={memberId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                          <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                                                  <User className="w-4 h-4 opacity-50"/>
                                              </div>
                                              <div>
                                                  <div className="text-sm font-bold flex items-center gap-2">
                                                      {memberId === appUser.id ? 'You' : 'Member'}
                                                      {isOwner && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 rounded border border-yellow-500/30">OWNER</span>}
                                                      {isAdmin && !isOwner && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 rounded border border-blue-500/30">ADMIN</span>}
                                                  </div>
                                                  <div className="text-[10px] opacity-40 font-mono">{memberId.slice(0, 12)}...</div>
                                              </div>
                                          </div>
                                          {/* Admin Actions */}
                                          {groups.find(g => g.id === activeChat.id)?.admins.includes(appUser.id) && memberId !== appUser.id && (
                                              <button onClick={() => handleKickMember(memberId)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Kick Member">
                                                  <UserMinus className="w-4 h-4"/>
                                              </button>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Danger Zone (Owner Only) */}
                      {groups.find(g => g.id === activeChat.id)?.ownerId === appUser.id && (
                          <div className="pt-6 border-t border-white/10 space-y-4">
                              <label className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-2"><AlertTriangle className="w-3 h-3"/> Danger Zone</label>
                              <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl space-y-4">
                                  <div>
                                      <div className="text-sm font-bold mb-1">Destroy Group</div>
                                      <div className="text-xs opacity-50 mb-3">Requires the private Deletion Key issued at creation.</div>
                                      <input type="password" value={deleteKeyInput} onChange={(e) => setDeleteKeyInput(e.target.value)} placeholder="Enter Deletion Key..." className="w-full bg-black/30 border border-red-500/30 rounded-lg px-3 py-2 text-sm outline-none mb-2" />
                                      <div className="flex gap-2">
                                          <button onClick={() => handleDeleteGroup('soft')} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-xs font-bold border border-red-500/30">Soft Delete (Hide)</button>
                                          <button onClick={() => handleDeleteGroup('hard')} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold">Hard Destroy</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center">
                      <button onClick={handleLeaveGroup} className="text-red-400 text-xs font-bold hover:underline flex items-center gap-2"><LogOut className="w-3 h-3"/> Leave Group</button>
                      <div className="text-[10px] opacity-30 font-mono">SECURE KEY ROTATION ACTIVE</div>
                  </div>
              </div>
          </div>
      )}

      {/* --- FORWARD MESSAGE MODAL --- */}
      {showForwardModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in zoom-in-95 duration-200">
              <div className={`w-full max-w-sm ${currentTheme.sidebar} border border-white/20 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[80vh]`}>
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2"><Share2 className="w-4 h-4"/> Forward To...</h3>
                      <button onClick={() => { setShowForwardModal(false); setMsgToForward(null); }}><X className="w-5 h-5 text-gray-500 hover:text-white"/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {/* Groups Section */}
                      {groups.length > 0 && <div className="px-2 py-1 text-[10px] font-bold opacity-50 uppercase">Groups</div>}
                      {groups.map(group => (
                          <button key={group.id} onClick={() => handleForward(group.id)} className="w-full p-3 rounded-lg hover:bg-white/10 flex items-center gap-3 text-left transition-colors">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><Users className="w-4 h-4 text-purple-400"/></div>
                              <div className="text-sm font-medium">{group.name}</div>
                          </button>
                      ))}
                      
                      {/* Contacts Section */}
                      <div className="px-2 py-1 text-[10px] font-bold opacity-50 uppercase mt-2">Contacts</div>
                      {contacts.map(contact => (
                          <button key={contact.id} onClick={() => handleForward(contact.unique_id)} className="w-full p-3 rounded-lg hover:bg-white/10 flex items-center gap-3 text-left transition-colors">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center"><User className="w-4 h-4 opacity-50"/></div>
                              <div className="text-sm font-medium">{contact.contact_nickname || contact.contact_username}</div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* --- CONNECT ID MODAL --- */}
      {showAddContact && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in zoom-in-95 duration-200">
              <div className={`w-full max-w-sm ${currentTheme.sidebar} border border-white/20 rounded-2xl overflow-hidden shadow-2xl relative p-6`}>
                  <button onClick={() => { setShowAddContact(false); setSearchQuery(""); }} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-5 h-5"/></button>
                  <div className="text-center mb-6">
                      <h2 className="text-xl font-bold flex items-center justify-center gap-2"><Search className={currentTheme.accent}/> Connect Identity</h2>
                      <p className="text-xs opacity-50 mt-1">Enter the 5-digit Secure ID to locate user.</p>
                  </div>
                  <div className="flex gap-2 mb-2">
                      <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="5-digit ID..." className={`flex-1 bg-black/40 border ${currentTheme.border} rounded-xl px-4 py-3 outline-none text-center font-mono text-lg tracking-widest`} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                  </div>
                  <button 
                      id="locate-btn"
                      onClick={handleSearch} 
                      className={`w-full py-3 mt-4 rounded-xl font-bold text-black ${currentTheme.accentBg} hover:opacity-90 transition-all flex items-center justify-center gap-2 ${getBlinkClass('locate-btn')}`}
                  >
                      <Search className="w-4 h-4"/> Locate Target
                  </button>
              </div>
          </div>
      )}

      {/* SEARCH RESULT MODAL (Verification Card) */}
      {searchResult && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in zoom-in-95 duration-200">
              <div className={`w-full max-w-sm ${currentTheme.sidebar} border border-white/20 rounded-2xl overflow-hidden shadow-2xl relative`}>
                  <button onClick={() => { setSearchResult(null); setSearchQuery(""); }} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-5 h-5"/></button>
                  <div className="h-24 bg-gradient-to-r from-blue-900 to-black"></div>
                  <div className="px-6 relative">
                      <div className="w-20 h-20 rounded-full border-4 border-black bg-black -mt-10 mb-4 overflow-hidden"><img src={searchResult.profile_pic} className="w-full h-full object-cover" /></div>
                      <div className="mb-6"><h2 className="text-xl font-bold text-white mb-1">{searchResult.username}</h2><div className="text-xs text-white/50 font-mono mb-3">ID: {searchResult.unique_id}</div><p className="text-sm text-gray-300 italic">"{searchResult.bio || "No mission status available."}"</p></div>
                      <div className="flex gap-3 mb-6"><div className="flex-1 bg-white/5 rounded p-2 text-center"><div className="text-xs text-white/40 uppercase font-bold">Status</div><div className="text-green-400 text-xs font-bold mt-1">Verified</div></div><div className="flex-1 bg-white/5 rounded p-2 text-center"><div className="text-xs text-white/40 uppercase font-bold">Joined</div><div className="text-white text-xs font-bold mt-1">Recently</div></div></div>
                      <button onClick={addContact} className={`w-full py-3 mb-6 rounded-xl font-bold text-black ${currentTheme.accentBg} hover:opacity-90 transition-all flex items-center justify-center gap-2`}><Check className="w-4 h-4"/> Confirm & Add Contact</button>
                  </div>
              </div>
          </div>
      )}

      {showCamera && (<div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"><video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" /><div className="absolute bottom-10 flex items-center gap-8"><button onClick={() => { setShowCamera(false); if(videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t=>t.stop()); }} className="p-4 rounded-full bg-gray-800 text-white"><X className="w-6 h-6"/></button><button onClick={capturePhoto} className="p-6 rounded-full border-4 border-white bg-transparent hover:bg-white/20 transition-all"></button></div></div>)}
      {isProfileOpen && (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className={`w-full max-w-lg ${currentTheme.sidebar} rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh]`}>
        <div className="p-5 border-b border-white/10 flex justify-between items-center"><h2 className="text-lg font-bold flex items-center gap-2"><Settings className={currentTheme.accent} /> Configuration</h2><button onClick={() => setIsProfileOpen(false)}><X className="w-5 h-5" /></button></div>
        <div className="flex border-b border-white/5"><button onClick={() => setSettingsView('profile')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${settingsView === 'profile' ? `bg-white/5 ${currentTheme.accent}` : 'opacity-50'}`}>Identity</button><button onClick={() => setSettingsView('themes')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${settingsView === 'themes' ? `bg-white/5 ${currentTheme.accent}` : 'opacity-50'}`}>Interface</button></div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{settingsView === 'profile' && (<div className="space-y-6"><div className="flex flex-col items-center gap-4"><div onClick={() => profileInputRef.current.click()} className={`w-24 h-24 rounded-full border-2 ${currentTheme.border} p-1 overflow-hidden relative group cursor-pointer`}><img src={editAvatar} className="w-full h-full rounded-full object-cover" /><div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-6 h-6"/></div></div><div className="grid grid-cols-6 gap-2">{AVATARS.map((url, i) => (<button key={i} onClick={() => setEditAvatar(url)} className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white"><img src={url} className="w-full h-full bg-black/20" /></button>))}</div></div><div className="space-y-3"><div><label className="text-[10px] uppercase font-bold opacity-50 mb-1 block">Display Name</label><input value={editNickname} onChange={(e) => setEditNickname(e.target.value)} className={`w-full bg-black/20 border border-white/10 rounded p-2.5 text-sm ${currentTheme.text}`} /></div><div><label className="text-[10px] uppercase font-bold opacity-50 mb-1 block">Status Message</label><div className="flex gap-2"><input value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className={`flex-1 bg-black/20 border border-white/10 rounded p-2.5 text-sm ${currentTheme.text}`} /><select onChange={(e) => setEditStatus(e.target.value)} className="bg-black/40 border border-white/10 rounded text-xs p-2 outline-none"><option value="Online">Online</option><option value="Busy">Busy</option><option value="Away">Away</option><option value="In Mission">In Mission</option></select></div></div><div><label className="text-[10px] uppercase font-bold opacity-50 mb-1 block">Bio / Mission</label><textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className={`w-full h-20 bg-black/20 border border-white/10 rounded p-2.5 text-sm ${currentTheme.text} resize-none`} /></div></div></div>)}{settingsView === 'themes' && (<div className="space-y-4"><button onClick={() => themeInputRef.current.click()} className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl hover:border-white/50 hover:bg-white/5 flex flex-col items-center justify-center gap-2 transition-all group"><ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-white"/><span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Upload Custom Background</span></button><div className="grid grid-cols-2 gap-3">{THEME_PRESETS.map(theme => (<button key={theme.id} onClick={() => setCurrentTheme(theme)} className={`p-3 rounded-xl border transition-all text-left relative overflow-hidden ${currentTheme.id === theme.id ? theme.border : 'border-white/10 hover:border-white/30'}`}><div className={`absolute inset-0 opacity-20 ${theme.bg}`}></div><div className="relative z-10"><div className="font-bold text-sm mb-1">{theme.name}</div><div className={`w-full h-2 rounded-full ${theme.accentBg}`}></div></div></button>))}</div></div>)}</div>
        <div className="p-5 border-t border-white/10 flex justify-end"><button onClick={saveProfile} className={`px-6 py-2.5 rounded-lg ${currentTheme.accentBg} text-black font-bold text-sm flex items-center gap-2 hover:opacity-90`}><Check className="w-4 h-4" /> Save Changes</button></div>
      </div></div>)}
    </div>
  );
}