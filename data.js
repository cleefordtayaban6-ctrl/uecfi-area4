/* ============================================================================
   UECFI AREA 4 — DATA FILE  (edit THIS file to add members and prayers)
   ----------------------------------------------------------------------------
   HOW IT WORKS
   • Put member photos in the "photos" folder (same folder as index.html),
     e.g. photos/juan-delacruz.jpg   (JPG/PNG, ideally under 300 KB each).
   • Fill in the lists below. Each entry needs a UNIQUE "id" that you never reuse.
   • Save the file, then open the app (or refresh). New entries are added
     automatically the first time they are seen. Existing entries are NOT
     overwritten, so anything edited/deleted inside the app is respected.
   • To CHANGE an entry that is already loaded, set  replaceExisting: true
     below (and bump "version"), refresh once, then set it back to false.
   • After editing, bump CACHE_NAME in sw.js (e.g. v5 -> v6) so installed
     phones receive the new data.

   MEMBER FIELDS
     id             unique text, e.g. "m-001"
     name           full name (required)
     status         "Junior FYS" | "Senior FYS" | "Katandaan"
     age            number
     position       text, or "" if none
     center         center name, e.g. "Centro Damasco"  (added to Centers automatically)
     spiritualGift  text
     photo          "photos/file-name.jpg"   or "" for initials only

   PRAYER FIELDS
     id        unique text, e.g. "pr-001"
     title     required
     language  "English" | "Tagalog" | "Ilocano" | any dialect name
     text      the prayer. Use \n for a new line, or write it between backticks ` `
                so you can paste several lines directly.
   ============================================================================ */
window.UECFI_DATA = {
  version: 1,
  replaceExisting: false,

  members: [
    // { id: "m-001", name: "Juan Dela Cruz", status: "Senior FYS", age: 24,
    //   position: "Secretary", center: "Centro Damasco",
    //   spiritualGift: "Teaching", photo: "photos/m-001.jpg" },
  ],

  prayers: [
    // { id: "pr-001", title: "Panagkararag ti Bigat", language: "Ilocano",
    //   text: `Line one of the prayer
    // Line two of the prayer` },
  ]
};
