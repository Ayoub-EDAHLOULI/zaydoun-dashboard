// The FAQ content. One source for the /faq page and its FAQPage structured data.
// Every answer reflects what zaydoun-api actually does; update it when that changes.

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        q: "What is Zaydoun?",
        a: "A reading companion for your own books. You upload a PDF, Zaydoun reads it page by page, and then you can ask him anything about it. Answers come from the passages he finds in your book, with the page they came from.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. Zaydoun works in your browser at zaydoun.ai. A mobile app with hands-free voice is on its way to the App Store and Google Play.",
      },
      {
        q: "How do I add my first book?",
        a: "Create an account, open Library and click Upload book. Choose a PDF, check the title and pick the language it's written in. Then click “Let Zaydoun read it”.",
      },
      {
        q: "How long does it take Zaydoun to read a book?",
        a: "It depends on the length of the book. The book shows Processing while he reads, and the Library tells you as soon as it's Ready. You can leave the page in the meantime.",
      },
    ],
  },
  {
    id: "books",
    title: "Books and PDFs",
    items: [
      {
        q: "What kind of files can I upload?",
        a: "PDFs up to 50 MB. They need real text inside, so a scanned book without a text layer can't be read yet.",
      },
      {
        q: "Which languages can my books be in?",
        a: "English, Arabic, French, Spanish and Chinese. Tell Zaydoun the book's language when you upload it. Arabic titles and text are shown right to left.",
      },
      {
        q: "What if Zaydoun fails to read a book?",
        a: "The book shows Failed in your Library, with a Try again button. If it keeps failing, the PDF may have no text layer (a scan) or be damaged.",
      },
      {
        q: "What happens when I delete a book?",
        a: "The book and every conversation about it are removed for good, and its slot on your shelf is freed.",
      },
    ],
  },
  {
    id: "answers",
    title: "Conversations and answers",
    items: [
      {
        q: "How do the page citations work?",
        a: "For each question, Zaydoun searches your book by meaning and picks the 5 most relevant passages. He answers from them, and the answer is tagged with the page of the passage he leaned on most.",
      },
      {
        q: "Why don't the page numbers match my printed book?",
        a: "They follow your PDF file. If the book has a cover or front matter, the PDF's page 1 isn't the printed page 1, so the numbers can be a few pages apart.",
      },
      {
        q: "Does Zaydoun only answer from my book?",
        a: "He starts from your book. If no passage fits your question, he answers from general knowledge about the book instead, and that answer has no page tag.",
      },
      {
        q: "Does he remember what we said earlier?",
        a: "Yes. Each answer takes your last 10 messages in that conversation into account, and every conversation is saved so you can pick it up later.",
      },
      {
        q: "Can I talk about a book in another language?",
        a: "Yes. The book's language and the reply language are separate. Choose the reply language when you start a conversation, and change it any time from the conversation's header.",
      },
      {
        q: "Can I have several conversations about the same book?",
        a: "As many as you like. Each one keeps its own history and its own list of pages cited.",
      },
    ],
  },
  {
    id: "voice",
    title: "Voice and mobile",
    items: [
      {
        q: "How does hands-free voice work?",
        a: "In the mobile app, turn on voice mode and say “Zaydoun”. Ask your question out loud and he answers out loud. The conversation is saved to your account like any other.",
      },
      {
        q: "Can I use voice on the web?",
        a: "Not yet. On the web you type for now. Voice on the web is on the way.",
      },
      {
        q: "Are my voice recordings kept?",
        a: "No. A recording is transcribed and then deleted from the server straight away. Only the text of the conversation is saved.",
      },
    ],
  },
  {
    id: "account",
    title: "Account and limits",
    items: [
      {
        q: "Is Zaydoun free?",
        a: "Yes. A free account holds 2 books and 15 messages a day.",
      },
      {
        q: "When does my daily message count reset?",
        a: "Every day at midnight UTC. The app shows the reset time in your own timezone.",
      },
      {
        q: "I forgot my password. What now?",
        a: "Use “Forgot password?” on the login page. We'll email you a reset link that works for one hour and only once. Resetting signs you out on your other devices.",
      },
      {
        q: "My account says it's deactivated.",
        a: "An admin has turned your account off. If you think that's a mistake, write to us from the contact page.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Profile and use Delete my account. Your books, conversations and account are removed for good.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    items: [
      {
        q: "Who can see my books and conversations?",
        a: "Only you. Your library and conversations are tied to your account, and every request is checked against it, so no other reader can reach them.",
      },
      {
        q: "Is my book sent anywhere?",
        a: "To read your book and answer your questions, its text, your questions and the passages Zaydoun finds are sent to OpenAI's API. Nothing else receives them.",
      },
    ],
  },
];

export const ALL_FAQS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);
